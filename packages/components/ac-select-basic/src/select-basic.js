import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in select-basic.styles.scss, compiled to select-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { SelectBasicStyles } from './select-basic.styles.js';

/** Normaliza una opción: un string es `{ value, label }` con el mismo texto. */
function normalizeOption(option) {
  if (typeof option === 'string') return { value: option, label: option, disabled: false };
  return {
    value: String(option?.value ?? ''),
    label: String(option?.label ?? option?.value ?? ''),
    disabled: Boolean(option?.disabled),
  };
}

export class SelectBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-select-basic';
  }

  static get styles() {
    return [SelectBasicStyles];
  }

  static get properties() {
    return {
      label: { type: String },
      a11yLabel: { type: String, attribute: 'a11y-label' },
      value: { type: String },
      name: { type: String },
      placeholder: { type: String },
      hint: { type: String },
      error: { type: String },
      options: { type: Array },
      disabled: { type: Boolean, reflect: true },
      required: { type: Boolean, reflect: true },
      _slottedOptions: { state: true },
    };
  }

  constructor() {
    super();
    this.label = '';
    this.a11yLabel = '';
    this.value = '';
    this.name = '';
    this.placeholder = '';
    this.hint = '';
    this.error = '';
    this.options = [];
    this.disabled = false;
    this.required = false;
    this.ambient = 'primary';
    this._slottedOptions = [];
  }

  /** Opciones efectivas: la propiedad `options` gana sobre los `<option>` por slot. */
  get _options() {
    const source = this.options?.length ? this.options : this._slottedOptions;
    return source.map(normalizeOption);
  }

  get _message() {
    return this.error || this.hint;
  }

  /** Lleva el foco al select interno. */
  focus(options) {
    this.renderRoot.querySelector('select')?.focus(options);
  }

  updated(changed) {
    // `selected` solo fija la selección inicial: una vez que el usuario interactuó,
    // el navegador la ignora. Se sincroniza el valor del select a mano.
    const select = this.renderRoot.querySelector('select');
    if (
      select &&
      (changed.has('value') || changed.has('options') || changed.has('_slottedOptions'))
    ) {
      select.value = this.value;
    }
  }

  render() {
    const hasError = Boolean(this.error);
    const classes = `ac-select-basic ac-select--${this.ambient}${hasError ? ' ac-select--invalid' : ''}`;

    return html`
      <div part="root" class=${classes}>
        ${
          this.label
            ? html`<label part="label" class="ac-select-basic__label" for="field">
                ${this.t(this.label)}${
                  this.required
                    ? html`<span class="ac-select-basic__required" aria-hidden="true"> *</span>`
                    : nothing
                }
              </label>`
            : nothing
        }
        <select
          part="select"
          id="field"
          class="ac-select-basic__field"
          name=${this.name}
          aria-label=${!this.label && this.a11yLabel ? this.t(this.a11yLabel) : nothing}
          aria-invalid=${hasError ? 'true' : 'false'}
          aria-describedby=${this._message ? 'message' : nothing}
          ?disabled=${this.disabled}
          ?required=${this.required}
          @change=${this._onChange}
        >
          ${
            this.placeholder
              ? html`<option value="" disabled hidden ?selected=${!this.value}>
                  ${this.t(this.placeholder)}
                </option>`
              : nothing
          }
          ${this._options.map(
            option => html`
              <option
                value=${option.value}
                ?disabled=${option.disabled}
                ?selected=${option.value === this.value}
              >
                ${this.t(option.label)}
              </option>
            `,
          )}
        </select>
        ${
          this._message
            ? html`<p
                part=${hasError ? 'error' : 'hint'}
                id="message"
                class="ac-select-basic__message ${hasError ? 'ac-select-basic__message--error' : ''}"
                role=${hasError ? 'alert' : nothing}
              >
                ${this.t(this._message)}
              </p>`
            : nothing
        }
        <slot hidden @slotchange=${this._onSlotChange}></slot>
      </div>
    `;
  }

  _onSlotChange(event) {
    const slotted = event.target.assignedElements().filter(element => element.tagName === 'OPTION');

    this._slottedOptions = slotted.map(option => ({
      value: option.value,
      label: option.textContent.trim(),
      disabled: option.disabled,
    }));

    const preselected = slotted.find(option => option.hasAttribute('selected'));
    if (!this.value && preselected) {
      this.value = preselected.value;
    }
  }

  _onChange(event) {
    this.value = event.target.value;
    const selected = this._options.find(option => option.value === this.value);

    this.dispatchEvent(
      new CustomEvent('ac-select-basic-change', {
        detail: { value: this.value, label: selected?.label ?? '' },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
