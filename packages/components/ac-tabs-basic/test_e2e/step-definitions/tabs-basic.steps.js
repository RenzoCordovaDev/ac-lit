import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { TabsBasicPage } from '../pages/tabs-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

When('el usuario selecciona el caso {string}', async function (index) {
  const select = $('ac-demo-content').$('.ac-demo-content__case-select');
  await select.waitForDisplayed();
  await select.selectByAttribute('value', index);
});

When('el usuario selecciona el ambient {string}', async function (ambient) {
  const select = $('ac-demo-content').$('.ac-demo-content__ambient-select');
  await select.waitForDisplayed();
  await select.selectByAttribute('value', ambient);
});

When('el usuario selecciona el idioma {string}', async function (index) {
  const button = $('ac-demo-content').$(
    `.ac-demo-content__locale-switcher [data-value="${index}"]`,
  );
  await button.waitForDisplayed();
  await button.click();
});

When('el usuario activa el modo oscuro', async function () {
  const toggle = $('ac-demo-content').$('.ac-demo-content__theme-switcher [data-value="dark"]');
  await toggle.waitForDisplayed();
  await toggle.click();
});

When('el usuario hace click en la pestaña {string} de {string}', async function (id, testId) {
  const tabs = componentProvider.find(TabsBasicPage, testId);
  await tabs.tab(id).waitForDisplayed();
  await tabs.tab(id).click();
});

When('el usuario pulsa la tecla {string}', async function (key) {
  await browser.keys(key);
});

async function eventLogEntries() {
  const host = $('ac-demo-content');
  if (!(await host.$('.ac-demo-content__modal').isExisting())) {
    await host.$('.ac-demo-content__events-button').click();
  }
  const entries = await host.$$('.ac-demo-content__modal-entry');
  return entries.map(entry => entry.getText());
}

Then('el evento {string} con id {string} se registra en el log', async function (eventName, id) {
  await browser.waitUntil(
    async () =>
      (await eventLogEntries()).some(
        entryText => entryText.includes(eventName) && entryText.includes(`"id": "${id}"`),
      ),
    {
      timeout: 3000,
      timeoutMsg: `No se encontró "${eventName}" con id "${id}" en el panel de eventos`,
    },
  );
});

Then('el evento {string} no se registra en el log', async function (eventName) {
  await browser.pause(500);
  if ((await eventLogEntries()).some(entryText => entryText.includes(eventName))) {
    throw new Error(`Se esperaba que "${eventName}" NO se registrara, pero se encontró.`);
  }
});

Then('la pestaña activa de {string} es {string}', async function (testId, expected) {
  const tabs = componentProvider.find(TabsBasicPage, testId);
  await browser.waitUntil(async () => (await tabs.activeTabId()) === expected, {
    timeout: 3000,
    timeoutMsg: `La pestaña activa de "${testId}" no llegó a ser "${expected}"`,
  });
});

Then('la pestaña {string} de {string} tiene el foco', async function (id, testId) {
  const tabs = componentProvider.find(TabsBasicPage, testId);
  await browser.waitUntil(async () => (await tabs.focusedTabId()) === id, {
    timeout: 3000,
    timeoutMsg: `La pestaña "${id}" de "${testId}" no recibió el foco`,
  });
});

Then('el panel {string} es visible', async function (panelTestId) {
  await $(`[data-testid="${panelTestId}"]`).waitForDisplayed({ timeout: 3000 });
});

Then('el panel {string} está oculto', async function (panelTestId) {
  await $(`[data-testid="${panelTestId}"]`).waitForDisplayed({ timeout: 3000, reverse: true });
});

Then('la pestaña {string} de {string} está deshabilitada', async function (id, testId) {
  const tabs = componentProvider.find(TabsBasicPage, testId);
  if (await tabs.tab(id).isEnabled()) {
    throw new Error(`Se esperaba que la pestaña "${id}" estuviera deshabilitada.`);
  }
});

Then(
  'la pestaña {string} de {string} muestra el texto {string}',
  async function (id, testId, expected) {
    const tabs = componentProvider.find(TabsBasicPage, testId);
    await browser.waitUntil(async () => (await tabs.tab(id).getText()).trim() === expected, {
      timeout: 3000,
      timeoutMsg: `La pestaña "${id}" no llegó a mostrar "${expected}"`,
    });
  },
);

Then('el demo no tiene violaciones de accesibilidad WCAG', async function () {
  const results = await runAccessibilityCheck();
  if (results.violations.length > 0) {
    const summary = results.violations
      .map(violation => {
        const targets = violation.nodes.map(node => node.target.join(' ')).join(', ');
        return `- ${violation.id}: ${violation.help} (${targets})`;
      })
      .join('\n');
    throw new Error(
      `Se encontraron ${results.violations.length} violaciones de accesibilidad:\n${summary}`,
    );
  }
});
