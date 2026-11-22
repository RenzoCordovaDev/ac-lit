import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { RegistroWizardPage } from '../pages/registro-wizard.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
  // El caso de este demo es un documento completo cargado en <iframe> (ver
  // ac-demo-case.js) — hay que pasarle su browsing context, si no busca el
  // wizard en el documento principal, donde ya no vive.
  this.wizard = componentProvider.find(
    RegistroWizardPage,
    undefined,
    await this.demoPage.caseFrame(),
  );
  await this.wizard.waitForDisplayed();
  await this.wizard.setApiTimeout(1);
});

When(
  'el usuario completa el paso 1 con nombre {string} y correo {string}',
  async function (nombre, email) {
    await this.wizard.fillStep1(nombre, email);
  },
);

When('el usuario avanza al paso 2', async function () {
  await this.wizard.clickActionButton(0);
  await browser.waitUntil(async () => (await this.wizard.snapshot()).activeStepIndex === 1, {
    timeout: 3000,
    timeoutMsg: 'El wizard no avanzó al paso 2',
  });
});

When('el usuario acepta los términos y avanza al paso 3', async function () {
  await this.wizard.acceptTerminos();
  await this.wizard.clickActionButton(1);
  await browser.waitUntil(async () => (await this.wizard.snapshot()).activeStepIndex === 2, {
    timeout: 3000,
    timeoutMsg: 'El wizard no avanzó al paso 3',
  });
});

When('el usuario confirma el registro', async function () {
  await this.wizard.clickActionButton(2);
});

Then('el modal de registro exitoso se muestra', async function () {
  await browser.waitUntil(async () => (await this.wizard.snapshot()).modalOpen === true, {
    timeout: 3000,
    timeoutMsg: 'El modal de registro exitoso no se abrió',
  });
});

Then('el usuario registrado es {string}', async function (nombreEsperado) {
  const { registeredUser } = await this.wizard.snapshot();
  if (registeredUser?.nombre !== nombreEsperado) {
    throw new Error(
      `Se esperaba el usuario registrado "${nombreEsperado}", pero se encontró "${registeredUser?.nombre}".`,
    );
  }
});

Then('la página no tiene scroll horizontal', async function () {
  const hasHorizontalScroll = await browser.execute(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  if (hasHorizontalScroll) {
    throw new Error('La página tiene scroll horizontal.');
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
