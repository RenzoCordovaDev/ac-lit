import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { ModalBasicPage } from '../pages/modal-basic.page.js';

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

When('el usuario abre el modal con el botón {string}', async function (triggerTestId) {
  const trigger = $(`[data-testid="${triggerTestId}"]`);
  await trigger.waitForDisplayed();
  await trigger.click();
});

When('el usuario pulsa Escape', async function () {
  await browser.keys('Escape');
});

When('el usuario hace click fuera del modal', async function () {
  // La esquina superior izquierda del marco (el modal "offset" deja un hueco
  // arriba) es el backdrop. Si el modal está "contenido" dentro de un
  // ac-demo-content, ese marco es el dispositivo simulado, no el viewport real.
  const corner = await browser.execute(() => {
    const demoContent = document.querySelector('ac-demo-content');
    const viewport = demoContent?.shadowRoot.querySelector('.ac-demo-content__viewport');
    const rect = (viewport ?? document.documentElement).getBoundingClientRect();
    return { x: rect.left + 10, y: rect.top + 10 };
  });
  await browser
    .action('pointer')
    .move({ x: Math.round(corner.x), y: Math.round(corner.y), origin: 'viewport' })
    .down()
    .up()
    .perform();
});

When('el usuario cierra el modal {string} con su botón de cerrar', async function (testId) {
  const modal = componentProvider.find(ModalBasicPage, testId);
  await modal.closeButton.waitForDisplayed();
  await modal.closeButton.click();
});

When('el usuario pulsa el botón principal del modal {string}', async function (testId) {
  const modal = componentProvider.find(ModalBasicPage, testId);
  await modal.primaryButton.waitForDisplayed();
  await modal.primaryButton.click();
});

When('el usuario pulsa el botón secundario del modal {string}', async function (testId) {
  const modal = componentProvider.find(ModalBasicPage, testId);
  await modal.secondaryButton.waitForDisplayed();
  await modal.secondaryButton.click();
});

When('el usuario pulsa el enlace del modal {string}', async function (testId) {
  const modal = componentProvider.find(ModalBasicPage, testId);
  await modal.link.waitForDisplayed();
  await modal.link.click();
});

async function waitForModalOpen(testId, expected) {
  const modal = componentProvider.find(ModalBasicPage, testId);
  await browser.waitUntil(async () => (await modal.snapshot()).open === expected, {
    timeout: 4000,
    timeoutMsg: `El modal "${testId}" no llegó a estar ${expected ? 'abierto' : 'cerrado'}`,
  });
}

Then('el modal {string} está abierto', async function (testId) {
  await waitForModalOpen(testId, true);
});

Then('el modal {string} está cerrado', async function (testId) {
  await waitForModalOpen(testId, false);
});

Then('el título del modal {string} es {string}', async function (testId, expected) {
  const modal = componentProvider.find(ModalBasicPage, testId);
  await browser.waitUntil(async () => (await modal.snapshot()).title === expected, {
    timeout: 3000,
    timeoutMsg: `El título de "${testId}" no llegó a ser "${expected}"`,
  });
});

Then('el modal {string} ocupa la mitad de la altura de la pantalla', async function (testId) {
  const modal = componentProvider.find(ModalBasicPage, testId);
  await browser.waitUntil(
    async () => {
      const { height, viewportHeight } = await modal.snapshot();
      return Math.abs(height / viewportHeight - 0.5) < 0.02;
    },
    { timeout: 3000, timeoutMsg: `El modal "${testId}" no ocupa la mitad de la pantalla` },
  );
});

Then('el modal {string} ocupa toda la altura de la pantalla', async function (testId) {
  const modal = componentProvider.find(ModalBasicPage, testId);
  await browser.waitUntil(
    async () => {
      const { height, viewportHeight } = await modal.snapshot();
      return Math.abs(height - viewportHeight) < 2;
    },
    { timeout: 3000, timeoutMsg: `El modal "${testId}" no ocupa toda la pantalla` },
  );
});

Then('el modal {string} deja un espacio arriba', async function (testId) {
  const modal = componentProvider.find(ModalBasicPage, testId);
  await browser.waitUntil(
    async () => {
      const { top, viewportTop, height, viewportHeight } = await modal.snapshot();
      return top - viewportTop > 8 && height < viewportHeight;
    },
    { timeout: 3000, timeoutMsg: `El modal "${testId}" no deja espacio arriba` },
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
