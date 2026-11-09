import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { SelectBasicPage } from '../pages/select-basic.page.js';

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

When('el usuario elige la opción {string} en el selector {string}', async function (value, testId) {
  const select = componentProvider.find(SelectBasicPage, testId);
  await select.field.waitForDisplayed();
  await select.field.selectByAttribute('value', value);
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
  'el evento {string} con valor {string} se registra en el log',
  async function (eventName, value) {
    await browser.waitUntil(
      async () => {
        const texts = await eventLogEntries();
        return texts.some(
          entryText => entryText.includes(eventName) && entryText.includes(`"value": "${value}"`),
        );
      },
      {
        timeout: 3000,
        timeoutMsg: `No se encontró "${eventName}" con valor "${value}" en el panel de eventos`,
      },
    );
  },
);

Then('el selector {string} tiene el valor {string}', async function (testId, expected) {
  const select = componentProvider.find(SelectBasicPage, testId);
  const actual = await select.property('value');
  if (actual !== expected) {
    throw new Error(`Se esperaba el valor "${expected}" en "${testId}", pero fue "${actual}".`);
  }
});

Then('el selector {string} muestra la opción {string}', async function (testId, expected) {
  const select = componentProvider.find(SelectBasicPage, testId);
  await browser.waitUntil(async () => (await select.selectedText()) === expected, {
    timeout: 3000,
    timeoutMsg: `El selector "${testId}" no llegó a mostrar "${expected}"`,
  });
});

Then('el selector {string} está deshabilitado', async function (testId) {
  const select = componentProvider.find(SelectBasicPage, testId);
  if (await select.field.isEnabled()) {
    throw new Error(`Se esperaba que "${testId}" estuviera deshabilitado.`);
  }
});

Then('el selector {string} muestra el mensaje {string}', async function (testId, expected) {
  const select = componentProvider.find(SelectBasicPage, testId);
  await select.message.waitForDisplayed();
  const actual = (await select.message.getText()).trim();
  if (actual !== expected) {
    throw new Error(`Se esperaba el mensaje "${expected}", pero fue "${actual}".`);
  }
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
