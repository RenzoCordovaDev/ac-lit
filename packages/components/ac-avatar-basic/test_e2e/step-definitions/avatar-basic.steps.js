import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { AvatarBasicPage } from '../pages/avatar-basic.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
});

Then(
  'el avatar {string} muestra una imagen con alt {string}',
  async function (testId, expectedAlt) {
    const component = componentProvider.find(AvatarBasicPage, testId);
    await component.waitForDisplayed();
    const { hasImage, imageAlt } = await component.snapshot();
    if (!hasImage) throw new Error(`El avatar "${testId}" no muestra una imagen.`);
    if (imageAlt !== expectedAlt) {
      throw new Error(`Se esperaba alt="${expectedAlt}", pero se encontró "${imageAlt}".`);
    }
  },
);

Then('el avatar {string} muestra el fallback de iniciales', async function (testId) {
  const component = componentProvider.find(AvatarBasicPage, testId);
  await component.waitForDisplayed();
  const { hasImage } = await component.snapshot();
  if (hasImage) throw new Error(`El avatar "${testId}" todavía muestra una imagen.`);
});

Then(
  'el avatar {string} muestra las iniciales {string}',
  async function (testId, expectedInitials) {
    const component = componentProvider.find(AvatarBasicPage, testId);
    await component.waitForDisplayed();
    const { initialsText } = await component.snapshot();
    if (initialsText !== expectedInitials) {
      throw new Error(
        `Se esperaban las iniciales "${expectedInitials}", pero se encontró "${initialsText}".`,
      );
    }
  },
);

Then(
  'el avatar {string} tiene role {string} y aria-label {string}',
  async function (testId, expectedRole, expectedLabel) {
    const component = componentProvider.find(AvatarBasicPage, testId);
    await component.waitForDisplayed();
    const { fallbackRole, fallbackAriaLabel } = await component.snapshot();
    if (fallbackRole !== expectedRole) {
      throw new Error(`Se esperaba role="${expectedRole}", pero se encontró "${fallbackRole}".`);
    }
    if (fallbackAriaLabel !== expectedLabel) {
      throw new Error(
        `Se esperaba aria-label="${expectedLabel}", pero se encontró "${fallbackAriaLabel}".`,
      );
    }
  },
);

Then('el avatar {string} tiene aria-label {string}', async function (testId, expectedLabel) {
  const component = componentProvider.find(AvatarBasicPage, testId);
  await component.waitForDisplayed();
  const { fallbackAriaLabel } = await component.snapshot();
  if (fallbackAriaLabel !== expectedLabel) {
    throw new Error(
      `Se esperaba aria-label="${expectedLabel}", pero se encontró "${fallbackAriaLabel}".`,
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
