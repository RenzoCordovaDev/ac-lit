import { LitElement, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import '@ac-components/ac-expandable-multistep';
import '@ac-components/ac-expandable-step';

import '../step-datos/registro-wizard-step-datos.js';
import '../step-preferencias/registro-wizard-step-preferencias.js';
import '../step-resumen/registro-wizard-step-resumen.js';
import { PLAN_MENSUAL } from '../../utils/constants.js';
import { RegistroWizardStepsStyles } from './registro-wizard-steps.styles.js';

/**
 * Coordina el ac-expandable-multistep y sus 3 ac-expandable-step del wizard de registro, pasándoles el contenido real (registro-wizard-step-datos/-preferencias/-resumen). Valida el paso 1 antes de avanzar y reemite los cambios de campos como eventos propios -- el estado canónico de los datos del formulario sigue viviendo en ac-registro-wizard, este componente solo lo recibe por propiedad.
 * @lit @webcomponent @customElement
 * @fires {{value: string}} registro-wizard-steps-nombre-change
 * @fires {{value: string}} registro-wizard-steps-email-change
 * @fires {{value: string}} registro-wizard-steps-rol-change
 * @fires {{checked: boolean}} registro-wizard-steps-terminos-change
 * @fires {{checked: boolean}} registro-wizard-steps-notificaciones-change
 * @fires {{value: string}} registro-wizard-steps-plan-change
 * @fires {void} registro-wizard-steps-confirm-click
 * @fires {{step: number, totalSteps: number}} registro-wizard-steps-step-change
 */
export class RegistroWizardSteps extends ComponentMixin(LitElement) {
  static get is() {
    return 'registro-wizard-steps';
  }

  static get properties() {
    return {
      /**
       * Nombre completo ya ingresado, recibido desde ac-registro-wizard.
       * @type {String}
       * @default ''
       */
      nombre: { type: String },
      /**
       * Correo electrónico ya ingresado, recibido desde ac-registro-wizard.
       * @type {String}
       * @default ''
       */
      email: { type: String },
      /**
       * Rol seleccionado, recibido desde ac-registro-wizard.
       * @type {String}
       * @default ''
       */
      rol: { type: String },
      /**
       * Nombre de la persona para el saludo de bienvenida del paso 1.
       * @type {String}
       * @default ''
       */
      welcomeName: { type: String, attribute: 'welcome-name' },
      /**
       * Si se aceptaron los términos y condiciones.
       * @type {Boolean}
       * @default false
       */
      terminos: { type: Boolean },
      /**
       * Si se activaron las notificaciones por correo.
       * @type {Boolean}
       * @default false
       */
      notificaciones: { type: Boolean },
      /**
       * Plan elegido: mensual o anual.
       * @type {String}
       * @default PLAN_MENSUAL
       */
      plan: { type: String },
      /**
       * Si la llamada de guardado está en curso (muestra el spinner en el paso 3).
       * @type {Boolean}
       * @default false
       */
      loading: { type: Boolean },
      /**
       * Mensaje de error de validación del paso 1 (nombre/correo vacíos). Estado interno, no viene del padre.
       * @type {String}
       * @default ''
       * @private
       */
      _nombreError: { state: true },
    };
  }

  constructor() {
    super();
    this.nombre = '';
    this.email = '';
    this.rol = '';
    this.welcomeName = '';
    this.terminos = false;
    this.notificaciones = false;
    this.plan = PLAN_MENSUAL;
    this.loading = false;
    this._nombreError = '';
    this._step1Ref = createRef();
    this._step2Ref = createRef();
    this._step3Ref = createRef();
  }

  reset() {
    this._nombreError = '';
    if (this._step1Ref.value) {
      this._step1Ref.value.completed = false;
      this._step1Ref.value.active = true;
    }
    if (this._step2Ref.value) {
      this._step2Ref.value.completed = false;
      this._step2Ref.value.active = false;
    }
    if (this._step3Ref.value) {
      this._step3Ref.value.completed = false;
      this._step3Ref.value.active = false;
    }
  }

  /**
   * Limpia el error de validación pendiente y reemite el nombre como evento propio.
   * @private
   * @event registro-wizard-steps-nombre-change
   */
  _onNombreInput(event) {
    if (this._nombreError) this._nombreError = '';
    this._emit('registro-wizard-steps-nombre-change', { value: event.detail.value });
  }

  /**
   * Reemite el correo como evento propio.
   * @private
   * @event registro-wizard-steps-email-change
   */
  _onEmailInput(event) {
    this._emit('registro-wizard-steps-email-change', { value: event.detail.value });
  }

  /**
   * Reemite el rol elegido como evento propio.
   * @private
   * @event registro-wizard-steps-rol-change
   */
  _onRolChange(event) {
    this._emit('registro-wizard-steps-rol-change', { value: event.detail.value });
  }

  /**
   * Reemite el cambio de términos y condiciones como evento propio.
   * @private
   * @event registro-wizard-steps-terminos-change
   */
  _onTerminosChange(event) {
    this._emit('registro-wizard-steps-terminos-change', { checked: event.detail.checked });
  }

  /**
   * Reemite el cambio de notificaciones como evento propio.
   * @private
   * @event registro-wizard-steps-notificaciones-change
   */
  _onNotificacionesChange(event) {
    this._emit('registro-wizard-steps-notificaciones-change', { checked: event.detail.checked });
  }

  /**
   * Reemite el plan elegido como evento propio.
   * @private
   * @event registro-wizard-steps-plan-change
   */
  _onPlanChange(event) {
    this._emit('registro-wizard-steps-plan-change', { value: event.detail.value });
  }

  /**
   * Valida nombre/correo antes de avanzar al paso 2; si falta alguno, fija el error de validación y no avanza.
   * @private
   */
  _onStep1NextClick() {
    if (!this.nombre.trim() || !this.email.trim()) {
      this._nombreError = this.t('registro-wizard-nombre-error');
      return;
    }
    this._step1Ref.value?.complete();
  }

  /**
   * Avanza al paso 3 sin validación adicional.
   * @private
   */
  _onStep2NextClick() {
    this._step2Ref.value?.complete();
  }

  /**
   * Reemite el click de "Confirmar" del paso 3 como evento propio -- la validación de términos y la llamada de guardado viven en ac-registro-wizard.
   * @private
   * @event registro-wizard-steps-confirm-click
   */
  _onConfirmClick() {
    this._emit('registro-wizard-steps-confirm-click');
  }

  /**
   * Reemite el cambio de paso activo del multistep como evento propio.
   * @private
   * @event registro-wizard-steps-step-change
   */
  _onMultistepStepChange(event) {
    this._emit('registro-wizard-steps-step-change', {
      step: event.detail.stepNumber,
      totalSteps: event.detail.totalSteps,
    });
  }

  /**
   * Despacha un CustomEvent con el nombre y detalle indicados, con bubbles y composed activos.
   * @private
   */
  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  static get styles() {
    return [componentBaseStyles, RegistroWizardStepsStyles];
  }

  render() {
    return html`
      <ac-expandable-multistep
        @ac-expandable-multistep-active-step-change=${this._onMultistepStepChange}
      >
        <ac-expandable-step
          ${ref(this._step1Ref)}
          header=${this.t('registro-wizard-step1-header')}
          active
        >
          <registro-wizard-step-datos
            .nombre=${this.nombre}
            .email=${this.email}
            .rol=${this.rol}
            .nombreError=${this._nombreError}
            .welcomeName=${this.welcomeName}
            @registro-wizard-step-datos-nombre-input=${this._onNombreInput}
            @registro-wizard-step-datos-email-input=${this._onEmailInput}
            @registro-wizard-step-datos-rol-change=${this._onRolChange}
            @registro-wizard-step-datos-next-click=${this._onStep1NextClick}
          ></registro-wizard-step-datos>
        </ac-expandable-step>

        <ac-expandable-step ${ref(this._step2Ref)} header=${this.t('registro-wizard-step2-header')}>
          <registro-wizard-step-preferencias
            .terminos=${this.terminos}
            .notificaciones=${this.notificaciones}
            .plan=${this.plan}
            @registro-wizard-step-preferencias-terminos-change=${this._onTerminosChange}
            @registro-wizard-step-preferencias-notificaciones-change=${this._onNotificacionesChange}
            @registro-wizard-step-preferencias-plan-change=${this._onPlanChange}
            @registro-wizard-step-preferencias-next-click=${this._onStep2NextClick}
          ></registro-wizard-step-preferencias>
        </ac-expandable-step>

        <ac-expandable-step ${ref(this._step3Ref)} header=${this.t('registro-wizard-step3-header')}>
          <registro-wizard-step-resumen
            .nombre=${this.nombre}
            .email=${this.email}
            .rol=${this.rol}
            .plan=${this.plan}
            .notificaciones=${this.notificaciones}
            .loading=${this.loading}
            @registro-wizard-step-resumen-confirm-click=${this._onConfirmClick}
          ></registro-wizard-step-resumen>
        </ac-expandable-step>
      </ac-expandable-multistep>
    `;
  }
}
