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

When('el usuario selecciona el dispositivo {string}', async function (key) {
  const button = this.demoContent.deviceButton(key);
  await button.waitForDisplayed();
  await button.click();
});

When('el usuario selecciona el tema {string}', async function (theme) {
  const button = this.demoContent.themeButton(theme);
  await button.waitForDisplayed();
  await button.click();
});

When('el usuario selecciona el idioma {string}', async function (index) {
  const button = this.demoContent.languageButton(index);
  await button.waitForDisplayed();
  await button.click();
});

When('el usuario selecciona la vista {string}', async function (mode) {
  const button = this.demoContent.viewModeButton(mode);
  await button.waitForDisplayed();
  await button.click();
});

When('el usuario abre el panel de eventos', async function () {
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

Then('el idioma activo es {string}', async function (index) {
  const button = this.demoContent.languageButton(index);
  const isActive = (await button.getAttribute('class')).includes(
    'ac-demo-content__segmented-button--active',
  );
  if (!isActive) {
    throw new Error(`Se esperaba el idioma en el índice "${index}" activo, pero no lo está.`);
  }
});

Then('la vista de código contiene {string}', async function (expectedText) {
  const codeBlock = this.demoContent.codeBlock;
  await codeBlock.waitForDisplayed();
  const text = await codeBlock.getText();
  if (!text.includes(expectedText)) {
    throw new Error(`Se esperaba "${expectedText}" en la vista de código, pero no se encontró.`);
  }
});

Then('el documento queda en data-theme {string}', async function (theme) {
  const current = await browser.execute(() => document.documentElement.getAttribute('data-theme'));
  if (current !== theme) {
    throw new Error(`Se esperaba data-theme="${theme}", pero se encontró "${current}".`);
  }
});

Then(
  'el evento {string} aparece en el panel de eventos con su etiqueta',
  async function (eventName) {
    const list = this.demoContent.eventsPanelList;
    await browser.waitUntil(
      async () => {
        const text = await list.getText();
        return text.includes('Evento:') && text.includes(eventName) && text.includes('Hora:');
      },
      {
        timeout: 3000,
        timeoutMsg: `No se encontró "${eventName}" (con su etiqueta "Evento:") en el panel de eventos`,
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
