import { LitElement, html, nothing } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
import '@ac-components/ac-carousel-slide-basic';

import { CarouselBasicStyles } from './carousel-basic.styles.js';

const SWIPE_THRESHOLD = 40;
const CHANGE_EVENT = 'ac-carousel-basic-change';

export class CarouselBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-carousel-basic';
  }

  static get styles() {
    return [componentBaseStyles, CarouselBasicStyles];
  }

  static get properties() {
    return {
      activeIndex: { type: Number, attribute: 'active-index', reflect: true },
      autoplay: { type: Number },
      _slides: { state: true },
      _rotationPaused: { state: true },
      _announcement: { state: true },
    };
  }

  constructor() {
    super();
    this.activeIndex = 0;
    this.autoplay = 0;
    this.ambient = 'primary';
    this._slides = [];
    this._rotationPaused = false;
    this._hovered = false;
    this._announcement = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._syncAutoplay();
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    this._hovered = false;
    this._gesture = undefined;
    super.disconnectedCallback();
  }

  willUpdate(changed) {
    if (!changed.has('activeIndex') && !changed.has('_slides')) return;

    const index = Number.isInteger(this.activeIndex) ? Math.max(0, this.activeIndex) : 0;
    this.activeIndex = this._slides.length ? Math.min(index, this._slides.length - 1) : index;
    this._slides.forEach((slide, position) => {
      slide.active = position === this.activeIndex;
    });
  }

  updated(changed) {
    if (changed.has('autoplay') || changed.has('_slides') || changed.has('_rotationPaused')) {
      this._syncAutoplay();
    }

    const navigationIndex = this._navigationIndex;
    this._navigationIndex = undefined;
    const previous = changed.get('activeIndex');

    if (
      previous !== undefined &&
      previous !== this.activeIndex &&
      navigationIndex === this.activeIndex
    ) {
      this.dispatchEvent(
        new CustomEvent(CHANGE_EVENT, {
          bubbles: true,
          composed: true,
          detail: { index: this.activeIndex },
        }),
      );
    }
  }

  render() {
    return html`
      <div
        part="root"
        class="carousel-basic"
        role="region"
        aria-roledescription="carousel"
        aria-label=${this.t('carousel-basic-region-label')}
        tabindex="0"
        @keydown=${this._onKeyDown}
        @pointerenter=${this._onPointerEnter}
        @pointerleave=${this._onPointerLeave}
        @focusin=${this._syncAutoplay}
        @focusout=${this._onFocusOut}
      >
        <div
          part="viewport"
          class="carousel-basic__viewport"
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerCancel}
        >
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>
        ${this._slides.length > 1 ? this._renderControls() : nothing}
        <span class="carousel-basic__status" role="status">
          ${
            this._announcement
              ? this.t('carousel-basic-position-label', {
                  current: this.activeIndex + 1,
                  total: this._slides.length,
                })
              : nothing
          }
        </span>
      </div>
    `;
  }

  _renderControls() {
    return html`
      <div part="controls" class="carousel-basic__controls">
        ${
          this._autoplayEnabled
            ? html`
                <button
                  part="rotation"
                  class="carousel-basic__control"
                  type="button"
                  aria-label=${this.t(
                    this._rotationPaused
                      ? 'carousel-basic-play-label'
                      : 'carousel-basic-pause-label',
                  )}
                  @click=${() => {
                    this._rotationPaused = !this._rotationPaused;
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      d=${this._rotationPaused ? 'M8 5v14l11-7z' : 'M7 5h3v14H7zm7 0h3v14h-3z'}
                    />
                  </svg>
                </button>
              `
            : nothing
        }
        <button
          part="previous"
          class="carousel-basic__control"
          type="button"
          aria-label=${this.t('carousel-basic-previous-label')}
          @click=${() => this._step(-1)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path
              d="m15 5-7 7 7 7"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div
          part="pagination"
          class="carousel-basic__pagination"
          role="group"
          aria-label=${this.t('carousel-basic-pagination-label')}
        >
          ${this._slides.map(
            (_, index) => html`
              <button
                part="dot"
                class="carousel-basic__dot"
                type="button"
                aria-current=${index === this.activeIndex ? 'true' : nothing}
                aria-label=${this.t('carousel-basic-go-to-label', { current: index + 1 })}
                @click=${() => this._selectSlide(index)}
              ></button>
            `,
          )}
        </div>
        <button
          part="next"
          class="carousel-basic__control"
          type="button"
          aria-label=${this.t('carousel-basic-next-label')}
          @click=${() => this._step(1)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path
              d="m9 5 7 7-7 7"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    `;
  }

  _onSlotChange(event) {
    if (event.target !== event.currentTarget) return;

    const slides = event.currentTarget
      .assignedElements({ flatten: true })
      .filter(slide => slide.localName === 'ac-carousel-slide-basic');

    slides.forEach((slide, index) => {
      slide.index = index;
      slide.total = slides.length;
    });

    if (this._slides.length && !slides.length) this.activeIndex = 0;
    this._slides = slides;
  }

  _step(direction, automatic = false) {
    const count = this._slides.length;
    if (count < 2) return;
    this._selectSlide((this.activeIndex + direction + count) % count, automatic);
  }

  _selectSlide(index, automatic = false) {
    if (index === this.activeIndex) return;

    if (this._slides[this.activeIndex]?.matches(':focus-within')) {
      this.renderRoot.querySelector('[part="root"]').focus({ preventScroll: true });
    }
    this._announcement = !automatic;
    this._navigationIndex = index;
    this.activeIndex = index;
  }

  _onKeyDown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (this._slides.length < 2) return;
    if (
      event
        .composedPath()
        .some(
          node =>
            node.isContentEditable || node.matches?.('input, textarea, select, [role="slider"]'),
        )
    )
      return;

    event.preventDefault();
    this._step(event.key === 'ArrowLeft' ? -1 : 1);
  }

  _onPointerDown(event) {
    if (event.pointerType !== 'touch' || !event.isPrimary || this._slides.length < 2) return;
    if (event.composedPath().find(node => node.localName === CarouselBasic.is) !== this) return;
    this._gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, captured: false };
  }

  _swipeDirection(event) {
    const dx = event.clientX - this._gesture.x;
    const dy = event.clientY - this._gesture.y;
    return Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) ? -Math.sign(dx) : 0;
  }

  _onPointerMove(event) {
    if (this._gesture?.id !== event.pointerId || this._gesture.captured) return;
    if (!this._swipeDirection(event)) return;

    // Once the touch becomes a horizontal drag, route its release away from links in the slide.
    if (event.isTrusted) event.currentTarget.setPointerCapture(event.pointerId);
    this._gesture.captured = true;
  }

  _onPointerUp(event) {
    if (this._gesture?.id !== event.pointerId) return;
    const direction = this._swipeDirection(event);
    this._gesture = undefined;
    if (direction) this._step(direction);
  }

  _onPointerCancel(event) {
    if (this._gesture?.id === event.pointerId) this._gesture = undefined;
  }

  get _autoplayEnabled() {
    return Number.isFinite(this.autoplay) && this.autoplay > 0;
  }

  _syncAutoplay() {
    clearInterval(this._timer);
    if (
      !this.isConnected ||
      !this._autoplayEnabled ||
      this._rotationPaused ||
      this._slides.length < 2 ||
      this._hovered ||
      this.matches(':focus-within')
    )
      return;

    this._timer = setInterval(() => {
      if (this.getClientRects().length) this._step(1, true);
    }, this.autoplay);
  }

  _onPointerEnter() {
    this._hovered = true;
    this._syncAutoplay();
  }

  _onPointerLeave() {
    this._hovered = false;
    this._syncAutoplay();
  }

  _onFocusOut() {
    // Wait until focus settles, including moves between shadow DOM and slotted content.
    queueMicrotask(() => this._syncAutoplay());
  }
}
