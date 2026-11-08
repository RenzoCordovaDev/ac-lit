import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { RadioBasicPage, RADIO_SELECTORS } from '../pages/radio-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

When('el usuario selecciona la opción {string}', async function (key) {
  const radio = componentProvider.find(RadioBasicPage, key);
  await radio.waitForDisplayed();
  await radio.click();
});

When('el usuario hace click en la opción {string}', async function (key) {
  const radio = componentProvider.find(RadioBasicPage, key);
  await radio.waitForDisplayed();
  await radio.click();
});

async function eventLogContains(text) {
  const entries = await $$('#event-log div');
  const texts = await entries.map(entry => entry.getText());
  return texts.some(entryText => entryText.includes(text));
}

Then(
  'el evento {string} con valor {string} se registra en el log',
  async function (eventName, value) {
    await browser.waitUntil(() => eventLogContains(`${eventName}: ${value}`), {
      timeout: 3000,
      timeoutMsg: `No se encontró "${eventName}: ${value}" en el log de eventos`,
    });
  },
);

Then('el evento {string} no se registra en el log', async function (eventName) {
  await browser.pause(500);
  if (await eventLogContains(eventName)) {
    throw new Error(`Se esperaba que "${eventName}" NO se registrara, pero se encontró en el log.`);
  }
});

Then('la opción {string} queda desmarcada', async function (key) {
  const selector = RADIO_SELECTORS[key];
  const checked = await browser.execute(sel => document.querySelector(sel).checked, selector);
  if (checked) {
    throw new Error(`Se esperaba que la opción "${key}" quedara desmarcada, pero sigue marcada.`);
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
