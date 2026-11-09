import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class SliderBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Control nativo dentro del shadow root del componente. */
  get field() {
    return this.root.$('input');
  }

  get valueOutput() {
    return this.root.$('output');
  }

  async property(name) {
    return browser.execute(
      (selector, prop) => document.querySelector(selector)[prop],
      this.selector,
      name,
    );
  }
}
