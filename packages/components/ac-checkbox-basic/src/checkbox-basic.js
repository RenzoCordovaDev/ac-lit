import { LitElement, html } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in checkbox-basic.styles.scss, compiled to checkbox-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { CheckboxBasicStyles } from './checkbox-basic.styles.js';

const CHECK_ICON = html`<svg
  class="ac-checkbox-basic__icon"
  viewBox="0 0 16 16"
  width="14"
  height="14"
  fill="none"
  stroke="currentColor"
  stroke-width="2.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path class="ac-checkbox-basic__check" d="M3 8.5l3.2 3.2L13 4.5" />
  <path class="ac-checkbox-basic__dash" d="M3.5 8h9" />
</svg>`;

export class CheckboxBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-checkbox-basic';
  }

  static get styles() {
    return [CheckboxBasicStyles];
  }

  static get properties() {
    return {
      text: { type: String },
      name: { type: String },
      value: { type: String },
      checked: { type: Boolean, reflect: true },
      indeterminate: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.text = '';
    this.name = '';
    this.value = '';
    this.checked = false;
    this.indeterminate = false;
    this.disabled = false;
    this.ambient = 'primary';
  }

  render() {
    return html`
      <label part="root" class="ac-checkbox-basic ac-checkbox--${this.ambient}">
        <input
          part="input"
          class="ac-checkbox-basic__input"
          type="checkbox"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          @change=${this._onChange}
        />
        <span part="control" class="ac-checkbox-basic__control" aria-hidden="true">
          ${CHECK_ICON}
        </span>
        <span part="label" class="ac-checkbox-basic__label">
          ${this.text ? this.t(this.text) : html`<slot></slot>`}
        </span>
      </label>
    `;
  }

  _onChange(event) {
    this.checked = event.target.checked;
    this.indeterminate = false;

    this.dispatchEvent(
      new CustomEvent('ac-checkbox-basic-change', {
        detail: { checked: this.checked, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
