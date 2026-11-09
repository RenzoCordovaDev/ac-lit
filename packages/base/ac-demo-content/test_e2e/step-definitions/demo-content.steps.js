import { Given, When, Then } from '@cucumber/cucumber';
import { runAccessibilityCheck, pageProvider, componentProvider } from '@ac-base/ac-e2e-testing';
import { DemoPage } from '../pages/demo.page.js';
import { DemoContentPage } from '../pages/demo-content.page.js';

Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
  this.demoContent = componentProvider.find(DemoContentPage);
});

When('el usuario selecciona el caso {string}', async function (index) {
  const select = this.demoContent.caseSelect;
  await select.waitForDisplayed();
  await select.selectByAttribute('value', index);
});

When('el usuario hace click en el elemento {string}', async function (testId) {
  const el = await $(`[data-testid="${testId}"]`);
  await el.waitForDisplayed();
  await el.click();
});

When('el usuario selecciona el dispositivo {string}', async function (key) {
  const button = this.demoContent.deviceButton(key);
  await button.waitForDisplayed();
  await button.click();
});

When('el usuario selecciona el tema {string}', async function (theme) {
  const button = this.demoContent.themeButton(theme);
  await button.waitForDisplayed();
  await button.click();
});

When('el usuario selecciona el idioma {string}', async function (index) {
  const button = this.demoContent.languageButton(index);
  await button.waitForDisplayed();
  await button.click();
});

When('el usuario selecciona la vista {string}', async function (mode) {
  const button = this.demoContent.viewModeButton(mode);
  await button.waitForDisplayed();
  await button.click();
});

When('el usuario abre el panel de eventos', async function () {
  const button = this.demoContent.eventsButton;
  await button.waitForDisplayed();
  await button.click();
});

When('el usuario abre la lista de casos', async function () {
  const select = this.demoContent.caseSelect;
  await select.waitForDisplayed();
  await select.click();
});

When('el usuario hace click en el método de instalación {string}', async function (manager) {
  const button = this.demoContent.installCommand(manager);
  await button.waitForDisplayed();
  await button.click();
});

Then('el selector de casos está en una fila separada de los demás controles', async function () {
  const rows = await browser.execute(() => {
    const root = document.querySelector('[data-testid="demo-content"]').shadowRoot;
    const casesRow = root.querySelector('.ac-demo-content__toolbar-cases').getBoundingClientRect();
    const controlsRow = root
      .querySelector('.ac-demo-content__toolbar-controls')
      .getBoundingClientRect();
    return { casesBottom: casesRow.bottom, controlsTop: controlsRow.top };
  });
  if (rows.casesBottom > rows.controlsTop) {
    throw new Error(
      `El selector de casos (bottom=${rows.casesBottom}) se superpone con los demás controles (top=${rows.controlsTop}).`,
    );
  }
});

Then('la primera línea de la vista de código tiene el número {string}', async function (number) {
  const gutter = this.demoContent.firstCodeGutter;
  await gutter.waitForDisplayed();
  const text = (await gutter.getText()).trim();
  if (text !== number) {
    throw new Error(`Se esperaba el número de línea "${number}", pero se encontró "${text}".`);
  }
});

Then('el método de instalación {string} queda marcado como copiado', async function (manager) {
  const button = this.demoContent.installCommand(manager);
  await browser.waitUntil(
    async () =>
      (await button.getAttribute('class')).includes('ac-demo-content__install-cmd--copied'),
    { timeout: 3000, timeoutMsg: `El método "${manager}" no quedó marcado como copiado` },
  );
});

Then('el portapapeles contiene {string}', async function (expectedText) {
  await browser.setPermissions({ name: 'clipboard-read' }, 'granted');
  const text = await browser.execute(() => navigator.clipboard.readText());
  if (text !== expectedText) {
    throw new Error(`Se esperaba "${expectedText}" en el portapapeles, pero había "${text}".`);
  }
});

Then('el elemento {string} es visible', async function (testId) {
  const el = await $(`[data-testid="${testId}"]`);
  await el.waitForDisplayed({ timeout: 3000 });
});

Then('el marco de dispositivo es {string}', async function (device) {
  const frame = this.demoContent.deviceFrame;
  await frame.waitForDisplayed();
  const className = await frame.getAttribute('class');
  if (!className.includes(`ac-demo-content__device-frame--${device}`)) {
    throw new Error(
      `Se esperaba el marco de dispositivo "${device}", pero las clases fueron "${className}".`,
    );
  }
});

Then('el idioma activo es {string}', async function (index) {
  const button = this.demoContent.languageButton(index);
  const isActive = (await button.getAttribute('class')).includes(
    'ac-demo-content__segmented-button--active',
  );
  if (!isActive) {
    throw new Error(`Se esperaba el idioma en el índice "${index}" activo, pero no lo está.`);
  }
});

Then('la vista de código contiene {string}', async function (expectedText) {
  const codeBlock = this.demoContent.codeBlock;
  await codeBlock.waitForDisplayed();
  const text = await codeBlock.getText();
  if (!text.includes(expectedText)) {
    throw new Error(`Se esperaba "${expectedText}" en la vista de código, pero no se encontró.`);
  }
});

Then('el documento queda en data-theme {string}', async function (theme) {
  const current = await browser.execute(() => document.documentElement.getAttribute('data-theme'));
  if (current !== theme) {
    throw new Error(`Se esperaba data-theme="${theme}", pero se encontró "${current}".`);
  }
});

Then(
  'el evento {string} aparece en el panel de eventos con su etiqueta',
  async function (eventName) {
    const list = this.demoContent.eventsPanelList;
    await browser.waitUntil(
      async () => {
        const text = await list.getText();
        return text.includes('Evento:') && text.includes(eventName) && text.includes('Hora:');
      },
      {
        timeout: 3000,
        timeoutMsg: `No se encontró "${eventName}" (con su etiqueta "Evento:") en el panel de eventos`,
      },
    );
  },
);

function assertNoViolations(results) {
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
}

Then('el demo no tiene violaciones de accesibilidad WCAG', async function () {
  assertNoViolations(await runAccessibilityCheck());
});

// Con la lista desplegable abierta, axe marca como falso positivo de contraste los
// controles que quedan tapados por ella; se audita solo la fila del selector de casos.
Then('la fila del selector de casos no tiene violaciones de accesibilidad WCAG', async function () {
  assertNoViolations(
    await runAccessibilityCheck({
      context: { include: [['ac-demo-content', '.ac-demo-content__toolbar-cases']] },
    }),
  );
});
