import { LitElement, html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
import { SearchInputBasicStyles } from './search-input-basic.styles.js';

export class SearchInputBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-search-input-basic';
  }

  static get styles() {
    return [componentBaseStyles, SearchInputBasicStyles];
  }

  static get properties() {
    return {
      label: { type: String },
      a11yLabel: { type: String, attribute: 'a11y-label' },
      value: { type: String },
      name: { type: String },
      placeholder: { type: String },
      disabled: { type: Boolean, reflect: true },
      debounce: { type: Number },
    };
  }

  constructor() {
    super();
    this.label = '';
    this.a11yLabel = '';
    this.value = '';
    this.name = '';
    this.placeholder = '';
    this.disabled = false;
    this.debounce = 300;
    this.ambient = 'primary';
    this._searchTimer = undefined;
  }

  disconnectedCallback() {
    this._cancelSearch();
    super.disconnectedCallback();
  }

  willUpdate(changed) {
    super.willUpdate(changed);
    if (changed.has('disabled') && this.disabled) {
      this._cancelSearch();
    }
  }

  /** Lleva el foco al campo interno. */
  focus(options) {
    this.renderRoot?.querySelector('input')?.focus(options);
  }

  render() {
    return html`
      <div part="root" class="ac-search-input-basic">
        ${
          this.label
            ? html`<label part="label" class="ac-search-input-basic__label" for="field">
                ${this.t(this.label)}
              </label>`
            : nothing
        }
        <div class="ac-search-input-basic__field-wrapper">
          <svg
            class="ac-search-input-basic__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.1 15.1 4.4 4.4" />
          </svg>
          <input
            part="input"
            id="field"
            class="ac-search-input-basic__field"
            type="search"
            name=${this.name}
            .value=${live(this.value ?? '')}
            placeholder=${this.placeholder ? this.t(this.placeholder) : nothing}
            aria-label=${this.label ? nothing : this.t(this.a11yLabel || 'search-input-basic-label')}
            ?disabled=${this.disabled}
            @input=${this._onInput}
            @keydown=${this._onKeyDown}
          />
          ${
            this.value
              ? html`<button
                  part="clear-button"
                  class="ac-search-input-basic__clear"
                  type="button"
                  aria-label=${this.t('search-input-basic-clear-label')}
                  ?disabled=${this.disabled}
                  @click=${this._onClear}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    aria-hidden="true"
                  >
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>`
              : nothing
          }
        </div>
      </div>
    `;
  }

  _onInput(event) {
    if (this.disabled) return;

    const { value } = event.currentTarget;
    this.value = value;
    this._cancelSearch();
    this._searchTimer = setTimeout(() => {
      this._searchTimer = undefined;
      if (!this.disabled && this.value === value) {
        this._emit('search', { value });
      }
    }, this.debounce);
    this._emit('input', { value });
  }

  _onKeyDown(event) {
    if (event.key !== 'Enter' || event.isComposing || this.disabled) return;

    this._cancelSearch();
    this._emit('search', { value: event.currentTarget.value });
  }

  _onClear() {
    if (this.disabled || !this.value) return;

    this._cancelSearch();
    const value = '';
    this.value = value;
    const input = this.renderRoot.querySelector('input');
    input.value = value;
    input.focus();
    this._emit('input', { value });
    this._emit('search', { value });
    this._emit('clear', {});
  }

  _cancelSearch() {
    clearTimeout(this._searchTimer);
    this._searchTimer = undefined;
  }

  _emit(action, detail) {
    this.dispatchEvent(
      new CustomEvent(`${SearchInputBasic.is}-${action}`, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }
}
