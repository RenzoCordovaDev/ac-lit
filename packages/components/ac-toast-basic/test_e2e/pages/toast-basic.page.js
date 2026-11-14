import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ToastBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Datos del popover interno, leídos en una sola llamada al navegador. */
  async snapshot() {
    return browser.execute(selector => {
      const el = document.querySelector(selector);
      const popover = el.shadowRoot.querySelector('[popover]');
      const rect = popover.getBoundingClientRect();
      // Si el toast está "contenido" (dentro de un ac-demo-content), se mide
      // contra el marco de dispositivo simulado (ya recortado al viewport
      // real) en vez del viewport real — ver "Superposiciones" en
      // CONVENTIONS.md. Se leen las variables CSS que calcula
      // `_syncContainedPosition()`: deben coincidir con lo que el propio
      // componente usó para posicionarse.
      const px = value => parseFloat(value) || 0;
      const style = el.contained ? getComputedStyle(el) : null;
      return {
        shown: popover.matches(':popover-open'),
        top: rect.top,
        bottom: rect.bottom,
        viewportTop: style
          ? px(style.getPropertyValue('--ac-toast-basic-contained-boundary-top'))
          : 0,
        viewportBottom: style
          ? px(style.getPropertyValue('--ac-toast-basic-contained-boundary-bottom'))
          : window.innerHeight,
        text: popover.textContent.trim(),
      };
    }, this.selector);
  }

  get closeButton() {
    return this.root.$('[part="close"]');
  }

  get actionButton() {
    return this.root.$('[part="action"]');
  }
}
