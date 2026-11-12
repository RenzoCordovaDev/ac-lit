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
    if (toast.contained) toast._syncContainedPosition();
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
      contained: { type: Boolean, reflect: true },
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
    // `contained`: igual que en ac-modal-basic, el toast sigue usando la capa
    // superior nativa (`showPopover()`), solo cambia DÓNDE se dibuja — el área
    // que mide `getBoundary()` en vez del viewport real. Ver "Superposiciones"
    // en CONVENTIONS.md.
    this.contained = false;
    this.getBoundary = null;
    this._closeReason = undefined;
    this._closeToken = 0;
    this._closeTimer = undefined;
    this._dismissTimer = undefined;
    this._remaining = 0;
    this._startedAt = 0;
    this._hovered = false;
    this._focused = false;
    this._boundaryObserver = undefined;
    this._onViewportChange = this._syncContainedPosition.bind(this);
  }

  disconnectedCallback() {
    clearTimeout(this._closeTimer);
    clearTimeout(this._dismissTimer);
    this._stopBoundaryTracking();
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
      // El navegador "congela" la posición de un popover en el momento exacto
      // de `showPopover()`: cambiar top/left/bottom DESPUÉS de abierto no
      // mueve nada (probado empíricamente). Por eso el cálculo va ANTES.
      if (this.contained) this._startBoundaryTracking();
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
      this._stopBoundaryTracking();
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

  /**
   * Mide `getBoundary()` y calcula dónde debe quedar el toast dentro de esa
   * área (CSS puro no puede expresar "a 1rem del borde inferior de un
   * elemento cualquiera", solo del viewport). Se reusa también desde
   * `reflowStack()`: el apilado cambia la posición de todos los toasts de la
   * misma posición, no solo del que abre/cierra.
   */
  _syncContainedPosition() {
    if (typeof this.getBoundary !== 'function') return;
    const boundary = this.getBoundary();
    const popover = this._popover;
    if (!boundary || !popover) return;

    const rawRect = boundary.getBoundingClientRect();
    // Se recorta contra el viewport REAL: un dispositivo simulado más alto que
    // la ventana real (ej. "móvil" con ventanas de navegador bajas) no debe
    // dejar el toast fuera de lo que se puede ver/alcanzar (`position: fixed`
    // no se desplaza con el scroll de la página).
    const boundaryRect = {
      top: Math.max(rawRect.top, 0),
      left: Math.max(rawRect.left, 0),
      bottom: Math.min(rawRect.bottom, window.innerHeight),
      right: Math.min(rawRect.right, window.innerWidth),
    };
    boundaryRect.width = Math.max(boundaryRect.right - boundaryRect.left, 0);

    const gap = 16; // 1rem, asumiendo el root font-size por defecto
    // El navegador fija top/left/bottom en el momento exacto de
    // `showPopover()` (comprobado empíricamente: cambiarlos después de
    // abierto no mueve nada) — por eso este cálculo corre ANTES de abrir, lo
    // que impide usar el tamaño propio del popover (todavía no se pintó) o el
    // offset de apilado (cambia mientras sigue abierto). Por eso solo fija el
    // ANCLA estática (borde del marco + gap); el centrado horizontal y el
    // desplazamiento del apilado van en `transform` (sí se actualiza en vivo,
    // como ya hacía la animación de cierre) con `translateX(-50%)` y
    // referenciando `--ac-toast-offset` directamente — ver el CSS.
    const anchor =
      this._position === 'top'
        ? boundaryRect.top + gap
        : window.innerHeight - boundaryRect.bottom + gap;
    const centerX = boundaryRect.left + boundaryRect.width / 2;

    this.style.setProperty(
      this._position === 'top'
        ? '--ac-toast-basic-contained-top'
        : '--ac-toast-basic-contained-bottom',
      `${anchor}px`,
    );
    this.style.setProperty('--ac-toast-basic-contained-left', `${centerX}px`);
    this.style.setProperty(
      '--ac-toast-basic-contained-maxw',
      `${Math.max(boundaryRect.width - 32, 0)}px`,
    );
    // No las usa ningún selector CSS: existen para que las pruebas e2e puedan
    // comparar el toast contra el mismo rect (ya recortado) que usó para
    // posicionarse, sin tener que volver a calcularlo.
    this.style.setProperty('--ac-toast-basic-contained-boundary-top', `${boundaryRect.top}px`);
    this.style.setProperty(
      '--ac-toast-basic-contained-boundary-bottom',
      `${boundaryRect.bottom}px`,
    );
  }

  _startBoundaryTracking() {
    if (typeof this.getBoundary !== 'function') return;
    this._syncContainedPosition();
    const boundary = this.getBoundary();
    if (boundary) {
      this._boundaryObserver ??= new ResizeObserver(this._onViewportChange);
      this._boundaryObserver.disconnect();
      this._boundaryObserver.observe(boundary);
    }
    window.addEventListener('resize', this._onViewportChange);
  }

  _stopBoundaryTracking() {
    this._boundaryObserver?.disconnect();
    window.removeEventListener('resize', this._onViewportChange);
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
