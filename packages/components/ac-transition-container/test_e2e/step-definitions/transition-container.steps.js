import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { TransitionContainerPage } from '../pages/transition-container.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

When('el usuario selecciona el caso {string}', async function (index) {
  const select = $('ac-demo-content').$('.ac-demo-content__case-select');
  await select.waitForDisplayed();
  await select.selectByAttribute('value', index);
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

When('el usuario abre el contenedor con el botón {string}', async function (triggerTestId) {
  const trigger = $(`[data-testid="${triggerTestId}"]`);
  await trigger.waitForClickable();
  await trigger.click();
});

When('el usuario pulsa Escape', async function () {
  await browser.keys('Escape');
});

When('el usuario pulsa la flecha de volver del contenedor {string}', async function (testId) {
  const container = componentProvider.find(TransitionContainerPage, testId);
  await container.backButton.waitForClickable();
  await container.backButton.click();
});

When('el usuario pulsa el ícono de menú del contenedor {string}', async function (testId) {
  const container = componentProvider.find(TransitionContainerPage, testId);
  await container.menuButton.waitForClickable();
  await container.menuButton.click();
});

async function waitForContainerVisible(testId, expected) {
  const container = componentProvider.find(TransitionContainerPage, testId);
  await browser.waitUntil(async () => (await container.snapshot()).visible === expected, {
    timeout: 4000,
    timeoutMsg: `El contenedor "${testId}" no llegó a estar ${expected ? 'visible' : 'cerrado'}`,
  });
}

Then('el contenedor {string} está visible', async function (testId) {
  await waitForContainerVisible(testId, true);
});

Then('el contenedor {string} está cerrado', async function (testId) {
  await waitForContainerVisible(testId, false);
});

Then('el título del contenedor {string} es {string}', async function (testId, expected) {
  const container = componentProvider.find(TransitionContainerPage, testId);
  await browser.waitUntil(async () => (await container.snapshot()).title === expected, {
    timeout: 3000,
    timeoutMsg: `El título de "${testId}" no llegó a ser "${expected}"`,
  });
});

async function eventLogEntries() {
  const host = $('ac-demo-content');
  if (!(await host.$('.ac-demo-content__modal').isExisting())) {
    await host.$('.ac-demo-content__events-button').click();
  }
  const entries = await host.$$('.ac-demo-content__modal-entry');
  return entries.map(entry => entry.getText());
}

Then('el evento {string} se registra en el log', async function (eventName) {
  await browser.waitUntil(
    async () => (await eventLogEntries()).some(entryText => entryText.includes(eventName)),
    { timeout: 3000, timeoutMsg: `No se encontró "${eventName}" en el panel de eventos` },
  );
});

Then(
  'el evento {string} con motivo {string} se registra en el log',
  async function (eventName, reason) {
    await browser.waitUntil(
      async () =>
        (await eventLogEntries()).some(
          entryText => entryText.includes(eventName) && entryText.includes(`"reason": "${reason}"`),
        ),
      {
        timeout: 3000,
        timeoutMsg: `No se encontró "${eventName}" con motivo "${reason}" en el panel de eventos`,
      },
    );
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
