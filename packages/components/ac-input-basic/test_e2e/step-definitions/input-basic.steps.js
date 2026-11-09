import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { InputBasicPage } from '../pages/input-basic.page.js';

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

When('el usuario activa el modo oscuro', async function () {
  const toggle = $('ac-demo-content').$('.ac-demo-content__theme-switcher [data-value="dark"]');
  await toggle.waitForDisplayed();
  await toggle.click();
});

When('el usuario escribe {string} en el campo {string}', async function (text, testId) {
  const input = componentProvider.find(InputBasicPage, testId);
  await input.field.waitForDisplayed();
  await input.field.setValue(text);
});

When('el usuario hace click en la etiqueta del campo {string}', async function (testId) {
  const input = componentProvider.find(InputBasicPage, testId);
  await input.label.waitForDisplayed();
  await input.label.click();
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

Then('el campo {string} tiene el valor {string}', async function (testId, expected) {
  const input = componentProvider.find(InputBasicPage, testId);
  const actual = await input.field.getValue();
  if (actual !== expected) {
    throw new Error(`Se esperaba el valor "${expected}" en "${testId}", pero fue "${actual}".`);
  }
});

Then('el campo {string} está deshabilitado', async function (testId) {
  const input = componentProvider.find(InputBasicPage, testId);
  if (await input.field.isEnabled()) {
    throw new Error(`Se esperaba que "${testId}" estuviera deshabilitado.`);
  }
});

Then('el campo {string} tiene el foco', async function (testId) {
  const input = componentProvider.find(InputBasicPage, testId);
  await browser.waitUntil(async () => input.fieldHasFocus(), {
    timeout: 3000,
    timeoutMsg: `El campo "${testId}" no recibió el foco`,
  });
});

Then('el campo {string} muestra el mensaje {string}', async function (testId, expected) {
  const input = componentProvider.find(InputBasicPage, testId);
  await input.message.waitForDisplayed();
  const actual = (await input.message.getText()).trim();
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
