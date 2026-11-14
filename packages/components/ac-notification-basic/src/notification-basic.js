import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
// Authored in notification-basic.styles.scss, compiled to notification-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { NotificationBasicStyles } from './notification-basic.styles.js';

const AMBIENTS = new Set(['neutral', 'success', 'warning', 'danger']);
const DEFAULT_AMBIENT = 'neutral';

const CLOSE_ICON = html`<svg
  viewBox="0 0 24 24"
  width="16"
  height="16"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  aria-hidden="true"
>
  <path d="M6 6l12 12M18 6L6 18" />
</svg>`;

// Íconos decorativos por ambient — SVGs simples e inequívocos, no calcados de
// ningún set de íconos real. Siempre aria-hidden (ver render()).
const ICON_MAP = {
  neutral: html`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
    <path d="M12 11v5M12 8v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>`,
  success: html`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
    <path
      d="M8 12.5l2.5 2.5L16 9.5"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>`,
  warning: html`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <path
      d="M12 4.5l9 15.5H3l9-15.5z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <path
      d="M12 10.5v3.5M12 17v.01"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>`,
  danger: html`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
    <path d="M12 7.5v5.5M12 16v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>`,
};

export class NotificationBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-notification-basic';
  }

  // componentBaseStyles primero: fija `font-family` y el skeleton de `loading`
  // (tokens "Emerald Pro", ver docs/CONVENTIONS.md) — no lo quites.
  static get styles() {
    return [componentBaseStyles, NotificationBasicStyles];
  }

  static get properties() {
    return {
      message: { type: String },
      ambient: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.message = '';
    this.ambient = DEFAULT_AMBIENT;
  }

  get _ambient() {
    return AMBIENTS.has(this.ambient) ? this.ambient : DEFAULT_AMBIENT;
  }

  render() {
    const ambient = this._ambient;
    const classes = `ac-notification-basic ac-notification--${ambient}`;

    return html`
      <div part="root" class=${classes}>
        <span part="icon" class="ac-notification-basic__icon" aria-hidden="true">
          ${ICON_MAP[ambient]}
        </span>
        <p part="message" class="ac-notification-basic__message">${this.t(this.message)}</p>
        <button
          part="dismiss"
          class="ac-notification-basic__dismiss"
          type="button"
          aria-label=${this.t('notification-basic-dismiss')}
          @click=${this._onDismissClick}
        >
          ${CLOSE_ICON}
        </button>
      </div>
    `;
  }

  _onDismissClick() {
    // El componente nunca se cierra ni se remueve a sí mismo — igual criterio
    // que el pie de ac-modal-basic o la flecha de ac-transition-container:
    // solo avisa, quien lo consume decide (ej. sacarlo del array de una lista).
    this._emit('ac-notification-basic-dismiss-click');
  }

  _emit(name, detail = true) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}
