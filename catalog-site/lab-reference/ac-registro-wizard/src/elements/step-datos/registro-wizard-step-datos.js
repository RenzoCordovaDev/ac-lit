import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import '@ac-components/ac-button-basic';
import '@ac-components/ac-input-basic';
import '@ac-components/ac-select-basic';
import '@ac-components/ac-text-basic';
import '@ac-components/ac-tooltip-basic';

import { ROL_OPTIONS } from '../../utils/constants.js';
import { RegistroWizardStepDatosStyles } from './registro-wizard-step-datos.styles.js';

/**
 * Contenido del paso 1 ("Datos personales") de ac-registro-wizard: nombre, correo, rol y su tooltip de ayuda. Recibe los valores por propiedad y emite un evento por cada cambio -- no guarda estado propio de los datos del formulario.
 * @lit @webcomponent @customElement
 * @fires {{value: string}} registro-wizard-step-datos-nombre-input
 * @fires {{value: string}} registro-wizard-step-datos-email-input
 * @fires {{value: string}} registro-wizard-step-datos-rol-change
 * @fires {void} registro-wizard-step-datos-next-click
 */
export class RegistroWizardStepDatos extends ComponentMixin(LitElement) {
  static get is() {
    return 'registro-wizard-step-datos';
  }

  static get properties() {
    return {
      /**
       * Nombre completo ingresado por el usuario.
       * @type {String}
       * @default ''
       */
      nombre: { type: String },
      /**
       * Correo electrónico ingresado por el usuario.
       * @type {String}
       * @default ''
       */
      email: { type: String },
      /**
       * Rol seleccionado por el usuario, con el valor de una de las opciones de ROL_OPTIONS.
       * @type {String}
       * @default ''
       */
      rol: { type: String },
      /**
       * Mensaje de error a mostrar bajo el campo nombre (ej. "completa tu nombre y correo").
       * @type {String}
       * @default ''
       */
      nombreError: { type: String, attribute: 'nombre-error' },
      /**
       * Nombre de la persona para armar el saludo de bienvenida ("Hola, {welcomeName}...").
       * @type {String}
       * @default ''
       */
      welcomeName: { type: String, attribute: 'welcome-name' },
    };
  }

  constructor() {
    super();
    this.nombre = '';
    this.email = '';
    this.rol = '';
    this.nombreError = '';
    this.welcomeName = '';
  }

  /**
   * Reemite el valor del campo nombre como evento propio del paso.
   * @private
   * @event registro-wizard-step-datos-nombre-input
   */
  _onNombreInput(event) {
    this._emit('registro-wizard-step-datos-nombre-input', { value: event.detail.value });
  }

  /**
   * Reemite el valor del campo correo como evento propio del paso.
   * @private
   * @event registro-wizard-step-datos-email-input
   */
  _onEmailInput(event) {
    this._emit('registro-wizard-step-datos-email-input', { value: event.detail.value });
  }

  /**
   * Reemite el rol elegido en el select como evento propio del paso.
   * @private
   * @event registro-wizard-step-datos-rol-change
   */
  _onRolChange(event) {
    this._emit('registro-wizard-step-datos-rol-change', { value: event.detail.value });
  }

  /**
   * Avisa que el usuario pulsó el botón de siguiente paso.
   * @private
   * @event registro-wizard-step-datos-next-click
   */
  _onNextClick() {
    this._emit('registro-wizard-step-datos-next-click');
  }

  /**
   * Despacha un CustomEvent con el nombre y detalle indicados, con bubbles y composed activos.
   * @private
   */
  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  static get styles() {
    return [componentBaseStyles, RegistroWizardStepDatosStyles];
  }

  render() {
    return html`
      <div class="registro-wizard-step-datos__fields">
        ${
          this.welcomeName
            ? html`<ac-text-basic
                tag="p"
                size="sm"
                text=${this.t('registro-wizard-welcome-message', { nombre: this.welcomeName })}
              ></ac-text-basic>`
            : ''
        }
        <ac-input-basic
          label=${this.t('registro-wizard-nombre-label')}
          .value=${this.nombre}
          .error=${this.nombreError}
          @ac-input-basic-input=${this._onNombreInput}
        ></ac-input-basic>
        <ac-input-basic
          label=${this.t('registro-wizard-email-label')}
          type="email"
          .value=${this.email}
          @ac-input-basic-input=${this._onEmailInput}
        ></ac-input-basic>
        <div class="registro-wizard-step-datos__field-with-hint">
          <ac-select-basic
            label=${this.t('registro-wizard-rol-label')}
            placeholder=${this.t('registro-wizard-rol-placeholder')}
            .options=${ROL_OPTIONS}
            .value=${this.rol}
            @ac-select-basic-change=${this._onRolChange}
          ></ac-select-basic>
          <ac-tooltip-basic text=${this.t('registro-wizard-rol-tooltip')} position="left">
            <ac-button-basic
              ambient="secondary"
              aria-label=${this.t('registro-wizard-rol-help-aria')}
              >?</ac-button-basic
            >
          </ac-tooltip-basic>
        </div>
        <div class="registro-wizard-step-datos__actions">
          <ac-button-basic ambient="primary" @ac-button-basic-click=${this._onNextClick}
            >${this.t('registro-wizard-next')}</ac-button-basic
          >
        </div>
      </div>
    `;
  }
}
