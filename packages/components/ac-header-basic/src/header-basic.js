import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import { HeaderBasicStyles } from './header-basic.styles.js';

export class HeaderBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-header-basic';
  }

  static get styles() {
    return [componentBaseStyles, HeaderBasicStyles];
  }

  static get properties() {
    return {
      sticky: { type: Boolean, reflect: true },
      divider: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.ambient = 'surface';
    this.sticky = false;
    this.divider = true;
  }

  render() {
    return html`
      <header class="ac-header-basic" part="header">
        <div class="ac-header-basic__start"><slot name="start"></slot></div>
        <div class="ac-header-basic__center"><slot></slot></div>
        <div class="ac-header-basic__end"><slot name="end"></slot></div>
      </header>
    `;
  }
}
