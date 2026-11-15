import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { ToastBasicPage } from '../pages/toast-basic.page.js';

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

When('el usuario pulsa el botón {string}', async function (triggerTestId) {
  const trigger = $(`[data-testid="${triggerTestId}"]`);
  await trigger.waitForDisplayed();
  await trigger.click();
});

When('el usuario cierra el toast {string} con su botón de cerrar', async function (testId) {
  const toast = componentProvider.find(ToastBasicPage, testId);
  await toast.closeButton.waitForDisplayed();
  await toast.closeButton.click();
});

When('el usuario pulsa la acción del toast {string}', async function (testId) {
  const toast = componentProvider.find(ToastBasicPage, testId);
  await toast.actionButton.waitForDisplayed();
  await toast.actionButton.click();
});

async function waitForShown(testId, expected, timeout = 5000) {
  const toast = componentProvider.find(ToastBasicPage, testId);
  await browser.waitUntil(async () => (await toast.snapshot()).shown === expected, {
    timeout,
    timeoutMsg: `El toast "${testId}" no llegó a estar ${expected ? 'visible' : 'oculto'}`,
  });
}

Then('el toast {string} está visible', async function (testId) {
  await waitForShown(testId, true);
});

Then('el toast {string} se oculta solo', async function (testId) {
  await waitForShown(testId, false, 6000);
});

Then('el toast {string} sigue visible tras {int} segundos', async function (testId, seconds) {
  await browser.pause(seconds * 1000);
  const toast = componentProvider.find(ToastBasicPage, testId);
  if (!(await toast.snapshot()).shown) {
    throw new Error(`Se esperaba que "${testId}" siguiera visible tras ${seconds} s.`);
  }
});

Then('el toast {string} está oculto', async function (testId) {
  await waitForShown(testId, false);
});

Then('el toast {string} muestra el texto {string}', async function (testId, expected) {
  const toast = componentProvider.find(ToastBasicPage, testId);
  await browser.waitUntil(async () => (await toast.snapshot()).text.includes(expected), {
    timeout: 3000,
    timeoutMsg: `El toast "${testId}" no llegó a mostrar "${expected}"`,
  });
});

Then('el toast {string} aparece arriba de la pantalla', async function (testId) {
  const toast = componentProvider.find(ToastBasicPage, testId);
  await browser.waitUntil(
    async () => {
      const { top, viewportTop } = await toast.snapshot();
      return top - viewportTop < 100;
    },
    { timeout: 3000, timeoutMsg: `El toast "${testId}" no aparece arriba` },
  );
});

Then('el toast {string} aparece abajo de la pantalla', async function (testId) {
  const toast = componentProvider.find(ToastBasicPage, testId);
  await browser.waitUntil(
    async () => {
      const { bottom, viewportBottom } = await toast.snapshot();
      return viewportBottom - bottom < 100;
    },
    { timeout: 3000, timeoutMsg: `El toast "${testId}" no aparece abajo` },
  );
});

Then('el toast {string} no se superpone con el toast {string}', async function (upper, lower) {
  // El desplazamiento del apilado se anima (transition de bottom/top): se espera a que asiente.
  await browser.waitUntil(
    async () => {
      const a = await componentProvider.find(ToastBasicPage, upper).snapshot();
      const b = await componentProvider.find(ToastBasicPage, lower).snapshot();
      const [higher, lowerOne] = a.top < b.top ? [a, b] : [b, a];
      return higher.bottom <= lowerOne.top + 1;
    },
    { timeout: 3000, timeoutMsg: `Los toasts "${upper}" y "${lower}" se superponen` },
  );
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
        timeout: 5000,
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
