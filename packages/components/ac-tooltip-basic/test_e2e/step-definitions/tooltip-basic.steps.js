import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { TooltipBasicPage } from '../pages/tooltip-basic.page.js';

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

When('el usuario pasa el mouse sobre el trigger de {string}', async function (testId) {
  const tooltip = componentProvider.find(TooltipBasicPage, testId);
  await tooltip.trigger.waitForDisplayed();
  await tooltip.trigger.moveTo();
});

When('el usuario quita el mouse del trigger de {string}', async function (_testId) {
  // Mueve el mouse a la esquina superior izquierda del viewport, lejos de
  // cualquier trigger, para disparar `mouseleave` sobre el que esté activo
  // (mismo patrón de `browser.action('pointer')` que usa ac-modal-basic).
  await browser.action('pointer').move({ x: 0, y: 0, origin: 'viewport' }).perform();
});

When('el usuario enfoca con teclado el trigger de {string}', async function (testId) {
  const tooltip = componentProvider.find(TooltipBasicPage, testId);
  await tooltip.trigger.waitForDisplayed();
  await browser.execute(el => el.focus(), await tooltip.trigger);
});

When('el usuario quita el foco del trigger de {string}', async function (testId) {
  const tooltip = componentProvider.find(TooltipBasicPage, testId);
  await browser.execute(el => el.blur(), await tooltip.trigger);
});

When('el usuario presiona Escape', async function () {
  await browser.keys('Escape');
});

Then('el globo de {string} es visible', async function (testId) {
  const tooltip = componentProvider.find(TooltipBasicPage, testId);
  await tooltip.bubble.waitForDisplayed({ timeout: 3000 });
});

Then('el globo de {string} está oculto', async function (testId) {
  const tooltip = componentProvider.find(TooltipBasicPage, testId);
  await tooltip.bubble.waitForDisplayed({ timeout: 3000, reverse: true });
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
