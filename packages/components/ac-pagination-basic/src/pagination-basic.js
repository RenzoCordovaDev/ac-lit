import { LitElement, html, nothing } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import { PaginationBasicStyles } from './pagination-basic.styles.js';

function toInteger(value, fallback) {
  return Number.isFinite(value) ? Math.min(Math.trunc(value), Number.MAX_SAFE_INTEGER) : fallback;
}

function visiblePages(page, totalPages, siblingCount) {
  // Two endpoints, two possible ellipses, and the active page with its siblings.
  if (totalPages <= 2 * siblingCount + 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(2, page - siblingCount);
  const end = Math.min(totalPages - 1, page + siblingCount);
  const pages = [1];

  if (start > 2) pages.push(start === 3 ? 2 : 'previous-gap');
  for (let number = start; number <= end; number++) pages.push(number);
  if (end < totalPages - 1) {
    pages.push(end === totalPages - 2 ? totalPages - 1 : 'next-gap');
  }

  pages.push(totalPages);
  return pages;
}

export class PaginationBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-pagination-basic';
  }

  static get styles() {
    return [componentBaseStyles, PaginationBasicStyles];
  }

  static get properties() {
    return {
      page: { type: Number, reflect: true },
      totalPages: { type: Number, attribute: 'total-pages', reflect: true },
      siblingCount: { type: Number, attribute: 'sibling-count' },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.page = 1;
    this.totalPages = 1;
    this.siblingCount = 1;
    this.disabled = false;
    this.ambient = 'primary';
  }

  willUpdate() {
    this.totalPages = Math.max(1, toInteger(this.totalPages, 1));
    this.page = Math.min(this.totalPages, Math.max(1, toInteger(this.page, 1)));
    this.siblingCount = Math.max(0, toInteger(this.siblingCount, 1));
  }

  render() {
    return html`
      <nav part="root" class="ac-pagination-basic" aria-label=${this.t('pagination-basic-nav')}>
        ${this._renderArrow('previous', this.page === 1)}
        ${repeat(
          visiblePages(this.page, this.totalPages, this.siblingCount),
          item => item,
          item => this._renderPage(item),
        )}
        ${this._renderArrow('next', this.page === this.totalPages)}
      </nav>
    `;
  }

  _renderArrow(direction, atBoundary) {
    const previous = direction === 'previous';
    return html`
      <button
        type="button"
        part=${`${direction}-button`}
        class="ac-pagination-basic__button"
        aria-label=${this.t(`pagination-basic-${direction}-page`)}
        ?disabled=${this.disabled || atBoundary}
        @click=${event => this._selectPage(this.page + (previous ? -1 : 1), event.currentTarget)}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d=${previous ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'}></path>
        </svg>
      </button>
    `;
  }

  _renderPage(number) {
    if (typeof number !== 'number') {
      return html`<span part="ellipsis" class="ac-pagination-basic__ellipsis" aria-hidden="true">
        …
      </span>`;
    }

    return html`
      <button
        type="button"
        part="page-button"
        class="ac-pagination-basic__button"
        data-page=${number}
        aria-label=${this.t('pagination-basic-go-to-page', { page: number })}
        aria-current=${number === this.page ? 'page' : nothing}
        ?disabled=${this.disabled}
        @click=${() => this._selectPage(number)}
      >
        ${number}
      </button>
    `;
  }

  _selectPage(page, arrow) {
    if (this.disabled || page === this.page || page < 1 || page > this.totalPages) return;

    this.page = page;
    if (arrow === this.renderRoot.activeElement && (page === 1 || page === this.totalPages)) {
      // Move focus before the arrow is disabled. Both endpoint buttons are always rendered.
      this.renderRoot.querySelector(`[data-page="${page}"]`).focus();
    }

    this.dispatchEvent(
      new CustomEvent('ac-pagination-basic-page-change', {
        detail: { page },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
