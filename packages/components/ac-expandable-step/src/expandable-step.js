import { LitElement, html, nothing } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in expandable-step.styles.scss, compiled to expandable-step.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { ExpandableStepStyles } from './expandable-step.styles.js';

export class ExpandableStep extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-expandable-step';
  }

  static get styles() {
    return [ExpandableStepStyles];
  }

  static get properties() {
    return {
      header: { type: String },
      active: { type: Boolean, reflect: true },
      completed: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      editLabel: { type: String, attribute: 'edit-label' },
      // Asignados normalmente por el padre `ac-expandable-multistep` como propiedad
      // directa, pero funcionan igual seteados a mano — este componente no sabe nada
      // del padre ni de otros steps, solo renderiza según sus propias properties.
      stepNumber: { type: Number, attribute: 'step-number' },
      totalSteps: { type: Number, attribute: 'total-steps' },
    };
  }

  constructor() {
    super();
    this.header = '';
    this.active = false;
    this.completed = false;
    this.disabled = false;
    this.editLabel = '';
    this.stepNumber = 0;
    this.totalSteps = 0;
    this.ambient = 'primary';
  }

  updated(changed) {
    if (!changed.has('completed')) return;
    // `undefined` = primera renderización: el estado inicial no es un cambio.
    if (changed.get('completed') === undefined) return;
    if (this.completed) {
      this._emit('ac-expandable-step-complete');
    }
  }

  /** Atajo: marca el paso como completado y lo colapsa. Dispara `-complete` vía `updated()`. */
  complete() {
    this.completed = true;
    this.active = false;
  }

  /**
   * Atajo: vuelve a mostrar el contenido del paso para editarlo. No dispara ningún
   * evento — el click en "Modificar" es lo que informa intención (`-edit`); esto es
   * la acción resultante que alguien más podría querer invocar programáticamente.
   */
  edit() {
    this.active = true;
    this.completed = false;
  }

  render() {
    // Pendiente (!active && !completed): ni rama se renderiza, y `:host(:not([active]):not([completed]))`
    // ya lo saca del flujo con `display: none` — no hace falta una rama propia acá.
    return this.active ? this._renderActive() : this.completed ? this._renderCollapsed() : nothing;
  }

  _renderCollapsed() {
    return html`
      <div part="root" class="expandable-step expandable-step--${this.ambient}">
        <div part="bar" class="expandable-step__bar">
          <span part="header" class="expandable-step__header">
            ${this.header ? this.t(this.header) : nothing}
          </span>
          ${
            this.disabled
              ? nothing
              : html`
                  <button
                    part="edit"
                    type="button"
                    class="expandable-step__edit"
                    @click=${this._onEditClick}
                  >
                    ${this.t(this.editLabel || 'expandable-step-edit-label')}
                  </button>
                `
          }
        </div>
        <div part="summary" class="expandable-step__summary">
          <slot name="summary"></slot>
        </div>
      </div>
    `;
  }

  _renderActive() {
    return html`
      <div part="root" class="expandable-step expandable-step--active">
        <span part="counter" class="expandable-step__counter">
          ${this.t('expandable-step-counter', { current: this.stepNumber, total: this.totalSteps })}
        </span>
        <div part="header" class="expandable-step__header">
          ${this.header ? this.t(this.header) : nothing}
        </div>
        <div part="content" class="expandable-step__content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  _onEditClick() {
    this._emit('ac-expandable-step-edit');
  }

  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}
