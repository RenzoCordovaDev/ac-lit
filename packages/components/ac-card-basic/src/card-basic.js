import { LitElement, html, nothing } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import { CardBasicStyles } from './card-basic.styles.js';

const AMBIENTS = new Set(['surface', 'outlined']);
const DEFAULT_AMBIENT = 'surface';

export class CardBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-card-basic';
  }

  // componentBaseStyles primero: fija `font-family` y el skeleton de `loading`
  // (tokens "Emerald Pro", ver docs/CONVENTIONS.md) — no lo quites.
  static get styles() {
    return [componentBaseStyles, CardBasicStyles];
  }

  static get properties() {
    return {
      headerText: { type: String, attribute: 'header-text' },
      ambient: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.headerText = '';
    this.ambient = DEFAULT_AMBIENT;
    this._hasFooter = false;
  }

  get _ambient() {
    return AMBIENTS.has(this.ambient) ? this.ambient : DEFAULT_AMBIENT;
  }

  render() {
    const classes = `ac-card-basic ac-card--${this._ambient}`;

    return html`
      <div part="root" class=${classes}>
        ${
          this.headerText
            ? html`<div part="header" class="ac-card-basic__header">
                <h3 class="ac-card-basic__title">${this.t(this.headerText)}</h3>
              </div>`
            : nothing
        }
        <div part="body" class="ac-card-basic__body"><slot></slot></div>
        <div
          part="footer"
          class="ac-card-basic__footer ${this._hasFooter ? '' : 'ac-card-basic__footer--empty'}"
        >
          <slot name="footer" @slotchange=${this._onFooterSlotChange}></slot>
        </div>
      </div>
    `;
  }

  _onFooterSlotChange(event) {
    this._hasFooter = event.target.assignedElements({ flatten: true }).length > 0;
    this.requestUpdate();
  }
}
