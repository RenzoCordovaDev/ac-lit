import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class TransitionContainerPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Datos del <dialog> interno, leídos en una sola llamada al navegador. */
  async snapshot() {
    return browser.execute(selector => {
      const el = document.querySelector(selector);
      const dialog = el.shadowRoot.querySelector('dialog');
      return {
        visible: dialog.open,
        title: dialog.querySelector('h2').textContent.trim(),
        hasBackIcon: Boolean(dialog.querySelector('[part="back"]')),
      };
    }, this.selector);
  }

  /** Espera a que el <dialog> esté abierto y sin animaciones en curso. El
   * contenedor entra deslizándose: un click a un ícono del header durante ese
   * movimiento puede caer fuera del botón (WebDriver calcula el punto antes
   * de despachar el click) y el test falla de forma intermitente. */
  async waitForSettled() {
    await browser.waitUntil(
      () =>
        browser.execute(selector => {
          const dialog = document.querySelector(selector).shadowRoot.querySelector('dialog');
          const running = dialog
            .getAnimations({ subtree: true })
            .some(animation => animation.playState === 'running');
          return dialog.open && !running;
        }, this.selector),
      { timeout: 4000, timeoutMsg: `El contenedor "${this.selector}" no terminó de abrirse` },
    );
  }

  get backButton() {
    return this.root.$('[part="back"]');
  }

  get menuButton() {
    return this.root.$('[part="menu"]');
  }

  async property(name) {
    return browser.execute(
      (selector, prop) => document.querySelector(selector)[prop],
      this.selector,
      name,
    );
  }
}
