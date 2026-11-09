import { LitElement, html } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';

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
