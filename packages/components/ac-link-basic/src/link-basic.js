import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in link-basic.styles.scss, compiled to link-basic.styles.js by
// `pnpm run build:styles` (scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm build` or `pnpm dev` to generate it.
import { LinkBasicStyles } from './link-basic.styles.js';

const SAFE_TARGETS = ['_self', '_blank', '_parent', '_top'];

export class LinkBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-link-basic';
  }

  static get styles() {
    return [LinkBasicStyles];
  }

  static get properties() {
    return {
      text: { type: String },
      href: { type: String },
      target: { type: String },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.text = '';
    this.href = '';
    this.target = '_self';
    this.ambient = 'primary';
    this.disabled = false;
  }

  get _safeTarget() {
    return SAFE_TARGETS.includes(this.target) ? this.target : '_self';
  }

  get _rel() {
    // Previene tabnabbing: un link que abre en una pestaña nueva nunca debe
    // quedarse con acceso a `window.opener` del origen que lo abrió.
    return this._safeTarget === '_blank' ? 'noopener noreferrer' : nothing;
  }

  render() {
    const classes = `ac-link-basic ac-link--${this.ambient}`;

    return html`
      <a
        part="link"
        class=${classes}
        href=${this.disabled ? nothing : this.href}
        target=${this._safeTarget}
        rel=${this._rel}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? '-1' : nothing}
        @click=${this._onClick}
      >
        ${this.text ? this.t(this.text) : html`<slot></slot>`}
      </a>
    `;
  }

  _onClick(e) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('ac-link-basic-click', {
        detail: true,
        bubbles: true,
        composed: true,
      }),
    );
  }
}
