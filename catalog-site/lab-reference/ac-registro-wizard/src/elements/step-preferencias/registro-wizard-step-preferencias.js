import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import '@ac-components/ac-button-basic';
import '@ac-components/ac-checkbox-basic';
import '@ac-components/ac-radio-basic';
import '@ac-components/ac-switch-basic';

import { PLAN_ANUAL, PLAN_MENSUAL, PLAN_RADIO_GROUP_NAME } from '../../utils/constants.js';
import { RegistroWizardStepPreferenciasStyles } from './registro-wizard-step-preferencias.styles.js';

/*
Contenido del paso 2 ("Preferencias") de ac-registro-wizard: términos y condiciones, notificaciones por correo y plan (mensual/anual). Recibe los valores por propiedad y emite un evento por cada cambio -- no guarda estado propio de las preferencias.
@lit @webcomponent @customElement
@fires {{checked: boolean}} registro-wizard-step-preferencias-terminos-change
@fires {{checked: boolean}} registro-wizard-step-preferencias-notificaciones-change
@fires {{value: string}} registro-wizard-step-preferencias-plan-change
@fires {void} registro-wizard-step-preferencias-next-click
*/
export class RegistroWizardStepPreferencias extends ComponentMixin(LitElement) {
  static get is() {
    return 'registro-wizard-step-preferencias';
  }

  static get styles() {
    return [componentBaseStyles, RegistroWizardStepPreferenciasStyles];
  }

  static get properties() {
    return {
      /*
      Si el usuario aceptó los términos y condiciones.
      @type {Boolean}
      @default false
      */
      terminos: { type: Boolean },
      /*
      Si el usuario quiere recibir notificaciones por correo.
      @type {Boolean}
      @default false
      */
      notificaciones: { type: Boolean },
      /*
      Plan elegido: mensual o anual.
      @type {String}
      @default PLAN_MENSUAL
      */
      plan: { type: String },
    };
  }

  constructor() {
    super();
    this.terminos = false;
    this.notificaciones = false;
    this.plan = PLAN_MENSUAL;
  }

  /*
  Traslada el cambio del checkbox de términos como evento propio.
  @private
  @event registro-wizard-step-preferencias-terminos-change
  */
  _onTerminosChange(event) {
    this._emit('registro-wizard-step-preferencias-terminos-change', {
      checked: event.detail.checked,
    });
  }

  /*
  Traslada el cambio del switch de notificaciones como evento propio.
  @private
  @event registro-wizard-step-preferencias-notificaciones-change
  */
  _onNotificacionesChange(event) {
    this._emit('registro-wizard-step-preferencias-notificaciones-change', {
      checked: event.detail.checked,
    });
  }

  /*
  Traslada la elección de plan. Solo emite cuando el radio queda marcado, porque ambos radios del grupo disparan change.
  @private
  @event registro-wizard-step-preferencias-plan-change
  */
  _onPlanChange(event) {
    if (event.detail.checked) {
      this._emit('registro-wizard-step-preferencias-plan-change', { value: event.detail.value });
    }
  }

  /*
  Emite el evento de avance al siguiente paso.
  @private
  @event registro-wizard-step-preferencias-next-click
  */
  _onNextClick() {
    this._emit('registro-wizard-step-preferencias-next-click');
  }

  /*
  Despacha un CustomEvent con el nombre y detalle indicados, burbujeante y compuesto.
  @private
  */
  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  /*
  Renderiza el contenido del paso de preferencias.
  @public
  */
  render() {
    return html`
      <ac-checkbox-basic
        .checked=${this.terminos}
        @ac-checkbox-basic-change=${this._onTerminosChange}
        >${this.t('registro-wizard-terminos-label')}</ac-checkbox-basic
      >
      <ac-switch-basic
        .checked=${this.notificaciones}
        @ac-switch-basic-change=${this._onNotificacionesChange}
        >${this.t('registro-wizard-notificaciones-label')}</ac-switch-basic
      >
      <fieldset class="registro-wizard-step-preferencias__plan">
        <legend>${this.t('registro-wizard-plan-legend')}</legend>
        <ac-radio-basic
          name=${PLAN_RADIO_GROUP_NAME}
          value=${PLAN_MENSUAL}
          .checked=${this.plan === PLAN_MENSUAL}
          @ac-radio-basic-change=${this._onPlanChange}
          >${this.t('registro-wizard-plan-mensual')}</ac-radio-basic
        >
        <ac-radio-basic
          name=${PLAN_RADIO_GROUP_NAME}
          value=${PLAN_ANUAL}
          .checked=${this.plan === PLAN_ANUAL}
          @ac-radio-basic-change=${this._onPlanChange}
          >${this.t('registro-wizard-plan-anual')}</ac-radio-basic
        >
      </fieldset>
      <div class="registro-wizard-step-preferencias__actions">
        <ac-button-basic ambient="primary" @ac-button-basic-click=${this._onNextClick}
          >${this.t('registro-wizard-next')}</ac-button-basic
        >
      </div>
    `;
  }
}
