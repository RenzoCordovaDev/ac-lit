import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class SpinnerBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Datos leídos en una sola llamada al navegador. */
  async snapshot() {
    return browser.execute(selector => {
      const host = document.querySelector(selector);
      const root = host.shadowRoot.querySelector('[part="root"]');
      const label = host.shadowRoot.querySelector('[part="label"]');
      return {
        role: root.getAttribute('role'),
        labelText: label.textContent.trim(),
      };
    }, this.selector);
  }
}
