import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in toast-basic.styles.scss, compiled to toast-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { ToastBasicStyles } from './toast-basic.styles.js';

const POSITIONS = new Set(['top', 'bottom']);
const AMBIENTS = new Set(['neutral', 'success', 'warning', 'danger']);
const CLOSING_CLASS = 'ac-toast-basic--closing';
const CLOSE_FALLBACK_MS = 600;
const STACK_GAP_PX = 8;
const MIN_RESUME_MS = 1000;

// Los toasts abiertos en la misma posición se apilan en vez de taparse. Cada
// instancia vive en su propio shadow root, así que este registro en memoria
// (mismo patrón que `ac-radio-basic`) conoce el orden de apertura y calcula el
// desplazamiento de cada una.
const stacks = { top: [], bottom: [] };

function addToStack(toast) {
  const stack = stacks[toast._position];
  if (!stack.includes(toast)) stack.push(toast);
}

function removeFromStack(toast, position = toast._position) {
  const stack = stacks[position];
  const index = stack.indexOf(toast);
  if (index >= 0) stack.splice(index, 1);
}

function reflowStack(position) {
  let offset = 0;
  for (const toast of stacks[position]) {
    toast.style.setProperty('--ac-toast-offset', `${offset}px`);
    offset += toast._height + STACK_GAP_PX;
  }
}

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

export class ToastBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-toast-basic';
  }

  static get styles() {
    return [ToastBasicStyles];
  }

  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      message: { type: String },
      duration: { type: Number },
      position: { type: String, reflect: true },
      hideClose: { type: Boolean, attribute: 'hide-close' },
      actionText: { type: String, attribute: 'action-text' },
    };
  }

  constructor() {
    super();
    this.open = false;
    this.message = '';
    this.duration = 4000;
    this.position = 'bottom';
    this.hideClose = false;
    this.actionText = '';
    this.ambient = 'neutral';
    this._closeReason = undefined;
    this._closeToken = 0;
    this._closeTimer = undefined;
    this._dismissTimer = undefined;
    this._remaining = 0;
    this._startedAt = 0;
    this._hovered = false;
    this._focused = false;
  }

  disconnectedCallback() {
    clearTimeout(this._closeTimer);
    clearTimeout(this._dismissTimer);
    removeFromStack(this);
    reflowStack(this._position);
    super.disconnectedCallback();
  }

  /** Muestra el toast. */
  show() {
    this.open = true;
  }

  /** Cierra el toast (con su animación). */
  hide() {
    this._requestClose('api');
  }

  get _position() {
    return POSITIONS.has(this.position) ? this.position : 'bottom';
  }

  get _ambient() {
    return AMBIENTS.has(this.ambient) ? this.ambient : 'neutral';
  }

  get _popover() {
    return this.renderRoot.querySelector('[popover]');
  }

  get _height() {
    return this._popover?.getBoundingClientRect().height ?? 0;
  }

  get _text() {
    return this.message ? this.t(this.message) : this.textContent.trim();
  }

  updated(changed) {
    const popover = this._popover;

    if (changed.has('position') && this.open && changed.get('position') !== undefined) {
      const previous = POSITIONS.has(changed.get('position')) ? changed.get('position') : 'bottom';
      removeFromStack(this, previous);
      addToStack(this);
      reflowStack(previous);
      reflowStack(this._position);
    }

    if (changed.has('duration') && this.open && changed.get('duration') !== undefined) {
      this._startDismissTimer(this.duration);
    }

    if (!changed.has('open')) return;

    const previous = changed.get('open');

    if (this.open) {
      this._cancelPendingClose();
      if (!popover.matches(':popover-open')) popover.showPopover();
      addToStack(this);
      reflowStack(this._position);
      this._startDismissTimer(this.duration);
      // `undefined` = primera renderización: el estado inicial no es un cambio.
      if (previous !== undefined) this._emit('ac-toast-basic-show');
    } else if (popover.matches(':popover-open')) {
      clearTimeout(this._dismissTimer);
      if (previous === true) {
        this._emit('ac-toast-basic-close', { reason: this._closeReason ?? 'api' });
      }
      this._closeReason = undefined;
      removeFromStack(this);
      reflowStack(this._position);
      this._animateClose(popover);
    }
  }

  render() {
    const isAlert = this._ambient === 'danger';

    return html`
      <div
        part="root"
        class="ac-toast-basic ac-toast--${this._ambient}"
        popover="manual"
        @pointerenter=${this._onPointerEnter}
        @pointerleave=${this._onPointerLeave}
        @focusin=${this._onFocusIn}
        @focusout=${this._onFocusOut}
      >
        <span part="message" class="ac-toast-basic__message" aria-hidden="true">
          ${this.message ? this.t(this.message) : html`<slot></slot>`}
        </span>
        ${
          this.actionText
            ? html`<button
                part="action"
                class="ac-toast-basic__action"
                type="button"
                @click=${this._onActionClick}
              >
                ${this.t(this.actionText)}
              </button>`
            : nothing
        }
        ${
          this.hideClose
            ? nothing
            : html`<button
                part="close"
                class="ac-toast-basic__close"
                type="button"
                aria-label=${this.t('toast-basic-close')}
                @click=${this._onCloseClick}
              >
                ${CLOSE_ICON}
              </button>`
        }
      </div>
      <!-- El mensaje se anuncia desde una región viva que existe siempre: un elemento
           que aparece ya con su texto no se anuncia de forma fiable. -->
      <div
        class="ac-toast-basic__live"
        role=${isAlert ? 'alert' : 'status'}
        aria-live=${isAlert ? 'assertive' : 'polite'}
        aria-atomic="true"
      >
        ${this.open ? this._text : ''}
      </div>
    `;
  }

  _requestClose(reason) {
    if (!this.open) return;
    this._closeReason = reason;
    this.open = false;
  }

  /** Salida animada; al terminar se oculta el popover. */
  _animateClose(popover) {
    const token = ++this._closeToken;
    clearTimeout(this._closeTimer);
    popover.classList.add(CLOSING_CLASS);

    const onEnd = event => {
      if (event.target === popover) finish();
    };
    const finish = () => {
      popover.removeEventListener('animationend', onEnd);
      if (token !== this._closeToken) return;
      clearTimeout(this._closeTimer);
      popover.classList.remove(CLOSING_CLASS);
      if (popover.matches(':popover-open')) popover.hidePopover();
    };

    // Sin animación (prefers-reduced-motion) `animationend` nunca llega: se oculta ya.
    if (!parseFloat(getComputedStyle(popover).animationDuration)) {
      finish();
      return;
    }

    popover.addEventListener('animationend', onEnd);
    this._closeTimer = setTimeout(finish, CLOSE_FALLBACK_MS);
  }

  _cancelPendingClose() {
    this._closeToken += 1;
    clearTimeout(this._closeTimer);
    this._popover?.classList.remove(CLOSING_CLASS);
  }

  // Cierre automático. Se pausa mientras el puntero está encima o el foco está
  // dentro (WCAG 2.2.1: el usuario necesita tiempo para leer y actuar).
  _startDismissTimer(ms) {
    clearTimeout(this._dismissTimer);
    this._dismissTimer = undefined;
    if (!this.open || !(ms > 0)) return;

    this._remaining = ms;
    if (this._hovered || this._focused) return;

    this._startedAt = Date.now();
    this._dismissTimer = setTimeout(() => this._requestClose('timeout'), ms);
  }

  _pauseDismissTimer() {
    if (!this._dismissTimer) return;
    clearTimeout(this._dismissTimer);
    this._dismissTimer = undefined;
    this._remaining -= Date.now() - this._startedAt;
  }

  _resumeDismissTimer() {
    if (this._hovered || this._focused || !this.open || !(this.duration > 0)) return;
    if (this._dismissTimer) return;
    this._startDismissTimer(Math.max(this._remaining, MIN_RESUME_MS));
  }

  _onPointerEnter() {
    this._hovered = true;
    this._pauseDismissTimer();
  }

  _onPointerLeave() {
    this._hovered = false;
    this._resumeDismissTimer();
  }

  _onFocusIn() {
    this._focused = true;
    this._pauseDismissTimer();
  }

  _onFocusOut() {
    this._focused = false;
    this._resumeDismissTimer();
  }

  _onCloseClick() {
    this._emit('ac-toast-basic-close-click');
    this._requestClose('close-button');
  }

  _onActionClick() {
    this._emit('ac-toast-basic-action-click');
  }

  _emit(name, detail = true) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}
