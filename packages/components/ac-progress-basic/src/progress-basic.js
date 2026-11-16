import { LitElement, html, nothing } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
// Authored in progress-basic.styles.scss, compiled to progress-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { ProgressBasicStyles } from './progress-basic.styles.js';

// Mismo patrón que ac-notification-basic/ac-toast-basic: whitelist con Set +
// getter `_ambient` con fallback, nunca se usa `this.ambient` tal cual en el
// render. A diferencia de esos dos (semántico de estado puro), acá se agrega
// `primary` porque también sirve como progreso neutral/de marca.
const AMBIENTS = new Set(['primary', 'success', 'warning', 'danger']);
const DEFAULT_AMBIENT = 'primary';

const toNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export class ProgressBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-progress-basic';
  }

  // componentBaseStyles primero: fija `font-family` y el skeleton de `loading`
  // (tokens "Emerald Pro", ver docs/CONVENTIONS.md) — no lo quites.
  static get styles() {
    return [componentBaseStyles, ProgressBasicStyles];
  }

  static get properties() {
    return {
      value: { type: Number },
      indeterminate: { type: Boolean, reflect: true },
      ambient: { type: String, reflect: true },
      label: { type: String },
      showValue: { type: Boolean, attribute: 'show-value' },
    };
  }

  constructor() {
    super();
    this.value = 0;
    this.indeterminate = false;
    this.ambient = DEFAULT_AMBIENT;
    this.label = '';
    this.showValue = false;
  }

  get _ambient() {
    return AMBIENTS.has(this.ambient) ? this.ambient : DEFAULT_AMBIENT;
  }

  /** Clampea `value` a [0, 100] sin mutar la propiedad pública que pasó el consumidor. */
  get _value() {
    return Math.min(100, Math.max(0, toNumber(this.value, 0)));
  }

  render() {
    const ambient = this._ambient;
    const value = this._value;
    const hasHeader = this.label || (this.showValue && !this.indeterminate);
    const classes = `ac-progress-basic ac-progress--${ambient}${
      this.indeterminate ? ' ac-progress-basic--indeterminate' : ''
    }`;

    return html`
      <div part="root" class="ac-progress-basic-root">
        ${
          hasHeader
            ? html`<div class="ac-progress-basic__header">
                ${
                  this.label
                    ? html`<span part="label" class="ac-progress-basic__label"
                        >${this.t(this.label)}</span
                      >`
                    : html`<span></span>`
                }
                ${
                  this.showValue && !this.indeterminate
                    ? html`<span part="value" class="ac-progress-basic__value" aria-hidden="true">
                        ${value}%
                      </span>`
                    : nothing
                }
              </div>`
            : nothing
        }
        <div
          part="track"
          class=${classes}
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${this.indeterminate ? nothing : value}
          aria-label=${this.t(this.label || 'progress-basic-label')}
        >
          ${
            this.indeterminate
              ? html`<div part="fill" class="ac-progress-basic__fill"></div>`
              : html`<div
                  part="fill"
                  class="ac-progress-basic__fill"
                  style="width: ${value}%"
                ></div>`
          }
        </div>
      </div>
    `;
  }
}
