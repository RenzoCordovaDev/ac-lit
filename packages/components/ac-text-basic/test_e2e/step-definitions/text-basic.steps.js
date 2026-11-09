import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { TextBasicPage } from '../pages/text-basic.page.js';

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

Then('el texto {string} muestra {string}', async function (testId, expectedText) {
  const component = componentProvider.find(TextBasicPage, testId);
  await component.waitForDisplayed();
  await browser.waitUntil(async () => (await component.root.getText()).trim() === expectedText, {
    timeout: 3000,
    timeoutMsg: `El texto "${testId}" no llegó a mostrar "${expectedText}"`,
  });
});

Then('el texto {string} se renderiza como {string}', async function (testId, tagName) {
  const component = componentProvider.find(TextBasicPage, testId);
  await component.waitForDisplayed();
  const actual = (await component.renderedElement.getProperty('tagName')).toLowerCase();
  if (actual !== tagName) {
    throw new Error(`Se esperaba la etiqueta "${tagName}", pero se encontró "${actual}".`);
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
