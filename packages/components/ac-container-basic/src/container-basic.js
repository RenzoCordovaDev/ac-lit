import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import { ContainerBasicStyles } from './container-basic.styles.js';

export class ContainerBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-container-basic';
  }

  static get styles() {
    return [componentBaseStyles, ContainerBasicStyles];
  }

  static get properties() {
    return {
      padding: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.ambient = 'surface';
    this.padding = 'md';
  }

  render() {
    return html`
      <div part="root" class="ac-container-basic">
        <slot></slot>
      </div>
    `;
  }
}
