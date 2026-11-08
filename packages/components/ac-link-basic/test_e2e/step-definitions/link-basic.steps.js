import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { LinkBasicPage } from '../pages/link-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

When('el usuario hace click en el link {string}', async function (state) {
  const link = componentProvider.find(LinkBasicPage, state);
  await link.waitForDisplayed();
  await link.click();
});

async function eventLogContains(eventName) {
  const host = $('ac-demo-content');
  if (!(await host.$('.ac-demo-content__modal').isExisting())) {
    await host.$('.ac-demo-content__events-button').click();
  }
  const entries = await host.$$('.ac-demo-content__modal-entry');
  const texts = await entries.map(entry => entry.getText());
  return texts.some(text => text.includes(eventName));
}

Then('el evento {string} se registra en el log', async function (eventName) {
  await browser.waitUntil(() => eventLogContains(eventName), {
    timeout: 3000,
    timeoutMsg: `No se encontró "${eventName}" en el modal de eventos`,
  });
});

Then('el evento {string} no se registra en el log', async function (eventName) {
  await browser.pause(500);
  if (await eventLogContains(eventName)) {
    throw new Error(
      `Se esperaba que "${eventName}" NO se registrara, pero se encontró en el modal de eventos.`,
    );
  }
});

When('el usuario activa el modo oscuro', async function () {
  const toggle = $('ac-demo-content').$('.ac-demo-content__theme-toggle');
  await toggle.waitForDisplayed();
  await toggle.click();
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
