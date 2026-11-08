import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { DemoContentPage } from '../pages/demo-content.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
  this.demoContent = componentProvider.find(DemoContentPage);
});

When('el usuario selecciona el caso {string}', async function (index) {
  const select = this.demoContent.caseSelect;
  await select.waitForDisplayed();
  await select.selectByAttribute('value', index);
});

When('el usuario hace click en el elemento {string}', async function (testId) {
  const el = await $(`[data-testid="${testId}"]`);
  await el.waitForDisplayed();
  await el.click();
});

When('el usuario activa el toggle de tema', async function () {
  const toggle = this.demoContent.themeToggle;
  await toggle.waitForDisplayed();
  await toggle.click();
});

When('el usuario selecciona el tamaño {string}', async function (size) {
  const select = this.demoContent.sizeSelect;
  await select.waitForDisplayed();
  await select.selectByAttribute('value', size);
});

Then('el elemento {string} es visible', async function (testId) {
  const el = await $(`[data-testid="${testId}"]`);
  await el.waitForDisplayed({ timeout: 3000 });
});

Then('el evento {string} se registra en el panel', async function (eventName) {
  const log = this.demoContent.eventLog;
  await browser.waitUntil(async () => (await log.getText()).includes(eventName), {
    timeout: 3000,
    timeoutMsg: `No se encontró "${eventName}" en el panel de eventos`,
  });
});

Then('el documento queda en data-theme {string}', async function (theme) {
  const current = await browser.execute(() => document.documentElement.getAttribute('data-theme'));
  if (current !== theme) {
    throw new Error(`Se esperaba data-theme="${theme}", pero se encontró "${current}".`);
  }
});

Then('el viewport tiene max-width {string}', async function (expected) {
  const viewport = $('[data-testid="demo-content"]').$('.ac-demo-content__viewport');
  await viewport.waitForDisplayed();
  const style = await viewport.getAttribute('style');
  if (!style || !style.includes(expected)) {
    throw new Error(
      `Se esperaba max-width "${expected}" en el viewport, pero el style fue "${style}".`,
    );
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
