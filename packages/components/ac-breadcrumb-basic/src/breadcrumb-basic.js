import { LitElement, defaultConverter, html, nothing } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
import { BreadcrumbBasicStyles } from './breadcrumb-basic.styles.js';

export class BreadcrumbBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-breadcrumb-basic';
  }

  static get styles() {
    return [componentBaseStyles, BreadcrumbBasicStyles];
  }

  static get properties() {
    return {
      items: { type: Array },
    };
  }

  constructor() {
    super();
    this.items = [];
    this.ambient = 'primary';
  }

  render() {
    // Lit parses the HTML attribute. A string assigned directly also accepts JSON.
    const items =
      typeof this.items === 'string'
        ? defaultConverter.fromAttribute(this.items, Array)
        : this.items;
    if (!Array.isArray(items) || !items.length) return nothing;

    return html`
      <nav part="root" aria-label=${this.t('breadcrumb-basic-navigation')}>
        <ol class="ac-breadcrumb-basic__list" role="list">
          ${items.map((item, index) => this._renderItem(item, index, index === items.length - 1))}
        </ol>
      </nav>
    `;
  }

  _renderItem(item, index, current) {
    const text = this.t(item?.text ?? '');
    const href = item?.href;

    return html`
      <li class="ac-breadcrumb-basic__item">
        ${
          !current && typeof href === 'string'
            ? html`<a
                class="ac-breadcrumb-basic__link"
                href=${href}
                @click=${() => this._onNavigate(index, { text: item.text, href })}
                >${text}</a
              >`
            : html`<span aria-current=${current ? 'page' : nothing}>${text}</span>`
        }
      </li>
    `;
  }

  _onNavigate(index, item) {
    // A native link also fires click on Enter. Its default action stays intact.
    this.dispatchEvent(
      new CustomEvent('ac-breadcrumb-basic-navigate', {
        detail: { index, item },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
