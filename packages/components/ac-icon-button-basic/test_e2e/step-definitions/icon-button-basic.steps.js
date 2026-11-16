import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { IconButtonBasicPage } from '../pages/icon-button-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

When('el usuario hace click en el botón {string}', async function (testId) {
  const button = componentProvider.find(IconButtonBasicPage, testId);
  await button.waitForDisplayed();
  await button.click();
});

Then('el contador de clicks muestra {string}', async function (expectedCount) {
  const counter = $('[data-testid="icon-button-click-count"]');
  await browser.waitUntil(async () => (await counter.getText()) === expectedCount, {
    timeout: 3000,
    timeoutMsg: `Se esperaba que el contador mostrara "${expectedCount}"`,
  });
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
