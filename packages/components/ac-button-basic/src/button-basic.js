import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in button-basic.styles.scss, compiled to button-basic.styles.js by
// `pnpm run build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm build` or `pnpm dev` to generate it.
import { ButtonBasicStyles } from './button-basic.styles.js';

export class ButtonBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-button-basic';
  }

  static get styles() {
    return [ButtonBasicStyles];
  }

  static get properties() {
    return {
      text: { type: String },
      disabled: { type: Boolean, reflect: true },
      fullWidth: { type: Boolean, reflect: true, attribute: 'full-width' },
      loading: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.text = '';
    this.ambient = 'primary';
    this.disabled = false;
    this.fullWidth = false;
    this.loading = false;
  }

  render() {
    const classes =
      `ac-button-basic ac-button--${this.ambient} ` + (this.fullWidth ? 'ac-button--full' : '');

    return html`
      <button
        part="button"
        class=${classes}
        ?disabled=${this.disabled || this.loading}
        aria-disabled=${this.disabled || this.loading}
        aria-busy=${this.loading}
        aria-label=${this.loading ? this.t('button-basic-loading') : nothing}
        @click=${this._onClick}
      >
        ${
          this.loading
            ? html`<span class="skeleton" aria-hidden="true"></span>`
            : this.text
              ? this.t(this.text)
              : html`<slot></slot>`
        }
      </button>
    `;
  }

  _onClick(e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('ac-button-basic-click', {
        detail: true,
        bubbles: true,
        composed: true,
      }),
    );
  }
}
