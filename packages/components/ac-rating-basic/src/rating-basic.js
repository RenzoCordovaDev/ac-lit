import { LitElement, html, nothing } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
import { RatingBasicStyles } from './rating-basic.styles.js';

const DEFAULT_MAX = 5;

function toInteger(value, fallback) {
  return Number.isFinite(value) ? Math.trunc(value) : fallback;
}

export class RatingBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-rating-basic';
  }

  static get styles() {
    return [componentBaseStyles, RatingBasicStyles];
  }

  static get properties() {
    return {
      value: { type: Number, reflect: true },
      max: { type: Number, reflect: true },
      readonly: { type: Boolean, reflect: true },
      name: { type: String },
      _previewValue: { state: true },
    };
  }

  constructor() {
    super();
    this.value = 0;
    this.max = DEFAULT_MAX;
    this.readonly = false;
    this.name = '';
    this.ambient = 'primary';
    this._previewValue = null;
  }

  willUpdate(changed) {
    if (changed.has('max')) {
      this.max = Math.max(1, toInteger(this.max, DEFAULT_MAX));
    }
    if (changed.has('value') || changed.has('max')) {
      this.value = Math.min(this.max, Math.max(0, toInteger(this.value, 0)));
    }
    if (changed.has('max') || changed.has('readonly')) {
      this._clearPreview();
    }
  }

  render() {
    const label = this.readonly
      ? this.t('rating-basic-readonly-label', { value: this.value, max: this.max })
      : this.t('rating-basic-group-label');
    const displayValue = this.readonly ? this.value : (this._previewValue ?? this.value);

    return html`
      <div
        part="root"
        class="ac-rating-basic"
        role=${this.readonly ? 'img' : 'radiogroup'}
        aria-label=${label}
        @keydown=${this.readonly ? nothing : this._onKeydown}
        @mouseleave=${this.readonly ? nothing : this._clearPreview}
      >
        ${Array.from({ length: this.max }, (_, index) => {
          const value = index + 1;
          const icon = this._renderStar(value <= displayValue);
          return this.readonly
            ? html`<span part="star" class="ac-rating-basic__star">${icon}</span>`
            : this._renderButton(value, icon);
        })}
      </div>
    `;
  }

  _renderStar(filled) {
    return html`<svg
      class="ac-rating-basic__icon ${filled ? 'ac-rating-basic__star--filled' : ''}"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9Z" />
    </svg>`;
  }

  _renderButton(value, icon) {
    const labelKey = value === 1 ? 'rating-basic-star-label' : 'rating-basic-stars-label';

    return html`
      <button
        part="star"
        class="ac-rating-basic__star"
        type="button"
        role="radio"
        aria-label=${this.t(labelKey, { value })}
        aria-checked=${value === this.value}
        tabindex=${value === Math.max(1, this.value) ? 0 : -1}
        @click=${event => this._select(value, event.currentTarget)}
        @mouseenter=${() => {
          this._previewValue = value;
        }}
      >
        ${icon}
      </button>
    `;
  }

  _clearPreview() {
    this._previewValue = null;
  }

  _select(value, button) {
    if (this.readonly) return;

    this._clearPreview();
    button?.focus();
    if (value === this.value) return;

    this.value = value;
    this.dispatchEvent(
      new CustomEvent('ac-rating-basic-change', {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _onKeydown(event) {
    const targets = {
      ArrowRight: this.value + 1,
      ArrowUp: this.value + 1,
      ArrowLeft: this.value - 1,
      ArrowDown: this.value - 1,
      Home: 0,
      End: this.max,
    };
    if (!Object.hasOwn(targets, event.key)) return;

    event.preventDefault();
    const value = Math.min(this.max, Math.max(0, targets[event.key]));
    const button = event.currentTarget.children[Math.max(1, value) - 1];
    this._select(value, button);
  }
}
