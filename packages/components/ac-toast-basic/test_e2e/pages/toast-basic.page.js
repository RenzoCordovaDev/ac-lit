import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ToastBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Datos del popover interno, leídos en una sola llamada al navegador. */
  async snapshot() {
    return browser.execute(selector => {
      const popover = document.querySelector(selector).shadowRoot.querySelector('[popover]');
      const rect = popover.getBoundingClientRect();
      return {
        shown: popover.matches(':popover-open'),
        top: rect.top,
        bottom: rect.bottom,
        viewportHeight: window.innerHeight,
        text: popover.textContent.trim(),
      };
    }, this.selector);
  }

  get closeButton() {
    return this.root.$('[part="close"]');
  }

  get actionButton() {
    return this.root.$('[part="action"]');
  }
}
