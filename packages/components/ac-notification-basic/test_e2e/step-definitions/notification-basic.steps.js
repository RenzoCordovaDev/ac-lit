import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { NotificationBasicPage } from '../pages/notification-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

When('el usuario activa el modo oscuro', async function () {
  const toggle = $('ac-demo-content').$('.ac-demo-content__theme-switcher [data-value="dark"]');
  await toggle.waitForDisplayed();
  await toggle.click();
});

Then('la notificación {string} está visible', async function (testId) {
  const notification = componentProvider.find(NotificationBasicPage, testId);
  await notification.waitForDisplayed();
});

When('el usuario pulsa el botón de cerrar de la notificación {string}', async function (testId) {
  const notification = componentProvider.find(NotificationBasicPage, testId);
  await notification.dismissButton.click();
});

Then('la notificación {string} ya no existe en el DOM', async function (testId) {
  const notification = componentProvider.find(NotificationBasicPage, testId);
  await browser.waitUntil(async () => !(await notification.root.isExisting()), {
    timeout: 3000,
    timeoutMsg: `La notificación "${testId}" sigue existiendo en el DOM`,
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
