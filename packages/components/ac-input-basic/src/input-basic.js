import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in input-basic.styles.scss, compiled to input-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { InputBasicStyles } from './input-basic.styles.js';

const ALLOWED_TYPES = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'];

export class InputBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-input-basic';
  }

  static get styles() {
    return [InputBasicStyles];
  }

  static get properties() {
    return {
      label: { type: String },
      a11yLabel: { type: String, attribute: 'a11y-label' },
      value: { type: String },
      type: { type: String },
      name: { type: String },
      placeholder: { type: String },
      hint: { type: String },
      error: { type: String },
      disabled: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      required: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.label = '';
    this.a11yLabel = '';
    this.value = '';
    this.type = 'text';
    this.name = '';
    this.placeholder = '';
    this.hint = '';
    this.error = '';
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.ambient = 'primary';
  }

  get _type() {
    return ALLOWED_TYPES.includes(this.type) ? this.type : 'text';
  }

  get _message() {
    return this.error || this.hint;
  }

  /** Lleva el foco al campo interno. */
  focus(options) {
    this.renderRoot.querySelector('input')?.focus(options);
  }

  render() {
    const hasError = Boolean(this.error);
    const classes = `ac-input-basic ac-input--${this.ambient}${hasError ? ' ac-input--invalid' : ''}`;

    return html`
      <div part="root" class=${classes}>
        ${
          this.label
            ? html`<label part="label" class="ac-input-basic__label" for="field">
                ${this.t(this.label)}${
                  this.required
                    ? html`<span class="ac-input-basic__required" aria-hidden="true"> *</span>`
                    : nothing
                }
              </label>`
            : nothing
        }
        <input
          part="input"
          id="field"
          class="ac-input-basic__field"
          type=${this._type}
          name=${this.name}
          .value=${this.value}
          placeholder=${this.placeholder ? this.t(this.placeholder) : nothing}
          aria-label=${!this.label && this.a11yLabel ? this.t(this.a11yLabel) : nothing}
          aria-invalid=${hasError ? 'true' : 'false'}
          aria-describedby=${this._message ? 'message' : nothing}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          @input=${this._onInput}
          @change=${this._onChange}
        />
        ${
          this._message
            ? html`<p
                part=${hasError ? 'error' : 'hint'}
                id="message"
                class="ac-input-basic__message ${hasError ? 'ac-input-basic__message--error' : ''}"
                role=${hasError ? 'alert' : nothing}
              >
                ${this.t(this._message)}
              </p>`
            : nothing
        }
      </div>
    `;
  }

  _onInput(event) {
    this.value = event.target.value;
    this._emit('ac-input-basic-input');
  }

  _onChange(event) {
    this.value = event.target.value;
    this._emit('ac-input-basic-change');
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
