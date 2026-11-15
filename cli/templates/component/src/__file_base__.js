import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import { __styles_export__ } from './__file_base__.styles.js';

export class __class_name__ extends ComponentMixin(LitElement) {
  static get is() {
    return '__tag__';
  }

  // componentBaseStyles primero: fija `font-family` y el skeleton de `loading`
  // (tokens "Emerald Pro", ver docs/CONVENTIONS.md) — no lo quites.
  static get styles() {
    return [componentBaseStyles, __styles_export__];
  }

  static get properties() {
    return {
      text: { type: String },
    };
  }

  constructor() {
    super();
    this.text = '';
    this.ambient = 'default';
  }

  render() {
    const classes = `__file_base__ __file_base__--${this.ambient}`;

    return html`
      <span part="root" class=${classes}>
        ${this.text ? this.t(this.text) : html`<slot></slot>`}
      </span>
    `;
  }
}
