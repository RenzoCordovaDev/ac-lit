import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { IconBasicPage } from '../pages/icon-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

Then('el ícono {string} renderiza el path {string}', async function (testId, expectedPath) {
  const component = componentProvider.find(IconBasicPage, testId);
  await component.waitForDisplayed();
  const { pathD } = await component.snapshot();
  if (pathD !== expectedPath) {
    throw new Error(`Se esperaba el path "${expectedPath}", pero se encontró "${pathD}".`);
  }
});

Then('el ícono {string} cae al ícono de fallback', async function (testId) {
  const component = componentProvider.find(IconBasicPage, testId);
  await component.waitForDisplayed();
  const { hasCircle, pathD } = await component.snapshot();
  if (!hasCircle || pathD !== null) {
    throw new Error('Se esperaba el ícono de fallback (un <circle> sin <path>).');
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
