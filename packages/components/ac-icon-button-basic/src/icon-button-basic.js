import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
import '@ac-components/ac-icon-basic';
// Authored in icon-button-basic.styles.scss, compiled to icon-button-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { IconButtonBasicStyles } from './icon-button-basic.styles.js';

const AMBIENTS = new Set(['primary', 'secondary', 'danger']);
const DEFAULT_AMBIENT = 'primary';

const SIZES = new Set(['sm', 'md', 'lg']);
const DEFAULT_SIZE = 'md';

export class IconButtonBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-icon-button-basic';
  }

  // componentBaseStyles primero: fija `font-family` y el skeleton de
  // `loading` compartidos, convención del catálogo (ver docs/CONVENTIONS.md).
  static get styles() {
    return [componentBaseStyles, IconButtonBasicStyles];
  }

  static get properties() {
    return {
      name: { type: String },
      a11yLabel: { type: String, attribute: 'a11y-label' },
      ambient: { type: String, reflect: true },
      size: { type: String, reflect: true },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.name = '';
    this.a11yLabel = '';
    this.ambient = DEFAULT_AMBIENT;
    this.size = DEFAULT_SIZE;
    this.disabled = false;
  }

  get _ambient() {
    return AMBIENTS.has(this.ambient) ? this.ambient : DEFAULT_AMBIENT;
  }

  get _size() {
    return SIZES.has(this.size) ? this.size : DEFAULT_SIZE;
  }

  render() {
    // Un botón solo-ícono sin texto visible es inútil para un lector de
    // pantalla si `aria-label` queda vacío: si el consumidor no define
    // `a11yLabel`, usamos el propio `name` como fallback — nunca queda
    // completamente roto, aunque lo ideal (documentado en el README) sea
    // siempre pasar `a11y-label` explícito.
    const label = this.a11yLabel || this.name;
    const classes = `ac-icon-button-basic ac-icon-button--${this._ambient} ac-icon-button--${this._size}`;

    return html`
      <button
        part="root"
        class=${classes}
        type="button"
        aria-label=${label}
        ?disabled=${this.disabled}
      >
        <ac-icon-basic part="icon" name=${this.name} size=${this._size}></ac-icon-basic>
      </button>
    `;
  }
}
