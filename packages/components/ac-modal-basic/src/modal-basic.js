import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Dependencias del catálogo: se registran como efecto de importar su `index.js`.
import '@ac-components/ac-button-basic';
import '@ac-components/ac-link-basic';
// Authored in modal-basic.styles.scss, compiled to modal-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { ModalBasicStyles } from './modal-basic.styles.js';

// Si `animationend` no llega (pestaña en segundo plano, etc.), el cierre no puede
// quedarse colgado: este tope fuerza `dialog.close()`.
const CLOSE_FALLBACK_MS = 600;
const CLOSING_CLASS = 'ac-modal-basic--closing';

const CLOSE_ICON = html`<svg
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  aria-hidden="true"
>
  <path d="M6 6l12 12M18 6L6 18" />
</svg>`;

export class ModalBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-modal-basic';
  }

  static get styles() {
    return [ModalBasicStyles];
  }

  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      header: { type: String },
      size: { type: String, reflect: true },
      persistent: { type: Boolean, reflect: true },
      hideClose: { type: Boolean, attribute: 'hide-close' },
      primaryText: { type: String, attribute: 'primary-text' },
      primaryDisabled: { type: Boolean, attribute: 'primary-disabled' },
      secondaryText: { type: String, attribute: 'secondary-text' },
      secondaryDisabled: { type: Boolean, attribute: 'secondary-disabled' },
      linkText: { type: String, attribute: 'link-text' },
      linkHref: { type: String, attribute: 'link-href' },
    };
  }

  constructor() {
    super();
    this.open = false;
    this.header = '';
    this.size = 'offset';
    this.persistent = false;
    this.hideClose = false;
    this.primaryText = '';
    this.primaryDisabled = false;
    this.secondaryText = '';
    this.secondaryDisabled = false;
    this.linkText = '';
    this.linkHref = '';
    this.ambient = 'primary';
    this._closeReason = undefined;
    this._closeToken = 0;
    this._closeTimer = undefined;
  }

  disconnectedCallback() {
    clearTimeout(this._closeTimer);
    super.disconnectedCallback();
  }

  /** Abre el modal. */
  show() {
    this.open = true;
  }

  /** Cierra el modal (con su animación). */
  hide() {
    this._requestClose('api');
  }

  get _dialog() {
    return this.renderRoot.querySelector('dialog');
  }

  get _hasFooter() {
    return Boolean(this.primaryText || this.secondaryText || this.linkText);
  }

  updated(changed) {
    if (!changed.has('open')) return;

    const dialog = this._dialog;
    const previous = changed.get('open');

    if (this.open) {
      this._cancelPendingClose();
      if (!dialog.open) dialog.showModal();
      // `undefined` = primera renderización: el estado inicial no es un cambio.
      if (previous !== undefined) this._emit('ac-modal-basic-open');
    } else if (dialog.open) {
      if (previous === true) {
        this._emit('ac-modal-basic-close', { reason: this._closeReason ?? 'api' });
      }
      this._closeReason = undefined;
      this._animateClose(dialog);
    }
  }

  render() {
    return html`
      <dialog
        part="dialog"
        class="ac-modal-basic ac-modal--${this.ambient}"
        aria-labelledby="title"
        @cancel=${this._onCancel}
        @click=${this._onDialogClick}
        @close=${this._onNativeClose}
      >
        <div class="ac-modal-basic__panel">
          <header part="header" class="ac-modal-basic__header">
            <h2 part="title" id="title" class="ac-modal-basic__title">
              ${this.t(this.header || 'modal-basic-title')}
            </h2>
            ${
              this.hideClose
                ? nothing
                : html`<button
                    part="close"
                    class="ac-modal-basic__close"
                    type="button"
                    aria-label=${this.t('modal-basic-close')}
                    @click=${this._onCloseClick}
                  >
                    ${CLOSE_ICON}
                  </button>`
            }
          </header>
          <div
            part="body"
            class="ac-modal-basic__body"
            role="region"
            aria-labelledby="title"
            tabindex="0"
          >
            <slot></slot>
          </div>
          ${this._hasFooter ? this._renderFooter() : nothing}
        </div>
      </dialog>
    `;
  }

  _renderFooter() {
    return html`
      <footer part="footer" class="ac-modal-basic__footer">
        ${
          this.linkText
            ? html`<ac-link-basic
                part="link"
                ambient="primary"
                text=${this.t(this.linkText)}
                href=${this.linkHref}
                @ac-link-basic-click=${this._onLinkClick}
              ></ac-link-basic>`
            : html`<span></span>`
        }
        <div class="ac-modal-basic__actions">
          ${
            this.secondaryText
              ? html`<ac-button-basic
                  part="secondary"
                  ambient="primary-alt"
                  text=${this.t(this.secondaryText)}
                  ?disabled=${this.secondaryDisabled}
                  @ac-button-basic-click=${this._onSecondaryClick}
                ></ac-button-basic>`
              : nothing
          }
          ${
            this.primaryText
              ? html`<ac-button-basic
                  part="primary"
                  ambient=${this.ambient}
                  text=${this.t(this.primaryText)}
                  ?disabled=${this.primaryDisabled}
                  @ac-button-basic-click=${this._onPrimaryClick}
                ></ac-button-basic>`
              : nothing
          }
        </div>
      </footer>
    `;
  }

  _requestClose(reason) {
    if (!this.open) return;
    this._closeReason = reason;
    this.open = false;
  }

  /** Anima la salida (de arriba hacia abajo) y, al terminar, cierra el `<dialog>`. */
  _animateClose(dialog) {
    const token = ++this._closeToken;
    clearTimeout(this._closeTimer);
    dialog.classList.add(CLOSING_CLASS);

    const onEnd = event => {
      if (event.target === dialog) finish();
    };
    const finish = () => {
      dialog.removeEventListener('animationend', onEnd);
      if (token !== this._closeToken) return;
      clearTimeout(this._closeTimer);
      dialog.classList.remove(CLOSING_CLASS);
      if (dialog.open) dialog.close();
    };

    // Sin animación (prefers-reduced-motion) `animationend` nunca llega: se cierra ya.
    if (!parseFloat(getComputedStyle(dialog).animationDuration)) {
      finish();
      return;
    }

    dialog.addEventListener('animationend', onEnd);
    this._closeTimer = setTimeout(finish, CLOSE_FALLBACK_MS);
  }

  _cancelPendingClose() {
    this._closeToken += 1;
    clearTimeout(this._closeTimer);
    this._dialog?.classList.remove(CLOSING_CLASS);
  }

  _onCancel(event) {
    // Esc: se cierra con animación en vez del cierre inmediato del navegador.
    event.preventDefault();
    if (!this.persistent) this._requestClose('escape');
  }

  _onDialogClick(event) {
    // El panel ocupa todo el <dialog>: un click que llega al propio <dialog> es el backdrop.
    if (event.target === event.currentTarget && !this.persistent) {
      this._requestClose('backdrop');
    }
  }

  _onNativeClose() {
    // El navegador cerró el <dialog> por su cuenta (no por `open = false`).
    if (this.open) {
      this._closeReason = undefined;
      this._emit('ac-modal-basic-close', { reason: 'native' });
      this.open = false;
    }
  }

  _onCloseClick() {
    this._emit('ac-modal-basic-close-click');
    this._requestClose('close-button');
  }

  _onPrimaryClick(event) {
    event.stopPropagation();
    this._emit('ac-modal-basic-primary-click');
  }

  _onSecondaryClick(event) {
    event.stopPropagation();
    this._emit('ac-modal-basic-secondary-click');
  }

  _onLinkClick(event) {
    event.stopPropagation();
    this._emit('ac-modal-basic-link-click', { href: this.linkHref });
  }

  _emit(name, detail = true) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}
