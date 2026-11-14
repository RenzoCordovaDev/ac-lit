import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class TextareaBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Campo nativo dentro del shadow root del componente. */
  get field() {
    return this.root.$('textarea');
  }

  get message() {
    return this.root.$('#message');
  }

  get label() {
    return this.root.$('label');
  }

  /** `isFocused()` de WDIO mira el document, no el shadow root del componente. */
  async fieldHasFocus() {
    return browser.execute(
      selector => document.querySelector(selector).shadowRoot.activeElement?.tagName === 'TEXTAREA',
      this.selector,
    );
  }
}
