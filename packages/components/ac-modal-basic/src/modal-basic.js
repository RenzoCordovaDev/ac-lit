import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
import { createFocusTrap } from '@ac-base/ac-core/utils';
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
// Entrada/salida del panel en el camino `contained` (Web Animations API, no
// CSS — ver el comentario junto a `.ac-modal-basic__panel` en
// modal-basic.styles.scss).
const PANEL_OPEN_DURATION_MS = 300;
const PANEL_OPEN_EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const PANEL_CLOSE_DURATION_MS = 240;
const PANEL_CLOSE_EASING = 'ease-in';

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
      contained: { type: Boolean, reflect: true },
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
    // `contained`: en vez de la capa superior nativa (`showModal()`, que
    // SIEMPRE bloquea toda la página real e ignora cualquier ancestro para
    // medirse — ver "Superposiciones" en CONVENTIONS.md), el modal se abre
    // con `dialog.show()` (no modal), así el resto de la página real sigue
    // interactivo. `position: fixed`/`absolute` tampoco resuelve contra un
    // ancestro a través del límite de shadow DOM (probado empíricamente), así
    // que igual hace falta medir el área del dispositivo simulado por JS vía
    // `getBoundary()`, exactamente como antes. El foco atrapado/Escape/click-
    // afuera que da `showModal()` gratis se reimplementan a mano para este
    // camino.
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
    this._onContainedOutsideClick = this._onContainedOutsideClick.bind(this);
  }

  disconnectedCallback() {
    clearTimeout(this._closeTimer);
    this._deactivateContained();
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
      if (!dialog.open) {
        if (this.contained) {
          dialog.show();
          this._startBoundaryTracking();
          this._animateContainedOpen(dialog);
          this._focusTrap = createFocusTrap(dialog);
          this._focusTrap.activate();
          dialog.addEventListener('keydown', this._onContainedKeydown);
          document.addEventListener('click', this._onContainedOutsideClick, true);
        } else {
          dialog.showModal();
        }
      }
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

  /** Mide un valor seguro (en px) para el recorrido del panel: su propia
   * altura si ya está resuelta o, si no, la ventana entera — de sobra para
   * que arranque/termine fuera del área visible del `<dialog>` `[contained]`,
   * que lo recorta con `overflow: hidden`. */
  _panelTravelPx(panel) {
    return panel.getBoundingClientRect().height || window.innerHeight;
  }

  /** Entrada del panel en el camino `contained`: Web Animations API con un
   * `translateY` en píxeles — ver el porqué junto a `.ac-modal-basic__panel`
   * en modal-basic.styles.scss. */
  _animateContainedOpen(dialog) {
    const panel = dialog.querySelector('.ac-modal-basic__panel');
    if (!panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const distance = this._panelTravelPx(panel);
    panel.animate([{ transform: `translateY(${distance}px)` }, { transform: 'translateY(0)' }], {
      duration: PANEL_OPEN_DURATION_MS,
      easing: PANEL_OPEN_EASING,
    });
  }

  /** Salida del panel en el camino `contained`, con el mismo tope por
   * timeout que el camino no contenido por si `finished` no llega. */
  _animateContainedClose(dialog, finish) {
    this._closingAnimation?.cancel();
    this._closingAnimation = null;
    const panel = dialog.querySelector('.ac-modal-basic__panel');
    if (!panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    const distance = this._panelTravelPx(panel);
    const animation = panel.animate(
      [{ transform: 'translateY(0)' }, { transform: `translateY(${distance}px)` }],
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
    // producir un modal con contenido fuera de lo que se puede ver/alcanzar
    // (`position: fixed` no se desplaza con el scroll de la página, así que
    // nada más allá del borde de la ventana es alcanzable de ningún modo).
    // Con el seguimiento de scroll (`_startBoundaryTracking`), esto se
    // recalcula en cada scroll: dejar de recortar en cuanto el borde real del
    // marco entra en pantalla es automático.
    const top = Math.max(rect.top, 0);
    const left = Math.max(rect.left, 0);
    const width = Math.max(Math.min(rect.right, window.innerWidth) - left, 0);
    const height = Math.max(Math.min(rect.bottom, window.innerHeight) - top, 0);
    this.style.setProperty('--ac-modal-basic-contained-top', `${top}px`);
    this.style.setProperty('--ac-modal-basic-contained-left', `${left}px`);
    this.style.setProperty('--ac-modal-basic-contained-width', `${width}px`);
    this.style.setProperty('--ac-modal-basic-contained-height', `${height}px`);
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
    // página scrollea, se mueve — y el modal, fijo al viewport real, se
    // quedaría atrás si no se recalcula. `capture` porque el scroll no
    // burbujea (hace falta también el de un contenedor interno).
    window.addEventListener('scroll', this._onViewportChange, { passive: true, capture: true });
  }

  _stopBoundaryTracking() {
    this._boundaryObserver?.disconnect();
    window.removeEventListener('resize', this._onViewportChange);
    window.removeEventListener('scroll', this._onViewportChange, { capture: true });
  }

  /** Desactiva el seguimiento del marco, el foco atrapado y los listeners de
   * Escape/backdrop del camino `contained`. */
  _deactivateContained() {
    this._stopBoundaryTracking();
    this._dialog?.removeEventListener('keydown', this._onContainedKeydown);
    document.removeEventListener('click', this._onContainedOutsideClick, true);
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

  /** Equivalente al click en el `::backdrop` nativo, pero para el `<dialog>`
   * no modal del camino `contained`: no tiene `::backdrop`, así que un click
   * dentro del marco simulado pero fuera del propio `<dialog>` se detecta a
   * mano (sin tocar nada fuera del marco — ver "Superposiciones" en
   * CONVENTIONS.md). */
  _onContainedOutsideClick(event) {
    if (this.persistent) return;
    const path = event.composedPath();
    if (path.includes(this._dialog)) return;
    const boundary = typeof this.getBoundary === 'function' ? this.getBoundary() : null;
    if (boundary && path.includes(boundary)) this._requestClose('backdrop');
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
