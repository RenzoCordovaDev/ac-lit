import { LitElement, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import '@ac-components/ac-api-users';
import '@ac-components/ac-icon-button-basic';
import '@ac-components/ac-modal-basic';
import '@ac-components/ac-notification-basic';
import '@ac-components/ac-transition-container';

import './elements/modal-info/registro-wizard-modal-info.js';
import './elements/modal-resultado/registro-wizard-modal-resultado.js';
import './elements/steps/registro-wizard-steps.js';
import { API_VERSION, DEFAULT_ROL, INIT_USER_ID, PLAN_MENSUAL } from './utils/constants.js';
import { RegistroWizardStyles } from './registro-wizard.styles.js';

/**
 * Wizard de registro de usuario de 3 pasos (datos, preferencias, resumen), construido con el scaffolding real del CLI de ac-lit. Coordina el estado canónico del formulario y la llamada simulada a ac-api-users; delega la coordinación del multistep a registro-wizard-steps, el contenido del modal de éxito a registro-wizard-modal-resultado y el del modal de información a registro-wizard-modal-info.
 * @lit @webcomponent @customElement
 * @fires {{step: number, totalSteps: number}} ac-registro-wizard-step-change
 * @fires {{data: Object}} ac-registro-wizard-register-success
 * @fires {{error: Object}} ac-registro-wizard-register-error
 * @fires {void} ac-registro-wizard-reset
 */
export class RegistroWizard extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-registro-wizard';
  }

  static get properties() {
    return {
      /**
       * Si la transición raíz (ac-transition-container) está visible. Arranca en true: este wizard no tiene pantalla "anterior", es la raíz del flujo.
       * @type {Boolean}
       * @default true
       * @private
       */
      _open: { state: true },
      /**
       * Si el modal de registro exitoso está visible.
       * @type {Boolean}
       * @default false
       * @private
       */
      _modalOpen: { state: true },
      /**
       * Si el modal de información general del laboratorio está visible.
       * @type {Boolean}
       * @default false
       * @private
       */
      _infoOpen: { state: true },
      /**
       * Nombre completo del formulario, estado canónico compartido entre los 3 pasos.
       * @type {String}
       * @default ''
       * @private
       */
      _nombre: { state: true },
      /**
       * Correo electrónico del formulario, estado canónico compartido entre los 3 pasos.
       * @type {String}
       * @default ''
       * @private
       */
      _email: { state: true },
      /**
       * Rol elegido en el paso 1.
       * @type {String}
       * @default ''
       * @private
       */
      _rol: { state: true },
      /**
       * Si se activaron las notificaciones por correo en el paso 2.
       * @type {Boolean}
       * @default false
       * @private
       */
      _notificaciones: { state: true },
      /**
       * Si se aceptaron los términos y condiciones en el paso 2.
       * @type {Boolean}
       * @default false
       * @private
       */
      _terminos: { state: true },
      /**
       * Plan elegido en el paso 2: mensual o anual.
       * @type {String}
       * @default PLAN_MENSUAL
       * @private
       */
      _plan: { state: true },
      /**
       * Si la llamada de guardado contra ac-api-users está en curso.
       * @type {Boolean}
       * @default false
       * @private
       */
      _loading: { state: true },
      /**
       * Mensaje de error visible arriba del multistep (fallo de guardado o de carga inicial).
       * @type {String}
       * @default ''
       * @private
       */
      _errorMessage: { state: true },
      /**
       * Datos de bienvenida precargados por init() contra ac-api-users.
       * @type {Object}
       * @default null
       * @private
       */
      _welcomeUser: { state: true },
      /**
       * Datos del usuario ya registrado, para llenar el modal de éxito.
       * @type {Object}
       * @default null
       * @private
       */
      _registeredUser: { state: true },
    };
  }

  constructor() {
    super();
    this._infoOpen = false;
    this._resetState();
    this._apiUsersRef = createRef();
    this._stepsRef = createRef();
  }

  /**
   * Vuelve todas las properties de estado a su valor inicial. Lo usan el constructor y reset().
   * @private
   */
  _resetState() {
    this._open = true;
    this._modalOpen = false;
    this._nombre = '';
    this._email = '';
    this._rol = '';
    this._notificaciones = false;
    this._terminos = false;
    this._plan = PLAN_MENSUAL;
    this._loading = false;
    this._errorMessage = '';
    this._welcomeUser = null;
    this._registeredUser = null;
  }

  init() {
    this._apiUsersRef.value?.obtenerDatosUsuario(INIT_USER_ID);
  }

  reset() {
    this._resetState();
    this._stepsRef.value?.reset();
    this._emit('ac-registro-wizard-reset');
  }

  /**
   * Guarda los datos de bienvenida que trajo la lectura inicial contra ac-api-users.
   * @private
   */
  _onInitDataSuccess(event) {
    this._welcomeUser = event.detail.data;
  }

  /**
   * Muestra el error de la lectura inicial contra ac-api-users.
   * @private
   */
  _onInitDataError(event) {
    this._errorMessage = event.detail.error?.message ?? this.t('registro-wizard-welcome-error');
  }

  /**
   * Actualiza el nombre canónico con el valor reemitido por registro-wizard-steps.
   * @private
   */
  _onNombreInput(event) {
    this._nombre = event.detail.value;
  }

  /**
   * Actualiza el correo canónico con el valor reemitido por registro-wizard-steps.
   * @private
   */
  _onEmailInput(event) {
    this._email = event.detail.value;
  }

  /**
   * Actualiza el rol canónico con el valor reemitido por registro-wizard-steps.
   * @private
   */
  _onRolChange(event) {
    this._rol = event.detail.value;
  }

  /**
   * Actualiza el estado canónico de notificaciones.
   * @private
   */
  _onNotificacionesChange(event) {
    this._notificaciones = event.detail.checked;
  }

  /**
   * Actualiza el estado canónico de términos y condiciones.
   * @private
   */
  _onTerminosChange(event) {
    this._terminos = event.detail.checked;
  }

  /**
   * Actualiza el plan canónico elegido.
   * @private
   */
  _onPlanChange(event) {
    this._plan = event.detail.value;
  }

  /**
   * Valida que se hayan aceptado los términos y, si corresponde, dispara el guardado contra ac-api-users.
   * @private
   */
  _onConfirmClick() {
    if (!this._terminos) {
      this._errorMessage = this.t('registro-wizard-terminos-error');
      return;
    }

    this._errorMessage = '';
    this._loading = true;
    this._apiUsersRef.value?.registrarUsuario({
      nombre: this._nombre,
      email: this._email,
      rol: this._rol || DEFAULT_ROL,
    });
  }

  /**
   * Maneja el éxito del guardado: cierra la transición, abre el modal con los datos reales y emite el evento propio de éxito.
   * @private
   * @event ac-registro-wizard-register-success
   */
  _onRegisterSuccess(event) {
    this._loading = false;
    this._errorMessage = '';
    this._registeredUser = event.detail.data;
    this._open = false;
    this._modalOpen = true;
    this._emit('ac-registro-wizard-register-success', { data: event.detail.data });
  }

  /**
   * Maneja el error del guardado: muestra el mensaje y emite el evento propio de error, sin cerrar la transición.
   * @private
   * @event ac-registro-wizard-register-error
   */
  _onRegisterError(event) {
    this._loading = false;
    this._errorMessage = event.detail.error?.message ?? this.t('registro-wizard-register-error');
    this._emit('ac-registro-wizard-register-error', { error: event.detail.error });
  }

  /**
   * Descarta el mensaje de error visible arriba del multistep.
   * @private
   */
  _onDismissError() {
    this._errorMessage = '';
  }

  /**
   * Cierra el modal de éxito y reinicia el wizard.
   * @private
   */
  _onModalPrimaryClick() {
    this._modalOpen = false;
    this.reset();
  }

  /**
   * Reinicia el wizard al hacer click en la flecha de volver -- este wizard no tiene pantalla anterior a la que volver.
   * @private
   */
  _onBackIconClick() {
    this.reset();
  }

  /**
   * Abre el modal de información general del laboratorio.
   * @private
   */
  _onInfoIconClick() {
    this._infoOpen = true;
  }

  /**
   * Sincroniza el estado al cerrarse el modal de información, sin importar la causa (botón de cerrar, Escape o backdrop).
   * @private
   */
  _onInfoModalClose() {
    this._infoOpen = false;
  }

  /**
   * Reemite el cambio de paso activo que informó registro-wizard-steps como evento público propio.
   * @private
   * @event ac-registro-wizard-step-change
   */
  _onStepsStepChange(event) {
    this._emit('ac-registro-wizard-step-change', {
      step: event.detail.step,
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
    return [componentBaseStyles, RegistroWizardStyles];
  }

  render() {
    return html`
      <ac-api-users
        ${ref(this._apiUsersRef)}
        version=${API_VERSION}
        @ac-api-users-get-user-success=${this._onInitDataSuccess}
        @ac-api-users-get-user-error=${this._onInitDataError}
        @ac-api-users-register-success=${this._onRegisterSuccess}
        @ac-api-users-register-error=${this._onRegisterError}
      ></ac-api-users>

      <ac-transition-container
        ?open=${this._open}
        header-text=${this.t('registro-wizard-header-text')}
        hide-menu-icon
        @ac-transition-container-header-back-icon-click=${this._onBackIconClick}
      >
        <ac-icon-button-basic
          slot="header-end"
          name="info"
          ambient="secondary"
          a11y-label=${this.t('registro-wizard-info-aria')}
          @click=${this._onInfoIconClick}
        ></ac-icon-button-basic>
        <div class="registro-wizard__body">
          ${
            this._errorMessage
              ? html`<ac-notification-basic
                  ambient="danger"
                  .message=${this._errorMessage}
                  @ac-notification-basic-dismiss-click=${this._onDismissError}
                ></ac-notification-basic>`
              : ''
          }
          <registro-wizard-steps
            ${ref(this._stepsRef)}
            .nombre=${this._nombre}
            .email=${this._email}
            .rol=${this._rol}
            .welcomeName=${this._welcomeUser?.nombre ?? ''}
            .terminos=${this._terminos}
            .notificaciones=${this._notificaciones}
            .plan=${this._plan}
            .loading=${this._loading}
            @registro-wizard-steps-nombre-change=${this._onNombreInput}
            @registro-wizard-steps-email-change=${this._onEmailInput}
            @registro-wizard-steps-rol-change=${this._onRolChange}
            @registro-wizard-steps-terminos-change=${this._onTerminosChange}
            @registro-wizard-steps-notificaciones-change=${this._onNotificacionesChange}
            @registro-wizard-steps-plan-change=${this._onPlanChange}
            @registro-wizard-steps-confirm-click=${this._onConfirmClick}
            @registro-wizard-steps-step-change=${this._onStepsStepChange}
          ></registro-wizard-steps>
        </div>
      </ac-transition-container>

      <ac-modal-basic
        ?open=${this._modalOpen}
        size="full"
        header=${this.t('registro-wizard-modal-header')}
        primary-text=${this.t('registro-wizard-modal-primary')}
        @ac-modal-basic-primary-click=${this._onModalPrimaryClick}
      >
        <registro-wizard-modal-resultado
          .userId=${this._registeredUser?.id ?? null}
          .nombre=${this._registeredUser?.nombre ?? ''}
          .email=${this._registeredUser?.email ?? ''}
          .rol=${this._registeredUser?.rol ?? ''}
        ></registro-wizard-modal-resultado>
      </ac-modal-basic>

      <ac-modal-basic
        ?open=${this._infoOpen}
        header=${this.t('registro-wizard-info-title')}
        @ac-modal-basic-close=${this._onInfoModalClose}
      >
        <registro-wizard-modal-info></registro-wizard-modal-info>
      </ac-modal-basic>
    `;
  }
}
