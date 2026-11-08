import { LitElement, html, css } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';

// Contenido de ejemplo para la demo/tests de este paquete — no se publica.
// ac-demo-content no depende de ningún componente real del catálogo
// (packages/components/*): esos componentes ya dependen de este paquete
// para su propia demo, así que depender también en sentido contrario
// crearía un ciclo de workspaces (pnpm no puede garantizar el orden de
// build entre ambos y el build falla de forma intermitente).
export class DemoSampleButton extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-demo-sample-button';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      button {
        font: inherit;
        padding: 0.6rem 1rem;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        background: var(--color-primary-700, #047857);
        color: var(--color-primary-50, #ecfdf5);
      }

      :host([ambient='secondary']) button {
        background: var(--color-accent-500, #f59e0b);
        color: var(--color-accent-900, #451a03);
      }

      button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
    `;
  }

  static get properties() {
    return {
      disabled: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.ambient = 'primary';
    this.disabled = false;
    this.loading = false;
  }

  render() {
    return html`
      <button ?disabled=${this.disabled || this.loading} @click=${this._onClick}>
        ${this.loading ? 'Cargando…' : html`<slot></slot>`}
      </button>
    `;
  }

  _onClick() {
    if (this.disabled || this.loading) return;
    this.dispatchEvent(new CustomEvent('ac-demo-sample-click', { bubbles: true, composed: true }));
  }
}

customElements.define(DemoSampleButton.is, DemoSampleButton);
