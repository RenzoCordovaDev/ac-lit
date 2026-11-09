import { LitElement, html } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in switch-basic.styles.scss, compiled to switch-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { SwitchBasicStyles } from './switch-basic.styles.js';

export class SwitchBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-switch-basic';
  }

  static get styles() {
    return [SwitchBasicStyles];
  }

  static get properties() {
    return {
      text: { type: String },
      name: { type: String },
      value: { type: String },
      checked: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.text = '';
    this.name = '';
    this.value = '';
    this.checked = false;
    this.disabled = false;
    this.ambient = 'primary';
  }

  render() {
    return html`
      <label part="root" class="ac-switch-basic ac-switch--${this.ambient}">
        <input
          part="input"
          class="ac-switch-basic__input"
          type="checkbox"
          role="switch"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this._onChange}
        />
        <span part="track" class="ac-switch-basic__track" aria-hidden="true">
          <span part="thumb" class="ac-switch-basic__thumb"></span>
        </span>
        <span part="label" class="ac-switch-basic__label">
          ${this.text ? this.t(this.text) : html`<slot></slot>`}
        </span>
      </label>
    `;
  }

  _onChange(event) {
    this.checked = event.target.checked;

    this.dispatchEvent(
      new CustomEvent('ac-switch-basic-change', {
        detail: { checked: this.checked, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
