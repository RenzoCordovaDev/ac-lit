import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { DividerBasicPage } from '../pages/divider-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

Then('el divisor {string} no muestra el label', async function (variant) {
  const divider = componentProvider.find(DividerBasicPage, variant);
  await divider.waitForDisplayed();
  const classAttr = await divider.rootPart.getAttribute('class');
  if (classAttr.includes('ac-divider-basic--with-label')) {
    throw new Error(
      `Se esperaba que el divisor "${variant}" no mostrara el label, pero sí lo muestra.`,
    );
  }
});

Then('el divisor {string} muestra el label', async function (variant) {
  const divider = componentProvider.find(DividerBasicPage, variant);
  await divider.waitForDisplayed();
  const classAttr = await divider.rootPart.getAttribute('class');
  if (!classAttr.includes('ac-divider-basic--with-label')) {
    throw new Error(
      `Se esperaba que el divisor "${variant}" mostrara el label, pero no lo muestra.`,
    );
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
