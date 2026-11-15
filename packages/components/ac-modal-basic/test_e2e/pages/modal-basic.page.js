import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ModalBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Datos del <dialog>/panel interno, leídos en una sola llamada al navegador. */
  async snapshot() {
    return browser.execute(selector => {
      const el = document.querySelector(selector);
      const dialog = el.shadowRoot.querySelector('dialog');
      // Si el modal está "contenido", el `<dialog>` ocupa SIEMPRE el marco
      // simulado entero (sin tamaño propio) y es `.ac-modal-basic__panel`
      // quien tiene el tamaño por `size` — ver "Superposiciones" en
      // CONVENTIONS.md. Sin contener, panel y dialog miden igual (el panel ya
      // ocupa el 100% del dialog), así que medir el panel sirve para ambos
      // casos. El "viewport" de referencia se lee de las variables CSS que
      // calculó `_syncContainedRect()` (ya recortadas contra la ventana real,
      // que puede ser más baja que el dispositivo simulado) en vez del rect
      // real de `.ac-demo-content__viewport`: son esas variables, no el rect
      // sin recortar, las que el propio componente usó para dibujarse.
      const panel = el.shadowRoot.querySelector('.ac-modal-basic__panel');
      const rect = panel.getBoundingClientRect();
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
