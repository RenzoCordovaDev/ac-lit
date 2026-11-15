import { LitElement, html } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in expandable-multistep.styles.scss, compiled to expandable-multistep.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { ExpandableMultistepStyles } from './expandable-multistep.styles.js';

export class ExpandableMultistep extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-expandable-multistep';
  }

  static get styles() {
    return [ExpandableMultistepStyles];
  }

  static get properties() {
    return {
      // `true` cuando TODOS los `ac-expandable-step` hijos están completados (revela
      // el slot `confirmation`). Toda otra coordinación vive en properties/eventos de
      // los steps hijos — este componente no expone nada de configuración propia.
      completed: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.completed = false;
    // Lista de `ac-expandable-step` hijos actualmente asignados al slot default, en
    // orden. No es reactiva a propósito: solo la usan los handlers de abajo para
    // ubicar `event.target` por `indexOf`, no el render.
    this._steps = [];
    // Solo la primera vez que hay steps asignados decidimos si auto-activar el
    // primero — si el consumidor ya precargó estado (retomando un flujo a medio
    // completar), no lo pisamos.
    this._initialized = false;
    this._onStepComplete = this._onStepComplete.bind(this);
    this._onStepEdit = this._onStepEdit.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('ac-expandable-step-complete', this._onStepComplete);
    this.addEventListener('ac-expandable-step-edit', this._onStepEdit);
  }

  disconnectedCallback() {
    this.removeEventListener('ac-expandable-step-complete', this._onStepComplete);
    this.removeEventListener('ac-expandable-step-edit', this._onStepEdit);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div part="root" class="expandable-multistep">
        <div part="steps" class="expandable-multistep__steps">
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>
        <div
          part="confirmation"
          class="expandable-multistep__confirmation"
          ?hidden=${!this.completed}
        >
          <slot name="confirmation"></slot>
        </div>
      </div>
    `;
  }

  _onSlotChange(event) {
    const steps = event.target
      .assignedElements({ flatten: true })
      .filter(el => el.localName === 'ac-expandable-step');

    // Re-numerar siempre, de forma idempotente, por si se agregan/quitan steps
    // dinámicamente — nunca asume que el orden/cantidad es estable entre llamadas.
    steps.forEach((step, index) => {
      step.stepNumber = index + 1;
      step.totalSteps = steps.length;
    });

    this._steps = steps;

    if (this._initialized || steps.length === 0) return;
    this._initialized = true;

    const hasPreloadedState = steps.some(step => step.active || step.completed);
    if (hasPreloadedState) return;

    steps[0].active = true;
    this._emitActiveStepChange(steps[0]);
  }

  _onStepComplete(event) {
    const step = event.target;
    const index = this._steps.indexOf(step);
    if (index === -1) return;

    // No se valida que `step` sea el actualmente `active` — se avanza según su
    // posición en el array (diseño simple, sin forzar un wizard estricto).
    if (index === this._steps.length - 1) {
      this._onAllComplete();
      return;
    }

    const next = this._steps[index + 1];
    next.active = true;
    this._emitActiveStepChange(next);
  }

  _onStepEdit(event) {
    const step = event.target;
    const index = this._steps.indexOf(step);
    if (index === -1) return;

    step.edit();

    // Todos los steps posteriores vuelven a pendiente — ya no son válidos si se
    // está reeditando uno anterior.
    for (let i = index + 1; i < this._steps.length; i += 1) {
      this._steps[i].completed = false;
      this._steps[i].active = false;
    }

    if (this.completed) this.completed = false;

    this._emitActiveStepChange(step);
  }

  _onAllComplete() {
    this.completed = true;
    this._emit('ac-expandable-multistep-all-complete');
  }

  // `ac-expandable-multistep-active-step-change` es una EXCEPCIÓN deliberada al
  // patrón `-toggle` del resto del catálogo (ver "Superposiciones y navegación" en
  // docs/CONVENTIONS.md): ese patrón no se emite en la primera renderización porque
  // el estado inicial no es un "cambio". Acá sí se emite también en la
  // auto-activación inicial del primer step, porque el propósito del evento es
  // puramente informativo ("cuál step está activo ahora mismo", útil para que el
  // consumidor haga scroll-into-view o resalte una navegación externa) y no una
  // señal de "algo cambió por acción del usuario".
  _emitActiveStepChange(step) {
    this._emit('ac-expandable-multistep-active-step-change', {
      stepNumber: step.stepNumber,
      totalSteps: this._steps.length,
    });
  }

  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}
