import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class CardBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Datos leídos en una sola llamada al navegador. */
  async snapshot() {
    return browser.execute(selector => {
      const host = document.querySelector(selector);
      const header = host.shadowRoot.querySelector('[part="header"]');
      const footer = host.shadowRoot.querySelector('[part="footer"]');
      return {
        hasHeader: Boolean(header),
        footerVisible: getComputedStyle(footer).display !== 'none',
      };
    }, this.selector);
  }
}
