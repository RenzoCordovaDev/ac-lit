import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import { CarouselSlideBasicStyles } from './carousel-slide-basic.styles.js';

export class CarouselSlideBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-carousel-slide-basic';
  }

  static get styles() {
    return [componentBaseStyles, CarouselSlideBasicStyles];
  }

  static get properties() {
    return {
      active: { type: Boolean, reflect: true },
      index: { type: Number, attribute: false },
      total: { type: Number, attribute: false },
    };
  }

  constructor() {
    super();
    this.active = false;
    this.index = 0;
    this.total = 1;
    this.ambient = 'primary';
  }

  render() {
    return html`
      <div
        part="root"
        class="carousel-slide-basic"
        role="group"
        aria-label=${this.t('carousel-slide-basic-position', {
          current: this.index + 1,
          total: this.total,
        })}
      >
        <slot></slot>
      </div>
    `;
  }
}
