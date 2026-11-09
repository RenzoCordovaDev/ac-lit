import { LitElement, html } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in radio-basic.styles.scss, compiled to radio-basic.styles.js by
// `pnpm run build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm build` or `pnpm dev` to generate it.
import { RadioBasicStyles } from './radio-basic.styles.js';

// Un <input type="radio"> nativo solo agrupa con otros radios del MISMO
// shadow root — cada instancia de ac-radio-basic vive en su propio shadow
// root, así que el agrupado nativo por `name` no funciona entre instancias
// (confirmado: ni Firefox, ni Chromium, ni Safari agrupan radios a través de
// shadow boundaries). Este registro coordina manualmente qué instancia debe
// desmarcarse cuando otra del mismo `name` se marca.
const groups = new Map();

function registerInGroup(name, instance) {
  if (!name) return;
  if (!groups.has(name)) {
    groups.set(name, new Set());
  }
  groups.get(name).add(instance);
}

function unregisterFromGroup(name, instance) {
  groups.get(name)?.delete(instance);
}

function uncheckOthersInGroup(name, checkedInstance) {
  for (const instance of groups.get(name) ?? []) {
    if (instance !== checkedInstance && instance.checked) {
      instance.checked = false;
    }
  }
}

export class RadioBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-radio-basic';
  }

  static get styles() {
    return [RadioBasicStyles];
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
  }

  connectedCallback() {
    super.connectedCallback();
    registerInGroup(this.name, this);
  }

  disconnectedCallback() {
    unregisterFromGroup(this.name, this);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <label part="root" class="ac-radio-basic">
        <input
          part="input"
          class="ac-radio-basic__input"
          type="radio"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this._onChange}
        />
        <span part="control" class="ac-radio-basic__control" aria-hidden="true"></span>
        <span part="label" class="ac-radio-basic__label">
          ${this.text ? this.t(this.text) : html`<slot></slot>`}
        </span>
      </label>
    `;
  }

  _onChange(event) {
    this.checked = event.target.checked;

    if (this.checked) {
      uncheckOthersInGroup(this.name, this);
    }

    this.dispatchEvent(
      new CustomEvent('ac-radio-basic-change', {
        detail: { checked: this.checked, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
