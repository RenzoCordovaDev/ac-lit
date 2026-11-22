import { LitElement, html, nothing } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
import '@ac-components/ac-icon-basic';
// Authored in input-basic.styles.scss, compiled to input-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { InputBasicStyles } from './input-basic.styles.js';

const ALLOWED_TYPES = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'];

// Capa puramente visual, separada de `ALLOWED_TYPES`/`_type` (el `type`
// NATIVO del `<input>`, intocado): lee el mismo valor crudo de `this.type`
// para decidir un ícono a la izquierda y un placeholder sugerido. `amount` y
// `date` no son tipos nativos válidos (el `<input>` real sigue cayendo a
// `text` vía `_type`), pero igual muestran ícono/placeholder; `number` y
// `email` ya eran tipos nativos válidos y ahora también los muestran.
const TYPE_ICON = { amount: 'currency', date: 'calendar', number: 'hash', email: 'email' };
const TYPE_PLACEHOLDER_KEY = {
  amount: 'input-basic-placeholder-amount',
  date: 'input-basic-placeholder-date',
  number: 'input-basic-placeholder-number',
  email: 'input-basic-placeholder-email',
};

export class InputBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-input-basic';
  }

  static get styles() {
    return [componentBaseStyles, InputBasicStyles];
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

  // Ícono sugerido según `type` (valor crudo, sin pasar por `_type`/la lista
  // blanca nativa). `null` cuando el tipo no tiene ícono asociado.
  get _typeIcon() {
    return TYPE_ICON[this.type] ?? null;
  }

  // Si el consumidor seteó su propio `placeholder`, ese siempre gana. Si no,
  // y el `type` tiene un placeholder sugerido, se usa ese (traducido vía
  // `this.t()`, igual que el resto de los textos del componente).
  get _placeholder() {
    if (this.placeholder) {
      return this.t(this.placeholder);
    }
    const key = TYPE_PLACEHOLDER_KEY[this.type];
    return key ? this.t(key) : '';
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
    const icon = this._typeIcon;
    const placeholder = this._placeholder;
    const wrapperClasses = `ac-input-basic__field-wrapper${
      icon ? ' ac-input-basic__field-wrapper--with-icon' : ''
    }`;

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
        <div class=${wrapperClasses}>
          ${
            icon
              ? html`<ac-icon-basic
                  part="type-icon"
                  class="ac-input-basic__icon"
                  name=${icon}
                  size="sm"
                ></ac-icon-basic>`
              : nothing
          }
          <input
            part="input"
            id="field"
            class="ac-input-basic__field"
            type=${this._type}
            name=${this.name}
            .value=${this.value}
            placeholder=${placeholder ? placeholder : nothing}
            aria-label=${!this.label && this.a11yLabel ? this.t(this.a11yLabel) : nothing}
            aria-invalid=${hasError ? 'true' : 'false'}
            aria-describedby=${this._message ? 'message' : nothing}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            @input=${this._onInput}
            @change=${this._onChange}
          />
        </div>
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
