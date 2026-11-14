import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
// Authored in spinner-basic.styles.scss, compiled to spinner-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { SpinnerBasicStyles } from './spinner-basic.styles.js';

const SIZES = new Set(['sm', 'md', 'lg']);
const DEFAULT_SIZE = 'md';

export class SpinnerBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-spinner-basic';
  }

  // componentBaseStyles primero: fija `font-family` y el skeleton de `loading`
  // (tokens "Emerald Pro", ver docs/CONVENTIONS.md) — no lo quites.
  static get styles() {
    return [componentBaseStyles, SpinnerBasicStyles];
  }

  static get properties() {
    return {
      size: { type: String, reflect: true },
      a11yLabel: { type: String, attribute: 'a11y-label' },
    };
  }

  constructor() {
    super();
    this.size = DEFAULT_SIZE;
    this.a11yLabel = 'spinner-basic-loading';
    this.ambient = 'primary';
  }

  get _size() {
    return SIZES.has(this.size) ? this.size : DEFAULT_SIZE;
  }

  render() {
    const classes = `ac-spinner-basic ac-spinner--${this.ambient} ac-spinner--${this._size}`;

    return html`
      <span part="root" class=${classes} role="status">
        <span part="label" class="ac-spinner-basic__label">${this.t(this.a11yLabel)}</span>
      </span>
    `;
  }
}
