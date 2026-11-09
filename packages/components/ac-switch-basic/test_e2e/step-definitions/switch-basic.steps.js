import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { SwitchBasicPage } from '../pages/switch-basic.page.js';

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

When('el usuario hace click en el interruptor {string}', async function (testId) {
  const toggle = componentProvider.find(SwitchBasicPage, testId);
  await toggle.waitForDisplayed();
  await toggle.click();
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
  'el evento {string} con checked {string} se registra en el log',
  async function (eventName, checked) {
    await browser.waitUntil(
      async () => {
        const texts = await eventLogEntries();
        return texts.some(
          entryText => entryText.includes(eventName) && entryText.includes(`"checked": ${checked}`),
        );
      },
      {
        timeout: 3000,
        timeoutMsg: `No se encontró "${eventName}" con checked=${checked} en el panel de eventos`,
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

Then('el interruptor {string} tiene checked igual a {string}', async function (testId, expected) {
  const toggle = componentProvider.find(SwitchBasicPage, testId);
  const actual = String(await toggle.property('checked'));
  if (actual !== expected) {
    throw new Error(`Se esperaba checked=${expected} en "${testId}", pero fue ${actual}.`);
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
