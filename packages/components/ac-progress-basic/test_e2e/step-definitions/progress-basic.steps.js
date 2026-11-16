import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { ProgressBasicPage } from '../pages/progress-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

When('el usuario selecciona el caso {string}', async function (index) {
  const select = $('ac-demo-content').$('.ac-demo-content__case-select');
  await select.waitForDisplayed();
  await select.selectByAttribute('value', index);
});

When('el usuario activa el modo oscuro', async function () {
  const toggle = $('ac-demo-content').$('.ac-demo-content__theme-switcher [data-value="dark"]');
  await toggle.waitForDisplayed();
  await toggle.click();
});

Then('el progreso {string} tiene un relleno con ancho {string}', async function (testId, width) {
  const progress = componentProvider.find(ProgressBasicPage, testId);
  await progress.fill.waitForExist();
  const style = await progress.fill.getAttribute('style');
  if (!style || !style.includes(`width: ${width}`)) {
    throw new Error(
      `Se esperaba que el relleno de "${testId}" tuviera "width: ${width}", pero su style fue "${style}".`,
    );
  }
});

Then('el progreso {string} no tiene el atributo {string}', async function (testId, attribute) {
  const progress = componentProvider.find(ProgressBasicPage, testId);
  await progress.track.waitForExist();
  const value = await progress.track.getAttribute(attribute);
  if (value !== null) {
    throw new Error(
      `Se esperaba que "${testId}" no tuviera el atributo "${attribute}", pero valía "${value}".`,
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
