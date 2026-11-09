import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ExpandableBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  get header() {
    return this.root.$('[part="header"]');
  }

  /**
   * Click cerca del borde derecho de la cabecera (sobre el chevron). El centro puede caer
   * sobre un hijo slotted (ej. `<strong slot>`), y WebDriver lo reporta como "click
   * intercepted" porque ese nodo no es descendiente del botón en el árbol del DOM; dónde
   * cae el centro depende de las métricas de la fuente, así que pasaba local y fallaba en CI.
   */
  async clickHeader() {
    const { width } = await this.header.getSize();
    await this.header.click({ x: Math.round(width / 2) - 24, y: 0 });
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
