import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in slider-basic.styles.scss, compiled to slider-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { SliderBasicStyles } from './slider-basic.styles.js';

const toNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export class SliderBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-slider-basic';
  }

  static get styles() {
    return [SliderBasicStyles];
  }

  static get properties() {
    return {
      label: { type: String },
      a11yLabel: { type: String, attribute: 'a11y-label' },
      value: { type: Number },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      name: { type: String },
      hint: { type: String },
      suffix: { type: String },
      showValue: { type: Boolean, attribute: 'show-value' },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.label = '';
    this.a11yLabel = '';
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.name = '';
    this.hint = '';
    this.suffix = '';
    this.showValue = false;
    this.disabled = false;
    this.ambient = 'primary';
  }

  get _min() {
    return toNumber(this.min, 0);
  }

  get _max() {
    const max = toNumber(this.max, 100);
    return max > this._min ? max : this._min + 1;
  }

  get _value() {
    return Math.min(this._max, Math.max(this._min, toNumber(this.value, this._min)));
  }

  /** Porcentaje recorrido: pinta el tramo relleno de la pista. */
  get _percent() {
    return ((this._value - this._min) / (this._max - this._min)) * 100;
  }

  /** Lleva el foco al control interno. */
  focus(options) {
    this.renderRoot.querySelector('input')?.focus(options);
  }

  render() {
    const hasHeader = this.label || this.showValue;

    return html`
      <div part="root" class="ac-slider-basic ac-slider--${this.ambient}">
        ${
          hasHeader
            ? html`<div class="ac-slider-basic__header">
                ${
                  this.label
                    ? html`<label part="label" class="ac-slider-basic__label" for="field"
                        >${this.t(this.label)}</label
                      >`
                    : html`<span></span>`
                }
                ${
                  this.showValue
                    ? html`<output
                        part="value"
                        class="ac-slider-basic__value"
                        for="field"
                        aria-hidden="true"
                        >${this._value}${this.suffix}</output
                      >`
                    : nothing
                }
              </div>`
            : nothing
        }
        <input
          part="input"
          id="field"
          class="ac-slider-basic__field"
          type="range"
          name=${this.name}
          min=${this._min}
          max=${this._max}
          step=${this.step}
          style="--ac-slider-percent: ${this._percent}%"
          aria-label=${!this.label && this.a11yLabel ? this.t(this.a11yLabel) : nothing}
          aria-describedby=${this.hint ? 'hint' : nothing}
          aria-valuetext=${this.suffix ? `${this._value}${this.suffix}` : nothing}
          ?disabled=${this.disabled}
          .value=${String(this._value)}
          @input=${this._onInput}
          @change=${this._onChange}
        />
        ${
          this.hint
            ? html`<p part="hint" id="hint" class="ac-slider-basic__hint">${this.t(this.hint)}</p>`
            : nothing
        }
      </div>
    `;
  }

  _onInput(event) {
    this.value = Number(event.target.value);
    this._emit('ac-slider-basic-input');
  }

  _onChange(event) {
    this.value = Number(event.target.value);
    this._emit('ac-slider-basic-change');
  }

  _emit(name) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
