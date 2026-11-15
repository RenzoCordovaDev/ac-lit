import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class AvatarBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Datos leídos en una sola llamada al navegador. */
  async snapshot() {
    return browser.execute(selector => {
      const host = document.querySelector(selector);
      const image = host.shadowRoot.querySelector('.ac-avatar-basic__image');
      const fallback = host.shadowRoot.querySelector('.ac-avatar-basic__fallback');
      return {
        hasImage: Boolean(image),
        imageAlt: image ? image.getAttribute('alt') : null,
        fallbackRole: fallback ? fallback.getAttribute('role') : null,
        fallbackAriaLabel: fallback ? fallback.getAttribute('aria-label') : null,
        initialsText: fallback ? fallback.textContent.trim() : null,
      };
    }, this.selector);
  }
}
