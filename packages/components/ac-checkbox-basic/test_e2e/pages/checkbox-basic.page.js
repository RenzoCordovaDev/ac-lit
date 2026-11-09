import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class CheckboxBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Estado real de la propiedad del host (no solo del atributo reflejado). */
  async property(name) {
    return browser.execute(
      (selector, prop) => document.querySelector(selector)[prop],
      this.selector,
      name,
    );
  }
}
