import { LitElement, html, nothing, svg } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
import { ListBasicStyles } from './list-basic.styles.js';

const CHECK_ICON = svg`<path d="m5 12 4 4L19 6" />`;
const CHEVRON_ICON = svg`<path d="m9 6 6 6-6 6" />`;
const ICONS = new Map([
  ['user', svg`<circle cx="12" cy="8" r="3" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" />`],
  ['check', CHECK_ICON],
  ['info', svg`<circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" />`],
]);

function parseItems(value) {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return [];
    }
  }

  return Array.isArray(value) ? value : [];
}

export class ListBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-list-basic';
  }

  static get styles() {
    return [componentBaseStyles, ListBasicStyles];
  }

  static get properties() {
    return {
      items: { type: Array },
      selectable: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.items = [];
    this.selectable = false;
    this.ambient = 'surface';
  }

  render() {
    const ambient = this.ambient === 'plain' ? 'plain' : 'surface';
    const rows = parseItems(this.items).flatMap((item, index) => {
      const hasId = typeof item?.id === 'string' || typeof item?.id === 'number';
      return hasId && typeof item.text === 'string' ? [this._renderItem(item, index)] : [];
    });

    return html`
      <ul part="list" class="ac-list-basic ac-list-basic--${ambient}" role="list">
        ${rows.length ? rows : html`<slot></slot>`}
      </ul>
    `;
  }

  _renderItem(item, index) {
    const disabled = item.disabled === true;
    const selected = item.selected === true;
    const leadingIcon = ICONS.get(item.icon);
    const content = html`
      ${leadingIcon ? this._renderIcon(leadingIcon, 'icon') : nothing}
      <span class="ac-list-basic__content">
        <span part="text" class="ac-list-basic__text">${this.t(item.text)}</span>
        ${
          item.description
            ? html`<span part="description" class="ac-list-basic__description"
                >${this.t(item.description)}</span
              >`
            : nothing
        }
      </span>
    `;

    return html`
      <li
        part="item"
        class="ac-list-basic__item"
        ?data-selected=${selected}
        ?data-disabled=${disabled}
        aria-disabled=${!this.selectable && disabled ? 'true' : nothing}
      >
        ${
          this.selectable
            ? html`
                <button
                  part="button"
                  class="ac-list-basic__row ac-list-basic__button"
                  type="button"
                  aria-pressed=${selected}
                  ?disabled=${disabled}
                  @click=${disabled ? nothing : () => this._activateItem(item.id, index)}
                >
                  ${content} ${this._renderIcon(selected ? CHECK_ICON : CHEVRON_ICON, 'indicator')}
                </button>
              `
            : html`
                <div class="ac-list-basic__row">
                  ${content}
                  ${
                    selected
                      ? html`
                          ${this._renderIcon(CHECK_ICON, 'indicator')}
                          <span class="ac-list-basic__visually-hidden"
                            >${this.t('list-basic-selected')}</span
                          >
                        `
                      : nothing
                  }
                </div>
              `
        }
      </li>
    `;
  }

  _renderIcon(glyph, part) {
    return html`
      <svg
        part=${part}
        class="ac-list-basic__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        ${glyph}
      </svg>
    `;
  }

  _activateItem(id, index) {
    this.dispatchEvent(
      new CustomEvent('ac-list-basic-item-click', {
        detail: { id, index },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
