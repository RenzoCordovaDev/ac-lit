import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ModalBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Datos del <dialog> interno, leídos en una sola llamada al navegador. */
  async snapshot() {
    return browser.execute(selector => {
      const dialog = document.querySelector(selector).shadowRoot.querySelector('dialog');
      const rect = dialog.getBoundingClientRect();
      return {
        open: dialog.open,
        top: rect.top,
        height: rect.height,
        width: rect.width,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        title: dialog.querySelector('h2').textContent.trim(),
      };
    }, this.selector);
  }

  get closeButton() {
    return this.root.$('[part="close"]');
  }

  get primaryButton() {
    return this.root.$('ac-button-basic[part="primary"]');
  }

  get secondaryButton() {
    return this.root.$('ac-button-basic[part="secondary"]');
  }

  /** `ac-link-basic` también tiene un `part="link"` interno: se acota por la etiqueta. */
  get link() {
    return this.root.$('ac-link-basic[part="link"]');
  }

  async property(name) {
    return browser.execute(
      (selector, prop) => document.querySelector(selector)[prop],
      this.selector,
      name,
    );
  }
}
