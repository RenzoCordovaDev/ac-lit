import { LitElement, html, nothing } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
// Authored in tooltip-basic.styles.scss, compiled to tooltip-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` o `pnpm component:serve` to generate it.
import { TooltipBasicStyles } from './tooltip-basic.styles.js';

const POSITIONS = new Set(['top', 'bottom', 'left', 'right']);
const DEFAULT_POSITION = 'top';

// Contador a nivel de módulo para generar un id único por instancia del globo
// (mismo criterio sugerido en la spec: "contador de módulo o Math.random()").
// Se usa para el `id` del globo y el `aria-describedby` del trigger.
let tooltipIdCounter = 0;

export class TooltipBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-tooltip-basic';
  }

  // componentBaseStyles primero: fija `font-family` y el skeleton de `loading`
  // (tokens "Emerald Pro", ver docs/CONVENTIONS.md) — no lo quites.
  static get styles() {
    return [componentBaseStyles, TooltipBasicStyles];
  }

  static get properties() {
    return {
      text: { type: String },
      position: { type: String, reflect: true },
      disabled: { type: Boolean, reflect: true },
      _visible: { state: true },
    };
  }

  constructor() {
    super();
    this.text = '';
    this.position = DEFAULT_POSITION;
    this.disabled = false;
    this._visible = false;
    this._tooltipId = `ac-tooltip-basic-${(tooltipIdCounter += 1)}`;
    this._assignedElements = [];

    // Bound una sola vez para poder usarlos tanto con addEventListener como
    // con removeEventListener (ver _onSlotChange).
    this._onShow = this._onShow.bind(this);
    this._onHide = this._onHide.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  /** Whitelist con fallback — mismo patrón que `_ambient` en ac-card-basic.
   * El `position` del host refleja el valor crudo (API pública); este getter
   * es el que se usa para decidir el posicionamiento real del globo, así un
   * valor inválido en el atributo nunca deja el globo sin estilo de posición. */
  get _position() {
    return POSITIONS.has(this.position) ? this.position : DEFAULT_POSITION;
  }

  connectedCallback() {
    super.connectedCallback();
    // Un solo listener a nivel de documento, filtrado por `this._visible`
    // adentro del handler — más simple que registrar/desregistrar en cada
    // show/hide, y el filtro evita que Escape haga algo si el globo ya
    // está oculto.
    document.addEventListener('keydown', this._onKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onKeyDown);
    super.disconnectedCallback();
  }

  render() {
    const bubbleClasses = `ac-tooltip-basic__bubble${
      this._visible ? ' ac-tooltip-basic__bubble--visible' : ''
    }`;

    return html`
      <slot @slotchange=${this._onSlotChange}></slot>
      <span
        id=${this._tooltipId}
        part="bubble"
        role="tooltip"
        position=${this._position}
        class=${bubbleClasses}
      >
        ${this.text ? this.t(this.text) : nothing}
      </span>
    `;
  }

  _onSlotChange(event) {
    const elements = event.target.assignedElements({ flatten: true });

    // Limpia los elementos previamente asignados (si el slot cambió de
    // contenido) antes de enganchar los nuevos.
    for (const element of this._assignedElements) {
      element.removeEventListener('mouseenter', this._onShow);
      element.removeEventListener('focusin', this._onShow);
      element.removeEventListener('mouseleave', this._onHide);
      element.removeEventListener('focusout', this._onHide);
      if (element.getAttribute('aria-describedby') === this._tooltipId) {
        element.removeAttribute('aria-describedby');
      }
    }

    for (const element of elements) {
      element.addEventListener('mouseenter', this._onShow);
      element.addEventListener('focusin', this._onShow);
      element.addEventListener('mouseleave', this._onHide);
      element.addEventListener('focusout', this._onHide);
      // El globo existe siempre en el DOM (solo oculto por CSS), así que
      // `aria-describedby` puede quedar seteado todo el tiempo — misma
      // convención que `aria-describedby` en ac-input-basic/ac-select-basic
      // para hint/error, que tampoco se condiciona a la visibilidad real.
      element.setAttribute('aria-describedby', this._tooltipId);
    }

    this._assignedElements = elements;
  }

  _onShow() {
    if (this.disabled) return;
    this._visible = true;
  }

  _onHide() {
    this._visible = false;
  }

  _onKeyDown(event) {
    if (!this._visible) return;
    if (event.key === 'Escape') {
      this._onHide();
    }
  }
}
