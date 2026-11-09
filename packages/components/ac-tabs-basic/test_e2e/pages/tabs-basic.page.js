import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class TabsBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  tab(id) {
    return this.root.$(`[role="tab"][data-id="${id}"]`);
  }

  async property(name) {
    return browser.execute(
      (selector, prop) => document.querySelector(selector)[prop],
      this.selector,
      name,
    );
  }

  /** Id de la pestaña activa efectiva (`selected` puede estar vacío: manda la primera habilitada). */
  async activeTabId() {
    return browser.execute(
      selector =>
        document
          .querySelector(selector)
          .shadowRoot.querySelector('[role="tab"][aria-selected="true"]')?.dataset.id ?? '',
      this.selector,
    );
  }

  /** Id de la pestaña que tiene el foco dentro del shadow root ('' si ninguna). */
  async focusedTabId() {
    return browser.execute(
      selector => document.querySelector(selector).shadowRoot.activeElement?.dataset?.id ?? '',
      this.selector,
    );
  }
}
