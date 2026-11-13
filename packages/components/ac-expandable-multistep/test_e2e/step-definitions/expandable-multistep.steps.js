import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { ExpandableMultistepPage } from '../pages/expandable-multistep.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

When('el usuario activa el modo oscuro', async function () {
  const toggle = $('ac-demo-content').$('.ac-demo-content__theme-switcher [data-value="dark"]');
  await toggle.waitForDisplayed();
  await toggle.click();
});

When('el usuario completa el paso {string}', async function (number) {
  const page = new ExpandableMultistepPage();
  const button = page.continueButton(number);
  await button.waitForDisplayed();
  await button.click();
});

Given('el usuario completó los pasos {string}, {string} y {string}', async function (a, b, c) {
  const page = new ExpandableMultistepPage();
  for (const number of [a, b, c]) {
    const button = page.continueButton(number);
    await button.waitForDisplayed();
    await button.click();
  }
});

When('el usuario edita el paso {string}', async function (number) {
  const page = new ExpandableMultistepPage();
  const edit = page.editLink(number);
  await edit.waitForDisplayed();
  await edit.click();
});

Then('el paso {string} está activo', async function (number) {
  const page = new ExpandableMultistepPage();
  await browser.waitUntil(async () => (await page.property(number, 'active')) === true, {
    timeout: 3000,
    timeoutMsg: `El paso "${number}" no quedó activo`,
  });
});

Then('el paso {string} vuelve a estar pendiente', async function (number) {
  const page = new ExpandableMultistepPage();
  await browser.waitUntil(
    async () => {
      const [active, completed] = await Promise.all([
        page.property(number, 'active'),
        page.property(number, 'completed'),
      ]);
      return active === false && completed === false;
    },
    {
      timeout: 3000,
      timeoutMsg: `El paso "${number}" no volvió a estar pendiente`,
    },
  );
});

Then('el usuario ve la confirmación final', async function () {
  const page = new ExpandableMultistepPage();
  await page.confirmation.waitForDisplayed({ timeout: 3000 });
});

Then('la confirmación final ya no es visible', async function () {
  const page = new ExpandableMultistepPage();
  await browser.waitUntil(async () => !(await page.confirmation.isDisplayed().catch(() => false)), {
    timeout: 3000,
    timeoutMsg: 'Se esperaba que la confirmación final ya no fuera visible',
  });
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
