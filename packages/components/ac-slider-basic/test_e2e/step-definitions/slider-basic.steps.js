import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { SliderBasicPage } from '../pages/slider-basic.page.js';

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

// Se enfoca con un click (que mueve el valor al punto pulsado) y luego se usa el
// teclado, que es determinista: Home/End van a los extremos y las flechas avanzan un paso.
async function focusSlider(testId) {
  const slider = componentProvider.find(SliderBasicPage, testId);
  await slider.field.waitForDisplayed();
  await slider.field.click();
  return slider;
}

When('el usuario lleva el slider {string} al máximo', async function (testId) {
  await focusSlider(testId);
  await browser.keys('End');
});

When('el usuario lleva el slider {string} al mínimo', async function (testId) {
  await focusSlider(testId);
  await browser.keys('Home');
});

When('el usuario avanza el slider {string} un paso desde el mínimo', async function (testId) {
  await focusSlider(testId);
  await browser.keys(['Home', 'ArrowRight']);
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
  'el evento {string} con valor numérico {int} se registra en el log',
  async function (eventName, value) {
    await browser.waitUntil(
      async () => {
        const texts = await eventLogEntries();
        return texts.some(
          entryText => entryText.includes(eventName) && entryText.includes(`"value": ${value}`),
        );
      },
      {
        timeout: 3000,
        timeoutMsg: `No se encontró "${eventName}" con valor ${value} en el panel de eventos`,
      },
    );
  },
);

Then('el slider {string} tiene el valor {int}', async function (testId, expected) {
  const slider = componentProvider.find(SliderBasicPage, testId);
  await browser.waitUntil(async () => (await slider.property('value')) === expected, {
    timeout: 3000,
    timeoutMsg: `El slider "${testId}" no llegó al valor ${expected}`,
  });
});

Then('el slider {string} muestra el texto {string}', async function (testId, expected) {
  const slider = componentProvider.find(SliderBasicPage, testId);
  await browser.waitUntil(async () => (await slider.valueOutput.getText()).trim() === expected, {
    timeout: 3000,
    timeoutMsg: `El slider "${testId}" no llegó a mostrar "${expected}"`,
  });
});

Then('el slider {string} está deshabilitado', async function (testId) {
  const slider = componentProvider.find(SliderBasicPage, testId);
  if (await slider.field.isEnabled()) {
    throw new Error(`Se esperaba que "${testId}" estuviera deshabilitado.`);
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
