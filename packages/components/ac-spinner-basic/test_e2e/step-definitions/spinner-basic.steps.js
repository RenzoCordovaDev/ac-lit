import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { SpinnerBasicPage } from '../pages/spinner-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

Then('el spinner {string} tiene role {string}', async function (testId, expectedRole) {
  const component = componentProvider.find(SpinnerBasicPage, testId);
  await component.waitForDisplayed();
  const { role } = await component.snapshot();
  if (role !== expectedRole) {
    throw new Error(`Se esperaba role="${expectedRole}", pero se encontró "${role}".`);
  }
});

Then('el spinner {string} tiene la etiqueta {string}', async function (testId, expectedLabel) {
  const component = componentProvider.find(SpinnerBasicPage, testId);
  await component.waitForDisplayed();
  const { labelText } = await component.snapshot();
  if (labelText !== expectedLabel) {
    throw new Error(`Se esperaba la etiqueta "${expectedLabel}", pero se encontró "${labelText}".`);
  }
});

When('el usuario activa el modo oscuro', async function () {
  const toggle = $('ac-demo-content').$('.ac-demo-content__theme-switcher [data-value="dark"]');
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
