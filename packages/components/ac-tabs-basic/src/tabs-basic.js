import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in tabs-basic.styles.scss, compiled to tabs-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { TabsBasicStyles } from './tabs-basic.styles.js';

/** Normaliza una pestaña: un string es `{ id, label }` con el mismo texto. */
function normalizeTab(tab) {
  if (typeof tab === 'string') return { id: tab, label: tab, disabled: false };
  const id = String(tab?.id ?? '');
  return { id, label: String(tab?.label ?? id), disabled: Boolean(tab?.disabled) };
}

export class TabsBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-tabs-basic';
  }

  static get styles() {
    return [TabsBasicStyles];
  }

  static get properties() {
    return {
      tabs: { type: Array },
      selected: { type: String, reflect: true },
      a11yLabel: { type: String, attribute: 'a11y-label' },
    };
  }

  constructor() {
    super();
    this.tabs = [];
    this.selected = '';
    this.a11yLabel = '';
    this.ambient = 'primary';
  }

  get _tabs() {
    return (this.tabs ?? []).map(normalizeTab).filter(tab => tab.id);
  }

  /** Pestaña activa: `selected` si existe y está habilitada; si no, la primera habilitada. */
  get _selectedId() {
    const tabs = this._tabs;
    const match = tabs.find(tab => tab.id === this.selected && !tab.disabled);
    return (match ?? tabs.find(tab => !tab.disabled))?.id ?? '';
  }

  /** Lleva el foco a la pestaña activa. */
  focus(options) {
    this.renderRoot.querySelector('[role="tab"][aria-selected="true"]')?.focus(options);
  }

  render() {
    const selectedId = this._selectedId;
    const tabs = this._tabs;

    return html`
      <div part="root" class="ac-tabs-basic ac-tabs--${this.ambient}">
        <div
          part="tablist"
          class="ac-tabs-basic__list"
          role="tablist"
          aria-label=${this.a11yLabel ? this.t(this.a11yLabel) : nothing}
          @keydown=${this._onKeydown}
        >
          ${tabs.map(
            tab => html`
              <button
                part="tab"
                id=${`tab-${tab.id}`}
                class="ac-tabs-basic__tab"
                type="button"
                role="tab"
                data-id=${tab.id}
                aria-selected=${tab.id === selectedId ? 'true' : 'false'}
                aria-controls=${`panel-${tab.id}`}
                tabindex=${tab.id === selectedId ? '0' : '-1'}
                ?disabled=${tab.disabled}
                @click=${() => this._select(tab.id)}
              >
                ${this.t(tab.label)}
              </button>
            `,
          )}
        </div>
        ${tabs.map(
          tab => html`
            <div
              part="panel"
              id=${`panel-${tab.id}`}
              class="ac-tabs-basic__panel"
              role="tabpanel"
              aria-labelledby=${`tab-${tab.id}`}
              tabindex="0"
              ?hidden=${tab.id !== selectedId}
            >
              <slot name=${tab.id}></slot>
            </div>
          `,
        )}
      </div>
    `;
  }

  _select(id) {
    if (id === this._selectedId) return;

    this.selected = id;
    this.dispatchEvent(
      new CustomEvent('ac-tabs-basic-change', {
        detail: { id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Teclado del patrón WAI-ARIA Tabs: flechas (con vuelta), Home y End; activación automática. */
  _onKeydown(event) {
    const enabled = this._tabs.filter(tab => !tab.disabled);
    const currentId = event.target.dataset?.id;
    const index = enabled.findIndex(tab => tab.id === currentId);
    if (index < 0) return;

    const last = enabled.length - 1;
    const targets = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in targets)) return;

    event.preventDefault();
    const next = enabled[targets[event.key]];
    this._select(next.id);
    this.updateComplete.then(() =>
      this.renderRoot.querySelector(`[role="tab"][data-id="${next.id}"]`)?.focus(),
    );
  }
}
