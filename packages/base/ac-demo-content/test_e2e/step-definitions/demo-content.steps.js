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

When('el usuario selecciona el dispositivo {string}', async function (label) {
  const button = this.demoContent.deviceButton(label);
  await button.waitForDisplayed();
  await button.click();
});

When('el usuario activa el switch de idioma', async function () {
  const toggle = this.demoContent.localeSwitch;
  await toggle.waitForDisplayed();
  await toggle.click();
});

When('el usuario abre el modal de eventos', async function () {
  const button = this.demoContent.eventsButton;
  await button.waitForDisplayed();
  await button.click();
});

Then('el elemento {string} es visible', async function (testId) {
  const el = await $(`[data-testid="${testId}"]`);
  await el.waitForDisplayed({ timeout: 3000 });
});

Then('el marco de dispositivo es {string}', async function (device) {
  const frame = this.demoContent.deviceFrame;
  await frame.waitForDisplayed();
  const className = await frame.getAttribute('class');
  if (!className.includes(`ac-demo-content__device-frame--${device}`)) {
    throw new Error(
      `Se esperaba el marco de dispositivo "${device}", pero las clases fueron "${className}".`,
    );
  }
});

Then('el switch de idioma queda en {string}', async function (expectedLocale) {
  const toggle = this.demoContent.localeSwitch;
  await toggle.waitForDisplayed();
  // El demo declara language="es-PE, en-EN" — checked=true significa en-EN activo.
  const expectedChecked = expectedLocale === 'en-EN' ? 'true' : 'false';
  const checked = await toggle.getAttribute('aria-checked');
  if (checked !== expectedChecked) {
    throw new Error(
      `Se esperaba el switch de idioma en "${expectedLocale}" (aria-checked="${expectedChecked}"), pero aria-checked="${checked}".`,
    );
  }
});

Then('el documento queda en data-theme {string}', async function (theme) {
  const current = await browser.execute(() => document.documentElement.getAttribute('data-theme'));
  if (current !== theme) {
    throw new Error(`Se esperaba data-theme="${theme}", pero se encontró "${current}".`);
  }
});

Then('el evento {string} aparece en el modal de eventos', async function (eventName) {
  const list = this.demoContent.eventsModalList;
  await browser.waitUntil(async () => (await list.getText()).includes(eventName), {
    timeout: 3000,
    timeoutMsg: `No se encontró "${eventName}" en el modal de eventos`,
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
