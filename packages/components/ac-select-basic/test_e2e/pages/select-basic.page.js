import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class SelectBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Select nativo dentro del shadow root del componente. */
  get field() {
    return this.root.$('select');
  }

  get message() {
    return this.root.$('#message');
  }

  /** Texto de la opción seleccionada (lo que el usuario ve en el select). */
  async selectedText() {
    return browser.execute(
      selector =>
        document
          .querySelector(selector)
          .shadowRoot.querySelector('select')
          .selectedOptions[0]?.textContent.trim() ?? '',
      this.selector,
    );
  }

  async property(name) {
    return browser.execute(
      (selector, prop) => document.querySelector(selector)[prop],
      this.selector,
      name,
    );
  }
}
