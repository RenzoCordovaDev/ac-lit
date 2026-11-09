import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ExpandableBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  get header() {
    return this.root.$('[part="header"]');
  }

  /** Contenedor del contenido: se oculta con visibility cuando el panel está cerrado. */
  get content() {
    return this.root.$('[part="content"]');
  }

  async property(name) {
    return browser.execute(
      (selector, prop) => document.querySelector(selector)[prop],
      this.selector,
      name,
    );
  }
}
