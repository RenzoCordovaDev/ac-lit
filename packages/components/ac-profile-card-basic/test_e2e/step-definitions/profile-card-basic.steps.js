import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { ProfileCardBasicPage } from '../pages/profile-card-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

When('el usuario activa el modo oscuro', async function () {
  const toggle = $('ac-demo-content').$('.ac-demo-content__theme-switcher [data-value="dark"]');
  await toggle.waitForDisplayed();
  await toggle.click();
});

Then('la tarjeta {string} muestra el nombre {string}', async function (testId, expected) {
  const card = componentProvider.find(ProfileCardBasicPage, testId);
  const actual = (await card.name.getText()).trim();
  if (actual !== expected) {
    throw new Error(`Se esperaba el nombre "${expected}", pero se encontró "${actual}".`);
  }
});

Then('la tarjeta {string} muestra el estado {string}', async function (testId, expected) {
  const card = componentProvider.find(ProfileCardBasicPage, testId);
  const actual = (await card.status.getText()).trim();
  if (actual !== expected) {
    throw new Error(`Se esperaba el estado "${expected}", pero se encontró "${actual}".`);
  }
});

Then('la tarjeta {string} no muestra estado', async function (testId) {
  const card = componentProvider.find(ProfileCardBasicPage, testId);
  if (await card.status.isExisting()) {
    throw new Error(`La tarjeta "${testId}" muestra estado y no debería.`);
  }
});

Then('la tarjeta {string} no muestra botón de acción', async function (testId) {
  const card = componentProvider.find(ProfileCardBasicPage, testId);
  if (await card.actionButton.isExisting()) {
    throw new Error(`La tarjeta "${testId}" muestra botón de acción y no debería.`);
  }
});

When('el usuario pulsa el botón de acción de la tarjeta {string}', async function (testId) {
  const card = componentProvider.find(ProfileCardBasicPage, testId);
  await card.actionButton.waitForClickable();
  await card.actionButton.click();
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
