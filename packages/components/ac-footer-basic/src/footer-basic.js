import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import { FooterBasicStyles } from './footer-basic.styles.js';

export class FooterBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-footer-basic';
  }

  static get styles() {
    return [componentBaseStyles, FooterBasicStyles];
  }

  static get properties() {
    return {
      _hasBottom: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.ambient = 'surface';
    this._hasBottom = false;
  }

  _onBottomSlotChange(event) {
    this._hasBottom = event.target.assignedElements().length > 0;
  }

  render() {
    const bottomClasses = `footer-basic__bottom${this._hasBottom ? ' footer-basic__bottom--divided' : ''}`;

    return html`
      <footer
        part="root"
        class="footer-basic"
        aria-label=${this.t('footer-basic-site-information')}
      >
        <div part="main" class="footer-basic__main">
          <slot></slot>
        </div>
        <div part="bottom" class=${bottomClasses}>
          <slot name="bottom" @slotchange=${this._onBottomSlotChange}></slot>
        </div>
      </footer>
    `;
  }
}
