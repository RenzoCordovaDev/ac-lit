import { Given, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { BadgeBasicPage } from '../pages/badge-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

Then('el badge {string} contiene el texto {string}', async function (variant, expectedText) {
  const badge = componentProvider.find(BadgeBasicPage, variant);
  await badge.waitForDisplayed();
  const actualText = (await badge.root.getText()).trim();
  if (actualText !== expectedText) {
    throw new Error(
      `Se esperaba el texto "${expectedText}" en el badge "${variant}", pero se encontró "${actualText}".`,
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
