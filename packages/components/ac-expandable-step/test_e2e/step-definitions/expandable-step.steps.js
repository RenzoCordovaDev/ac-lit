import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { ExpandableStepPage } from '../pages/expandable-step.page.js';

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

When('el usuario hace click en el link "Modificar" de {string}', async function (testId) {
  const step = componentProvider.find(ExpandableStepPage, testId);
  await step.edit.waitForDisplayed();
  await step.edit.click();
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
    async () => {
      const texts = await eventLogEntries();
      return texts.some(entryText => entryText.includes(eventName));
    },
    {
      timeout: 3000,
      timeoutMsg: `No se encontró "${eventName}" en el panel de eventos`,
    },
  );
});

Then('el paso {string} muestra el título {string}', async function (testId, expected) {
  const step = componentProvider.find(ExpandableStepPage, testId);
  await browser.waitUntil(async () => (await step.header.getText()).trim() === expected, {
    timeout: 3000,
    timeoutMsg: `El paso "${testId}" no llegó a mostrar el título "${expected}"`,
  });
});

Then('el paso {string} muestra el resumen {string}', async function (testId, expected) {
  const step = componentProvider.find(ExpandableStepPage, testId);
  await browser.waitUntil(async () => (await step.summary.getText()).trim() === expected, {
    timeout: 3000,
    timeoutMsg: `El paso "${testId}" no llegó a mostrar el resumen "${expected}"`,
  });
});

Then('el paso {string} muestra el contador {string}', async function (testId, expected) {
  const step = componentProvider.find(ExpandableStepPage, testId);
  await browser.waitUntil(async () => (await step.counter.getText()).trim() === expected, {
    timeout: 3000,
    timeoutMsg: `El paso "${testId}" no llegó a mostrar el contador "${expected}"`,
  });
});

Then(
  'el paso {string} muestra el link "Modificar" como {string}',
  async function (testId, expected) {
    const step = componentProvider.find(ExpandableStepPage, testId);
    await browser.waitUntil(async () => (await step.edit.getText()).trim() === expected, {
      timeout: 3000,
      timeoutMsg: `El link "Modificar" de "${testId}" no llegó a mostrar "${expected}"`,
    });
  },
);

Then('el contenido del paso {string} es visible', async function (testId) {
  const step = componentProvider.find(ExpandableStepPage, testId);
  await step.content.waitForDisplayed({ timeout: 3000 });
});

Then('el paso {string} no muestra el link "Modificar"', async function (testId) {
  const step = componentProvider.find(ExpandableStepPage, testId);
  if (await step.edit.isExisting()) {
    throw new Error(`Se esperaba que "${testId}" NO mostrara el link "Modificar".`);
  }
});

Then('el paso {string} tiene completed igual a {string}', async function (testId, expected) {
  const step = componentProvider.find(ExpandableStepPage, testId);
  await browser.waitUntil(async () => String(await step.property('completed')) === expected, {
    timeout: 3000,
    timeoutMsg: `El paso "${testId}" no llegó a tener completed=${expected}`,
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
