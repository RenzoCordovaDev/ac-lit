import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class IconBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Datos leídos en una sola llamada al navegador. */
  async snapshot() {
    return browser.execute(selector => {
      const host = document.querySelector(selector);
      const svg = host.shadowRoot.querySelector('svg');
      const path = svg.querySelector('path');
      return {
        hasCircle: Boolean(svg.querySelector('circle')),
        pathD: path ? path.getAttribute('d') : null,
        role: svg.getAttribute('role'),
        ariaHidden: svg.getAttribute('aria-hidden'),
        ariaLabel: svg.getAttribute('aria-label'),
      };
    }, this.selector);
  }
}
