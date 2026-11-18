import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import '@ac-components/ac-avatar-basic';
import '@ac-components/ac-badge-basic';
import '@ac-components/ac-button-basic';
import '@ac-components/ac-divider-basic';
import '@ac-components/ac-spinner-basic';
import '@ac-components/ac-text-basic';

import { ROL_BADGE_LABEL, UNKNOWN_ROL_LABEL } from '../../utils/constants.js';
import { RegistroWizardStepResumenStyles } from './registro-wizard-step-resumen.styles.js';

/**
 * Contenido del paso 3 ("Resumen") de ac-registro-wizard: muestra los datos ya ingresados (nombre, correo, rol, plan, notificaciones) y el botón "Confirmar" que dispara el guardado. No guarda estado propio -- todo lo recibe por propiedad desde el componente padre, que es quien sabe si la llamada de guardado está en curso.
 * @lit @webcomponent @customElement
 * @fires {void} registro-wizard-step-resumen-confirm-click
 */
export class RegistroWizardStepResumen extends ComponentMixin(LitElement) {
  static get is() {
    return 'registro-wizard-step-resumen';
  }

  static get properties() {
    return {
      /**
       * Nombre completo ya ingresado en el paso 1, para mostrar en el avatar y el resumen.
       * @type {String}
       * @default ''
       */
      nombre: { type: String },
      /**
       * Correo electrónico ya ingresado en el paso 1, para mostrar en el resumen.
       * @type {String}
       * @default ''
       */
      email: { type: String },
      /**
       * Rol seleccionado en el paso 2; se traduce a su etiqueta con ROL_BADGE_LABEL.
       * @type {String}
       * @default ''
       */
      rol: { type: String },
      /**
       * Plan elegido en el paso 2, para mostrar en el texto de resumen.
       * @type {String}
       * @default ''
       */
      plan: { type: String },
      /**
       * Indica si las notificaciones fueron activadas, para mostrar en el texto de resumen.
       * @type {Boolean}
       * @default false
       */
      notificaciones: { type: Boolean },
      /**
       * Indica si la llamada de guardado está en curso; reemplaza el botón "Confirmar" por un spinner.
       * @type {Boolean}
       * @default false
       */
      loading: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.nombre = '';
    this.email = '';
    this.rol = '';
    this.plan = '';
    this.notificaciones = false;
    this.loading = false;
  }

  /**
   * Emite el evento de confirmación al hacer clic en el botón "Confirmar".
   * @private
   * @event registro-wizard-step-resumen-confirm-click
   */
  _onConfirmClick() {
    this._emit('registro-wizard-step-resumen-confirm-click');
  }

  /**
   * Despacha un CustomEvent con el nombre y detalle indicados, con bubbles y composed activos.
   * @private
   */
  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  static get styles() {
    return [componentBaseStyles, RegistroWizardStepResumenStyles];
  }

  render() {
    return html`
      <div class="registro-wizard-step-resumen__fields">
        <div class="registro-wizard-step-resumen__summary">
          <ac-avatar-basic name=${this.nombre} size="lg"></ac-avatar-basic>
          <div class="registro-wizard-step-resumen__summary-details">
            <ac-text-basic tag="p" size="md"
              >${this.nombre || '—'} · ${this.email || '—'}</ac-text-basic
            >
            <ac-badge-basic ambient="success"
              >${ROL_BADGE_LABEL[this.rol] ?? UNKNOWN_ROL_LABEL}</ac-badge-basic
            >
          </div>
        </div>
        <ac-divider-basic></ac-divider-basic>
        <ac-text-basic tag="p" size="sm"
          >Plan ${this.plan} · Notificaciones
          ${this.notificaciones ? 'activadas' : 'desactivadas'}</ac-text-basic
        >
        <div class="registro-wizard-step-resumen__actions">
          ${
            this.loading
              ? html`<ac-spinner-basic size="md" ambient="primary"></ac-spinner-basic>`
              : html`<ac-button-basic
                  ambient="primary"
                  @ac-button-basic-click=${this._onConfirmClick}
                  >${this.t('registro-wizard-confirm')}</ac-button-basic
                >`
          }
        </div>
      </div>
    `;
  }
}
