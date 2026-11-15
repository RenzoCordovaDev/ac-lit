import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { CardBasicPage } from '../pages/card-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

Then('el contenedor {string} muestra su título', async function (testId) {
  const component = componentProvider.find(CardBasicPage, testId);
  await component.waitForDisplayed();
  const { hasHeader } = await component.snapshot();
  if (!hasHeader) throw new Error(`El contenedor "${testId}" no muestra su título`);
});

Then('el contenedor {string} no muestra título', async function (testId) {
  const component = componentProvider.find(CardBasicPage, testId);
  await component.waitForDisplayed();
  const { hasHeader } = await component.snapshot();
  if (hasHeader) throw new Error(`El contenedor "${testId}" muestra un título`);
});

Then('el contenedor {string} muestra su pie', async function (testId) {
  const component = componentProvider.find(CardBasicPage, testId);
  await component.waitForDisplayed();
  const { footerVisible } = await component.snapshot();
  if (!footerVisible) throw new Error(`El contenedor "${testId}" no muestra su pie`);
});

Then('el contenedor {string} no muestra su pie', async function (testId) {
  const component = componentProvider.find(CardBasicPage, testId);
  await component.waitForDisplayed();
  const { footerVisible } = await component.snapshot();
  if (footerVisible) throw new Error(`El contenedor "${testId}" muestra un pie`);
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

When('el usuario activa el modo oscuro', async function () {
  const toggle = $('ac-demo-content').$('.ac-demo-content__theme-switcher [data-value="dark"]');
  await toggle.waitForDisplayed();
  await toggle.click();
});
