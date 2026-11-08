import { LitElement, html } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in badge-basic.styles.scss, compiled to badge-basic.styles.js by
// `pnpm run build:styles` (scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm build` or `pnpm dev` to generate it.
import { BadgeBasicStyles } from './badge-basic.styles.js';

export class BadgeBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-badge-basic';
  }

  static get styles() {
    return [BadgeBasicStyles];
  }

  static get properties() {
    return {
      text: { type: String },
    };
  }

  constructor() {
    super();
    this.text = '';
    this.ambient = 'neutral';
  }

  render() {
    const classes = `ac-badge-basic ac-badge--${this.ambient}`;

    return html`
      <span part="badge" class=${classes}>
        ${this.text ? this.t(this.text) : html`<slot></slot>`}
      </span>
    `;
  }
}
