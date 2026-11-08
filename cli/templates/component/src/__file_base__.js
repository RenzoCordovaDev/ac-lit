import { LitElement, html } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in __file_base__.styles.scss, compiled to __file_base__.styles.js by
// `pnpm run build:styles` (scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm build` or `pnpm dev` to generate it.
import { __styles_export__ } from './__file_base__.styles.js';

export class __class_name__ extends ComponentMixin(LitElement) {
  static get is() {
    return '__tag__';
  }

  static get styles() {
    return [__styles_export__];
  }

  static get properties() {
    return {
      text: { type: String },
      variant: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.text = '';
    this.variant = 'default';
  }

  render() {
    const classes = `__file_base__ __file_base__--${this.variant}`;

    return html`
      <span part="root" class=${classes}>
        ${this.text ? this.t(this.text) : html`<slot></slot>`}
      </span>
    `;
  }
}
