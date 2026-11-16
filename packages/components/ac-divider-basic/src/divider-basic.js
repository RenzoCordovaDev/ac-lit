import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
// Authored in divider-basic.styles.scss, compiled to divider-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { DividerBasicStyles } from './divider-basic.styles.js';

const ORIENTATIONS = new Set(['horizontal', 'vertical']);
const DEFAULT_ORIENTATION = 'horizontal';

export class DividerBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-divider-basic';
  }

  // componentBaseStyles primero: fija `font-family` y el skeleton de `loading`
  // (tokens "Emerald Pro", ver docs/CONVENTIONS.md) — no lo quites.
  static get styles() {
    return [componentBaseStyles, DividerBasicStyles];
  }

  static get properties() {
    return {
      orientation: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.orientation = DEFAULT_ORIENTATION;
    // No es una propiedad reactiva de Lit (mismo patrón que `_hasFooter` de
    // ac-card-basic): se actualiza a mano en el slotchange y dispara el
    // re-render con `requestUpdate()`.
    this._hasLabel = false;
  }

  get _orientation() {
    return ORIENTATIONS.has(this.orientation) ? this.orientation : DEFAULT_ORIENTATION;
  }

  render() {
    const classes = `ac-divider-basic ac-divider-basic--${this._orientation} ${
      this._hasLabel ? 'ac-divider-basic--with-label' : ''
    }`;

    return html`
      <div part="root" class=${classes} role="separator" aria-orientation=${this._orientation}>
        <span part="line" class="ac-divider-basic__line"></span>
        <span part="label" class="ac-divider-basic__label">
          <slot @slotchange=${this._onSlotChange}></slot>
        </span>
        <span part="line" class="ac-divider-basic__line"></span>
      </div>
    `;
  }

  _onSlotChange(event) {
    this._hasLabel = event.target.assignedNodes({ flatten: true }).length > 0;
    this.requestUpdate();
  }
}
