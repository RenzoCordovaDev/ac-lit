import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ModalBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Datos del <dialog> interno, leídos en una sola llamada al navegador. */
  async snapshot() {
    return browser.execute(selector => {
      const el = document.querySelector(selector);
      const dialog = el.shadowRoot.querySelector('dialog');
      const rect = dialog.getBoundingClientRect();
      // Si el modal está "contenido" (dentro de un ac-demo-content), se mide
      // contra el marco de dispositivo simulado en vez del viewport real — ver
      // "Superposiciones" en CONVENTIONS.md. Se leen las variables CSS que
      // calcula `_syncContainedRect()` (ya recortadas al viewport real) en vez
      // de medir `getBoundary()` de nuevo: deben coincidir con lo que el
      // propio componente usó para dibujarse.
      const px = value => parseFloat(value) || 0;
      const style = el.contained ? getComputedStyle(el) : null;
      return {
        open: dialog.open,
        top: rect.top,
        height: rect.height,
        width: rect.width,
        viewportTop: style ? px(style.getPropertyValue('--ac-modal-basic-contained-top')) : 0,
        viewportHeight: style
          ? px(style.getPropertyValue('--ac-modal-basic-contained-height'))
          : window.innerHeight,
        viewportWidth: style
          ? px(style.getPropertyValue('--ac-modal-basic-contained-width'))
          : window.innerWidth,
        title: dialog.querySelector('h2').textContent.trim(),
      };
    }, this.selector);
  }

  get closeButton() {
    return this.root.$('[part="close"]');
  }

  get primaryButton() {
    return this.root.$('ac-button-basic[part="primary"]');
  }

  get secondaryButton() {
    return this.root.$('ac-button-basic[part="secondary"]');
  }

  /** `ac-link-basic` también tiene un `part="link"` interno: se acota por la etiqueta. */
  get link() {
    return this.root.$('ac-link-basic[part="link"]');
  }

  async property(name) {
    return browser.execute(
      (selector, prop) => document.querySelector(selector)[prop],
      this.selector,
      name,
    );
  }
}
