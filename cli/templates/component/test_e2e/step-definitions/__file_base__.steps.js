import { Given, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { __class_name__Page } from '../pages/__file_base__.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

Then('el componente contiene el texto {string}', async function (expectedText) {
  const component = componentProvider.find(__class_name__Page);
  await component.waitForDisplayed();
  const actualText = (await component.root.getText()).trim();
  if (actualText !== expectedText) {
    throw new Error(`Se esperaba el texto "${expectedText}", pero se encontró "${actualText}".`);
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
