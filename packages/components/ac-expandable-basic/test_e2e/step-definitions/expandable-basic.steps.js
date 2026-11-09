import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { ExpandableBasicPage } from '../pages/expandable-basic.page.js';

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

When('el usuario hace click en la cabecera de {string}', async function (testId) {
  const panel = componentProvider.find(ExpandableBasicPage, testId);
  await panel.header.waitForDisplayed();
  await panel.clickHeader();
});

async function eventLogEntries() {
  const host = $('ac-demo-content');
  if (!(await host.$('.ac-demo-content__modal').isExisting())) {
    await host.$('.ac-demo-content__events-button').click();
  }
  const entries = await host.$$('.ac-demo-content__modal-entry');
  return entries.map(entry => entry.getText());
}

Then(
  'el evento {string} con open {string} se registra en el log',
  async function (eventName, open) {
    await browser.waitUntil(
      async () => {
        const texts = await eventLogEntries();
        return texts.some(
          entryText => entryText.includes(eventName) && entryText.includes(`"open": ${open}`),
        );
      },
      {
        timeout: 3000,
        timeoutMsg: `No se encontró "${eventName}" con open=${open} en el panel de eventos`,
      },
    );
  },
);

Then('el evento {string} no se registra en el log', async function (eventName) {
  await browser.pause(500);
  const texts = await eventLogEntries();
  if (texts.some(entryText => entryText.includes(eventName))) {
    throw new Error(`Se esperaba que "${eventName}" NO se registrara, pero se encontró.`);
  }
});

Then('el panel {string} tiene open igual a {string}', async function (testId, expected) {
  const panel = componentProvider.find(ExpandableBasicPage, testId);
  await browser.waitUntil(async () => String(await panel.property('open')) === expected, {
    timeout: 3000,
    timeoutMsg: `El panel "${testId}" no llegó a tener open=${expected}`,
  });
});

Then('el contenido del panel {string} es visible', async function (testId) {
  const panel = componentProvider.find(ExpandableBasicPage, testId);
  await panel.content.waitForDisplayed({ timeout: 3000 });
});

Then('el contenido del panel {string} está oculto', async function (testId) {
  const panel = componentProvider.find(ExpandableBasicPage, testId);
  await panel.content.waitForDisplayed({ timeout: 3000, reverse: true });
});

Then('la cabecera del panel {string} muestra {string}', async function (testId, expected) {
  const panel = componentProvider.find(ExpandableBasicPage, testId);
  await browser.waitUntil(async () => (await panel.header.getText()).trim() === expected, {
    timeout: 3000,
    timeoutMsg: `La cabecera de "${testId}" no llegó a mostrar "${expected}"`,
  });
});

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
