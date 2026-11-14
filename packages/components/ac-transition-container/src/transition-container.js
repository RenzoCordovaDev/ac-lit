import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
import { createFocusTrap } from '@ac-base/ac-core/utils';
// Authored in transition-container.styles.scss, compiled to transition-container.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { TransitionContainerStyles } from './transition-container.styles.js';

// Si `animationend` no llega (pestaña en segundo plano, etc.), el cierre no puede
// quedarse colgado: este tope fuerza `dialog.close()`.
const CLOSE_FALLBACK_MS = 600;
const CLOSING_CLASS = 'ac-transition-container--closing';
// Entrada/salida del panel en el camino `contained` (Web Animations API, no
// CSS — ver el comentario junto a `[contained] .ac-transition-container` en
// transition-container.styles.scss).
const PANEL_OPEN_DURATION_MS = 300;
const PANEL_OPEN_EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const PANEL_CLOSE_DURATION_MS = 240;
const PANEL_CLOSE_EASING = 'ease-in';

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
      hideBackIcon: { type: Boolean, attribute: 'hide-back-icon', reflect: true },
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
    this.hideBackIcon = false;
    this.hideMenuIcon = false;
    this.persistent = false;
    this.ambient = 'primary';
    // `contained`: en vez de la capa superior nativa (`showModal()`, que
    // SIEMPRE bloquea toda la página real e ignora cualquier ancestro para
    // medirse — ver "Superposiciones" en CONVENTIONS.md), el contenedor se
    // abre con `dialog.show()` (no modal), así el resto de la página real
    // sigue interactivo. La posición/tamaño del marco simulado se miden por
    // JS (`getBoundary()`/`_syncContainedRect()`, variables CSS) porque
    // `position: fixed` tampoco resuelve contra un ancestro a través del
    // límite de shadow DOM. El foco atrapado/Escape que da `showModal()`
    // gratis se reimplementan a mano para este camino.
    this.contained = false;
    this.getBoundary = null;
    this._focusTrap = null;
    this._closingAnimation = null;
    this._closeReason = undefined;
    this._closeToken = 0;
    this._closeTimer = undefined;
    this._boundaryObserver = undefined;
    this._onViewportChange = this._syncContainedRect.bind(this);
    this._onContainedKeydown = this._onContainedKeydown.bind(this);
  }

  willUpdate(changed) {
    if (changed.has('headerType') && !HEADER_TYPES.includes(this.headerType)) {
      this.headerType = DEFAULT_HEADER_TYPE;
    }
  }

  disconnectedCallback() {
    clearTimeout(this._closeTimer);
    this._deactivateContained();
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

  updated(changed) {
    if (!changed.has('visible')) return;

    const dialog = this._dialog;
    const previous = changed.get('visible');

    if (this.visible) {
      this._cancelPendingClose();
      if (!dialog.open) {
        if (this.contained) {
          dialog.show();
          this._startBoundaryTracking();
          this._animateContainedOpen(dialog);
          this._focusTrap = createFocusTrap(dialog);
          this._focusTrap.activate();
          dialog.addEventListener('keydown', this._onContainedKeydown);
        } else {
          dialog.showModal();
        }
      }
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
                this.hideBackIcon
                  ? nothing
                  : html`<button
                      part="back"
                      class="ac-transition-container__back"
                      type="button"
                      aria-label=${this.t('transition-container-back')}
                      @click=${this._onBackClick}
                    >
                      ${BACK_ICON}
                    </button>`
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

    const finish = () => {
      if (token !== this._closeToken) return;
      clearTimeout(this._closeTimer);
      dialog.classList.remove(CLOSING_CLASS);
      if (dialog.open) dialog.close();
      this._deactivateContained();
    };

    if (this.contained) {
      this._animateContainedClose(dialog, finish);
      return;
    }

    dialog.classList.add(CLOSING_CLASS);
    const onEnd = event => {
      if (event.target === dialog) finish();
    };
    // Sin animación (prefers-reduced-motion) `animationend` nunca llega: se cierra ya.
    if (!parseFloat(getComputedStyle(dialog).animationDuration)) {
      finish();
      return;
    }

    dialog.addEventListener('animationend', onEnd);
    this._closeTimer = setTimeout(finish, CLOSE_FALLBACK_MS);
  }

  /** Mide un valor seguro (en px) para el recorrido del panel: su propio
   * ancho si ya está resuelto o, si no, la ventana entera — de sobra para
   * que arranque/termine fuera del área visible del `<dialog>` `[contained]`,
   * que lo recorta con `overflow: hidden`. */
  _panelTravelPx(panel) {
    return panel.getBoundingClientRect().width || window.innerWidth;
  }

  /** Entrada del panel en el camino `contained`: Web Animations API con un
   * `translateX` en píxeles — ver el porqué junto a `[contained]
   * .ac-transition-container` en transition-container.styles.scss. */
  _animateContainedOpen(dialog) {
    const panel = dialog.querySelector('.ac-transition-container__panel');
    if (!panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const distance = this._panelTravelPx(panel);
    panel.animate([{ transform: `translateX(${distance}px)` }, { transform: 'translateX(0)' }], {
      duration: PANEL_OPEN_DURATION_MS,
      easing: PANEL_OPEN_EASING,
    });
  }

  /** Salida del panel en el camino `contained`, con el mismo tope por
   * timeout que el camino no contenido por si `finished` no llega. */
  _animateContainedClose(dialog, finish) {
    this._closingAnimation?.cancel();
    this._closingAnimation = null;
    const panel = dialog.querySelector('.ac-transition-container__panel');
    if (!panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    const distance = this._panelTravelPx(panel);
    const animation = panel.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${distance}px)` }],
      { duration: PANEL_CLOSE_DURATION_MS, easing: PANEL_CLOSE_EASING, fill: 'forwards' },
    );
    this._closingAnimation = animation;
    animation.finished.then(finish).catch(() => {});
    this._closeTimer = setTimeout(finish, CLOSE_FALLBACK_MS);
  }

  _cancelPendingClose() {
    this._closeToken += 1;
    clearTimeout(this._closeTimer);
    this._dialog?.classList.remove(CLOSING_CLASS);
    this._closingAnimation?.cancel();
    this._closingAnimation = null;
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

  /** Desactiva el seguimiento del marco, el foco atrapado y el listener de
   * Escape del camino `contained`. */
  _deactivateContained() {
    this._stopBoundaryTracking();
    this._dialog?.removeEventListener('keydown', this._onContainedKeydown);
    this._focusTrap?.deactivate();
    this._focusTrap = null;
  }

  _onCancel(event) {
    // Esc en el <dialog> MODAL (showModal()): se cierra con animación en vez
    // del cierre inmediato del navegador. El camino `contained` (no modal) no
    // dispara `cancel` — lo resuelve `_onContainedKeydown`.
    event.preventDefault();
    if (!this.persistent) this._requestClose('escape');
  }

  _onContainedKeydown(event) {
    if (event.key !== 'Escape') return;
    event.stopPropagation();
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
