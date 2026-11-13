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
      };
    }, this.selector);
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
