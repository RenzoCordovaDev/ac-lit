import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in transition-container.styles.scss, compiled to transition-container.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { TransitionContainerStyles } from './transition-container.styles.js';

// Si `animationend` no llega (pestaña en segundo plano, etc.), el cierre no puede
// quedarse colgado: este tope fuerza `dialog.close()`.
const CLOSE_FALLBACK_MS = 600;
const CLOSING_CLASS = 'ac-transition-container--closing';

const HEADER_TYPES = ['first-level-initial', 'first-level-sequential'];
const DEFAULT_HEADER_TYPE = 'first-level-initial';

const BACK_ICON = html`<svg
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d="M15 6l-6 6 6 6" />
</svg>`;

const MENU_ICON = html`<svg
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  aria-hidden="true"
>
  <path d="M4 6h16M4 12h16M4 18h16" />
</svg>`;

export class TransitionContainer extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-transition-container';
  }

  static get styles() {
    return [TransitionContainerStyles];
  }

  static get properties() {
    return {
      visible: { type: Boolean, reflect: true },
      headerText: { type: String, attribute: 'header-text' },
      headerType: { type: String, attribute: 'header-type', reflect: true },
      hideMenuIcon: { type: Boolean, attribute: 'hide-menu-icon', reflect: true },
      persistent: { type: Boolean, reflect: true },
      contained: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.visible = false;
    this.headerText = '';
    this.headerType = DEFAULT_HEADER_TYPE;
    this.hideMenuIcon = false;
    this.persistent = false;
    this.ambient = 'primary';
    // `contained`: en vez del viewport real (lo que da `showModal()` por
    // defecto), el contenedor se dibuja sobre el área que mide `getBoundary()` —
    // pensado para que `ac-demo-content` simule un dispositivo acotado sin
    // perder el foco/Escape/inert que da la capa superior nativa. Ver
    // "Superposiciones" en CONVENTIONS.md.
    this.contained = false;
    this.getBoundary = null;
    this._closeReason = undefined;
    this._closeToken = 0;
    this._closeTimer = undefined;
    this._boundaryObserver = undefined;
    this._onViewportChange = this._syncContainedRect.bind(this);
  }

  willUpdate(changed) {
    if (changed.has('headerType') && !HEADER_TYPES.includes(this.headerType)) {
      this.headerType = DEFAULT_HEADER_TYPE;
    }
  }

  disconnectedCallback() {
    clearTimeout(this._closeTimer);
    this._stopBoundaryTracking();
    super.disconnectedCallback();
  }

  /** Abre el contenedor. */
  show() {
    this.visible = true;
  }

  /** Cierra el contenedor (con su animación). */
  hide() {
    this._requestClose('api');
  }

  get _dialog() {
    return this.renderRoot.querySelector('dialog');
  }

  get _isSequential() {
    return this.headerType === 'first-level-sequential';
  }

  updated(changed) {
    if (!changed.has('visible')) return;

    const dialog = this._dialog;
    const previous = changed.get('visible');

    if (this.visible) {
      this._cancelPendingClose();
      if (!dialog.open) dialog.showModal();
      if (this.contained) this._startBoundaryTracking();
      // `undefined` = primera renderización: el estado inicial no es un cambio.
      if (previous !== undefined) this._emit('ac-transition-container-open');
    } else if (dialog.open) {
      if (previous === true) {
        this._emit('ac-transition-container-close', { reason: this._closeReason ?? 'api' });
      }
      this._closeReason = undefined;
      this._animateClose(dialog);
    }
  }

  render() {
    return html`
      <dialog
        part="dialog"
        class="ac-transition-container ac-transition-container--${this.ambient}"
        aria-labelledby="title"
        @cancel=${this._onCancel}
        @close=${this._onNativeClose}
      >
        <div class="ac-transition-container__panel">
          <header part="header" class="ac-transition-container__header">
            <div class="ac-transition-container__header-start">
              ${
                this._isSequential
                  ? html`<button
                      part="back"
                      class="ac-transition-container__back"
                      type="button"
                      aria-label=${this.t('transition-container-back')}
                      @click=${this._onBackClick}
                    >
                      ${BACK_ICON}
                    </button>`
                  : nothing
              }
            </div>
            <h2 part="title" id="title" class="ac-transition-container__title">
              ${this.t(this.headerText || 'transition-container-title')}
            </h2>
            <div class="ac-transition-container__header-end">
              <slot name="header-end"></slot>
              ${
                this.hideMenuIcon
                  ? nothing
                  : html`<button
                      part="menu"
                      class="ac-transition-container__menu"
                      type="button"
                      aria-label=${this.t('transition-container-menu')}
                      @click=${this._onMenuClick}
                    >
                      ${MENU_ICON}
                    </button>`
              }
            </div>
          </header>
          <div
            part="body"
            class="ac-transition-container__body"
            role="region"
            aria-labelledby="title"
            tabindex="0"
          >
            <slot></slot>
          </div>
        </div>
      </dialog>
    `;
  }

  _requestClose(reason) {
    if (!this.visible) return;
    this._closeReason = reason;
    this.visible = false;
  }

  /** Anima la salida (de izquierda a derecha) y, al terminar, cierra el `<dialog>`. */
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
      this._stopBoundaryTracking();
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

  /** Mide `getBoundary()` y lo vuelca a variables CSS que usa `[contained]`. */
  _syncContainedRect() {
    if (typeof this.getBoundary !== 'function') return;
    const boundary = this.getBoundary();
    if (!boundary) return;
    const rect = boundary.getBoundingClientRect();
    // Se recorta contra el viewport REAL: un dispositivo simulado más alto que
    // la ventana real (ej. "móvil" con ventanas de navegador bajas) no debe
    // producir un contenedor con contenido fuera de lo que se puede ver/alcanzar
    // (`position: fixed` no se desplaza con el scroll de la página, así que
    // nada más allá del borde de la ventana es alcanzable de ningún modo).
    // Con el seguimiento de scroll (`_startBoundaryTracking`), esto se
    // recalcula en cada scroll: dejar de recortar en cuanto el borde real del
    // marco entra en pantalla es automático.
    const top = Math.max(rect.top, 0);
    const left = Math.max(rect.left, 0);
    const width = Math.max(Math.min(rect.right, window.innerWidth) - left, 0);
    const height = Math.max(Math.min(rect.bottom, window.innerHeight) - top, 0);
    this.style.setProperty('--ac-transition-container-contained-top', `${top}px`);
    this.style.setProperty('--ac-transition-container-contained-left', `${left}px`);
    this.style.setProperty('--ac-transition-container-contained-width', `${width}px`);
    this.style.setProperty('--ac-transition-container-contained-height', `${height}px`);
  }

  _startBoundaryTracking() {
    if (typeof this.getBoundary !== 'function') return;
    this._syncContainedRect();
    const boundary = this.getBoundary();
    if (boundary) {
      this._boundaryObserver ??= new ResizeObserver(this._onViewportChange);
      this._boundaryObserver.disconnect();
      this._boundaryObserver.observe(boundary);
    }
    window.addEventListener('resize', this._onViewportChange);
    // El marco de dispositivo es un elemento normal (no top-layer): si la
    // página scrollea, se mueve — y el contenedor, fijo al viewport real, se
    // quedaría atrás si no se recalcula. `capture` porque el scroll no
    // burbujea (hace falta también el de un contenedor interno).
    window.addEventListener('scroll', this._onViewportChange, { passive: true, capture: true });
  }

  _stopBoundaryTracking() {
    this._boundaryObserver?.disconnect();
    window.removeEventListener('resize', this._onViewportChange);
    window.removeEventListener('scroll', this._onViewportChange, { capture: true });
  }

  _onCancel(event) {
    // Esc: se cierra con animación en vez del cierre inmediato del navegador.
    event.preventDefault();
    if (!this.persistent) this._requestClose('escape');
  }

  _onNativeClose() {
    // El navegador cerró el <dialog> por su cuenta (no por `visible = false`).
    if (this.visible) {
      this._closeReason = undefined;
      this._emit('ac-transition-container-close', { reason: 'native' });
      this.visible = false;
    }
  }

  _onBackClick() {
    // La decisión de cerrar (o navegar) es de quien consume el componente —
    // el contenedor nunca se cierra solo al emitir este evento.
    this._emit('ac-transition-container-header-back-icon-click');
  }

  _onMenuClick() {
    // Mismo criterio que la flecha de volver: el componente solo avisa, quien
    // lo consume decide qué hacer (abrir un menú lateral, navegar, etc.).
    this._emit('ac-transition-container-header-menu-icon-click');
  }

  _emit(name, detail = true) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}
