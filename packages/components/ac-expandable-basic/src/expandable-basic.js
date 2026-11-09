import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in expandable-basic.styles.scss, compiled to expandable-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { ExpandableBasicStyles } from './expandable-basic.styles.js';

// Cada instancia vive en su propio shadow root, así que el navegador no puede
// coordinar "solo un panel abierto a la vez" entre instancias. Este registro
// (mismo patrón que `ac-radio-basic`) cierra a las demás del mismo `group` cuando
// una se abre. Ver "Componentes con estado compartido" en docs/CONVENTIONS.md.
const groups = new Map();

function registerInGroup(group, instance) {
  if (!group) return;
  if (!groups.has(group)) {
    groups.set(group, new Set());
  }
  groups.get(group).add(instance);
}

function unregisterFromGroup(group, instance) {
  groups.get(group)?.delete(instance);
}

function closeOthersInGroup(group, openInstance) {
  for (const instance of groups.get(group) ?? []) {
    if (instance !== openInstance && instance.open) {
      instance.open = false;
    }
  }
}

const CHEVRON_ICON = html`<svg
  class="ac-expandable-basic__chevron"
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
  <path d="M6 9l6 6 6-6" />
</svg>`;

export class ExpandableBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-expandable-basic';
  }

  static get styles() {
    return [ExpandableBasicStyles];
  }

  static get properties() {
    return {
      header: { type: String },
      open: { type: Boolean, reflect: true },
      group: { type: String },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.header = '';
    this.open = false;
    this.group = '';
    this.disabled = false;
    this.ambient = 'primary';
  }

  connectedCallback() {
    super.connectedCallback();
    registerInGroup(this.group, this);
  }

  disconnectedCallback() {
    unregisterFromGroup(this.group, this);
    super.disconnectedCallback();
  }

  willUpdate(changed) {
    if (changed.has('group')) {
      unregisterFromGroup(changed.get('group'), this);
      registerInGroup(this.group, this);
    }
  }

  updated(changed) {
    if (!changed.has('open')) return;

    if (this.open && this.group) {
      closeOthersInGroup(this.group, this);
    }

    // `undefined` = primera renderización: el estado inicial no es un cambio.
    if (changed.get('open') !== undefined) {
      this.dispatchEvent(
        new CustomEvent('ac-expandable-basic-toggle', {
          detail: { open: this.open },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  /** Abre el panel. */
  show() {
    this.open = true;
  }

  /** Cierra el panel. */
  hide() {
    this.open = false;
  }

  render() {
    return html`
      <div part="root" class="ac-expandable-basic ac-expandable--${this.ambient}">
        <button
          part="header"
          id="header"
          class="ac-expandable-basic__header"
          type="button"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls="panel"
          ?disabled=${this.disabled}
          @click=${this._onToggle}
        >
          <span class="ac-expandable-basic__title">
            <slot name="header">${this.header ? this.t(this.header) : nothing}</slot>
          </span>
          ${CHEVRON_ICON}
        </button>
        <div
          part="panel"
          id="panel"
          class="ac-expandable-basic__panel"
          role="region"
          aria-labelledby="header"
          ?inert=${!this.open}
        >
          <div class="ac-expandable-basic__clip">
            <div part="content" class="ac-expandable-basic__content">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _onToggle() {
    this.open = !this.open;
  }
}
