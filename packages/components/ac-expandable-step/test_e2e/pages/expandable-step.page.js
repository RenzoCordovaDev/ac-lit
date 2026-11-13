import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ExpandableStepPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  get header() {
    return this.root.$('[part="header"]');
  }

  get counter() {
    return this.root.$('[part="counter"]');
  }

  get edit() {
    return this.root.$('[part="edit"]');
  }

  get content() {
    return this.root.$('[part="content"]');
  }

  get summary() {
    return this.root.$('[slot="summary"]');
  }

  async property(name) {
    return browser.execute(
      (selector, prop) => document.querySelector(selector)[prop],
      this.selector,
      name,
    );
  }
}
