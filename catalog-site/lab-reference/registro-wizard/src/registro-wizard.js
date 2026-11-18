import { LitElement, html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';

import '@ac-components/ac-transition-container';
import '@ac-components/ac-expandable-multistep';
import '@ac-components/ac-expandable-step';
import '@ac-components/ac-modal-basic';
import '@ac-components/ac-input-basic';
import '@ac-components/ac-select-basic';
import '@ac-components/ac-checkbox-basic';
import '@ac-components/ac-switch-basic';
import '@ac-components/ac-radio-basic';
import '@ac-components/ac-avatar-basic';
import '@ac-components/ac-badge-basic';
import '@ac-components/ac-text-basic';
import '@ac-components/ac-divider-basic';
import '@ac-components/ac-button-basic';
import '@ac-components/ac-tooltip-basic';
import '@ac-components/ac-spinner-basic';
import '@ac-components/ac-notification-basic';
import '@ac-components/ac-api-users';

// Generado a partir de registro-wizard.styles.scss por
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs).
// El archivo compilado es gitignored -- correr `pnpm install` y luego
// `pnpm run component:build:styles` (o `component:serve`, que ya lo corre antes
// de levantar Vite) para generarlo.
import { RegistroWizardStyles } from './registro-wizard.styles.js';

const ROL_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'lector', label: 'Lector' },
];

const ROL_BADGE_LABEL = {
  admin: 'Administrador',
  editor: 'Editor',
  lector: 'Lector',
};

/**
 * `registro-wizard` -- componente de referencia del Capítulo 1 (Construcción)
 * del Laboratorio. Simula un wizard de registro de 3 pasos contra
 * `ac-api-users`. Pedagógico: no es parte del catálogo publicable
 * (`packages/components/`), vive en `catalog-site/lab-reference/`.
 *
 * API pública intencionalmente mínima (2 métodos, ver el enunciado del
 * laboratorio): `init()` precarga datos de bienvenida con una llamada de
 * lectura; `reset()` vuelve todo el estado privado a su valor inicial.
 */
export class RegistroWizard extends LitElement {
  static get is() {
    return 'registro-wizard';
  }

  static get styles() {
    return [RegistroWizardStyles];
  }

  static get properties() {
    return {
      // `contained`/`getBoundary`: mismo contrato que `ac-transition-container`/
      // `ac-modal-basic` (ver "Superposiciones" en docs/CONVENTIONS.md). Como esos
      // dos viven DENTRO de este shadow DOM (no son descendientes de luz del
      // `<ac-demo-case>`), `ac-demo-content._applyContainment()` no puede verlos
      // directo -- pero si `registro-wizard` declara esta misma propiedad
      // `contained`, ese método SÍ la detecta en el host (`'contained' in el`) y
      // se la asigna a él, de donde este componente la reenvía hacia sus dos
      // hijos de superposición en el render() de más abajo. Sin esto, su
      // `<dialog>` interno abre con `showModal()` nativo y tapa toda la página
      // real -- incluida la cabecera/toolbar de `ac-demo-content` -- en vez de
      // quedar contenido al marco de dispositivo simulado.
      contained: { type: Boolean, reflect: true },

      // Estructura (transition-container / modal).
      _open: { state: true },
      _modalOpen: { state: true },

      // Paso 1 -- datos.
      _nombre: { state: true },
      _email: { state: true },
      _rol: { state: true },
      _nombreError: { state: true },

      // Paso 2 -- preferencias.
      _notificaciones: { state: true },
      _terminos: { state: true },
      _plan: { state: true },

      // Guardado simulado (paso 3) y datos que vienen de `ac-api-users`.
      _loading: { state: true },
      _errorMessage: { state: true },
      _welcomeUser: { state: true },
      _registeredUser: { state: true },
    };
  }

  constructor() {
    super();
    this.contained = false;
    this.getBoundary = null;
    this._resetState();

    // Referencias para acceso imperativo real (llamar métodos de
    // `ac-api-users`, o `complete()` sobre un `ac-expandable-step`) --
    // nunca `this.shadowRoot`/`this.renderRoot.querySelector(...)`.
    this._apiUsersRef = createRef();
    this._step1Ref = createRef();
    this._step2Ref = createRef();
    this._step3Ref = createRef();
  }

  /** Vuelve todas las propiedades privadas a su estado inicial (ver non-negotiable #3). */
  _resetState() {
    this._open = true;
    this._modalOpen = false;

    this._nombre = '';
    this._email = '';
    this._rol = '';
    this._nombreError = '';

    this._notificaciones = false;
    this._terminos = false;
    this._plan = 'mensual';

    this._loading = false;
    this._errorMessage = '';
    this._welcomeUser = null;
    this._registeredUser = null;
  }

  // ---------------------------------------------------------------------
  // API pública (exactamente 2 métodos).
  // ---------------------------------------------------------------------

  /** Simula una lectura inicial contra `ac-api-users` para dar la bienvenida. */
  init() {
    this._apiUsersRef.value?.obtenerDatosUsuario(1);
  }

  /** Reinicia el wizard: colapsa cualquier paso completado y limpia el formulario. */
  reset() {
    this._resetState();
    if (this._step1Ref.value) {
      this._step1Ref.value.completed = false;
      this._step1Ref.value.active = true;
    }
    if (this._step2Ref.value) {
      this._step2Ref.value.completed = false;
      this._step2Ref.value.active = false;
    }
    if (this._step3Ref.value) {
      // El multistep activa el paso 3 imperativamente (property directa, no vía
      // nuestro template) al completarse el paso 2 -- sin este reset explícito,
      // `active` se quedaría en `true` después de reiniciar y el resumen vacío
      // se vería a la vez que el paso 1 recién activado.
      this._step3Ref.value.completed = false;
      this._step3Ref.value.active = false;
    }
  }

  // ---------------------------------------------------------------------
  // Manejadores privados -- siempre ligados declarativamente en el template,
  // nunca con `addEventListener` imperativo.
  // ---------------------------------------------------------------------

  _onInitDataSuccess(event) {
    this._welcomeUser = event.detail.data;
  }

  _onInitDataError(event) {
    this._errorMessage = event.detail.error?.message ?? 'No se pudo cargar el saludo inicial.';
  }

  _onNombreInput(event) {
    this._nombre = event.detail.value;
    if (this._nombreError) this._nombreError = '';
  }

  _onEmailInput(event) {
    this._email = event.detail.value;
  }

  _onRolChange(event) {
    this._rol = event.detail.value;
  }

  _onNotificacionesChange(event) {
    this._notificaciones = event.detail.checked;
  }

  _onTerminosChange(event) {
    this._terminos = event.detail.checked;
  }

  _onPlanChange(event) {
    if (event.detail.checked) this._plan = event.detail.value;
  }

  _onStep1NextClick() {
    if (!this._nombre.trim() || !this._email.trim()) {
      this._nombreError = 'Completa tu nombre y correo para continuar.';
      return;
    }
    this._step1Ref.value?.complete();
  }

  _onStep2NextClick() {
    this._step2Ref.value?.complete();
  }

  _onConfirmClick() {
    if (!this._terminos) {
      this._errorMessage = 'Debes aceptar los términos para completar el registro.';
      return;
    }

    this._errorMessage = '';
    this._loading = true;
    this._apiUsersRef.value?.registrarUsuario({
      nombre: this._nombre,
      email: this._email,
      rol: this._rol || 'lector',
    });
  }

  _onRegisterSuccess(event) {
    this._loading = false;
    this._errorMessage = '';
    this._registeredUser = event.detail.data;
    this._open = false;
    this._modalOpen = true;
  }

  _onRegisterError(event) {
    this._loading = false;
    this._errorMessage = event.detail.error?.message ?? 'No se pudo completar el registro.';
  }

  _onDismissError() {
    this._errorMessage = '';
  }

  _onModalPrimaryClick() {
    this._modalOpen = false;
    this.reset();
  }

  _onBackIconClick() {
    // Pantalla raíz, sin otra pantalla a la que volver (ver docs/CONVENTIONS.md,
    // sección de ac-transition-container): la flecha de volver reinicia el flujo.
    this.reset();
  }

  render() {
    return html`
      <!--
        \`ac-api-users\` y \`ac-modal-basic\` van FUERA de \`ac-transition-container\`,
        como hermanos directos en este mismo render(), en vez de anidados en su slot
        por defecto. Un \`<dialog>\` nativo cerrado recibe \`display: none\` del
        navegador, y un elemento en la capa superior (como el \`<dialog>\` propio del
        modal, abierto con \`showModal()\`) deja de pintarse si cualquier ancestro en
        el árbol plano tiene \`display: none\` -- aunque su propio estado siga
        "abierto". Si el modal quedara anidado dentro de la transición, se volvería
        invisible justo cuando más lo necesitamos: al cerrarse la transición tras un
        guardado exitoso.
      -->
      <ac-api-users
        ${ref(this._apiUsersRef)}
        version="lab-1"
        @ac-api-users-get-user-success=${this._onInitDataSuccess}
        @ac-api-users-get-user-error=${this._onInitDataError}
        @ac-api-users-register-success=${this._onRegisterSuccess}
        @ac-api-users-register-error=${this._onRegisterError}
      ></ac-api-users>

      <ac-transition-container
        ?open=${this._open}
        ?contained=${this.contained}
        .getBoundary=${this.getBoundary}
        header-text="Registro de usuario"
        hide-menu-icon
        @ac-transition-container-header-back-icon-click=${this._onBackIconClick}
      >
        <div class="registro-wizard__body">
          ${
            this._errorMessage
              ? html`
                  <ac-notification-basic
                    ambient="danger"
                    .message=${this._errorMessage}
                    @ac-notification-basic-dismiss-click=${this._onDismissError}
                  ></ac-notification-basic>
                `
              : ''
          }

          <ac-expandable-multistep>
            <ac-expandable-step ${ref(this._step1Ref)} header="Datos personales" active>
              ${
                this._welcomeUser
                  ? html`<ac-text-basic
                      tag="p"
                      size="sm"
                      text="Hola, ${this._welcomeUser.nombre}. Completa tus datos para continuar."
                    ></ac-text-basic>`
                  : ''
              }

              <ac-input-basic
                label="Nombre completo"
                .value=${this._nombre}
                .error=${this._nombreError}
                @ac-input-basic-input=${this._onNombreInput}
              ></ac-input-basic>

              <ac-input-basic
                label="Correo"
                type="email"
                .value=${this._email}
                @ac-input-basic-input=${this._onEmailInput}
              ></ac-input-basic>

              <div class="registro-wizard__field-with-hint">
                <ac-select-basic
                  label="Rol"
                  placeholder="Elige un rol"
                  .options=${ROL_OPTIONS}
                  .value=${this._rol}
                  @ac-select-basic-change=${this._onRolChange}
                ></ac-select-basic>
                <ac-tooltip-basic text="Define qué puede hacer la cuenta dentro del sistema.">
                  <ac-button-basic ambient="secondary" aria-label="Ayuda sobre el rol"
                    >?</ac-button-basic
                  >
                </ac-tooltip-basic>
              </div>

              <div class="registro-wizard__actions">
                <ac-button-basic ambient="primary" @ac-button-basic-click=${this._onStep1NextClick}
                  >Siguiente</ac-button-basic
                >
              </div>
            </ac-expandable-step>

            <ac-expandable-step ${ref(this._step2Ref)} header="Preferencias">
              <ac-checkbox-basic
                .checked=${this._terminos}
                @ac-checkbox-basic-change=${this._onTerminosChange}
                >Acepto los términos y condiciones</ac-checkbox-basic
              >

              <ac-switch-basic
                .checked=${this._notificaciones}
                @ac-switch-basic-change=${this._onNotificacionesChange}
                >Recibir notificaciones por correo</ac-switch-basic
              >

              <fieldset class="registro-wizard__plan">
                <legend>Plan</legend>
                <ac-radio-basic
                  name="registro-wizard-plan"
                  value="mensual"
                  .checked=${this._plan === 'mensual'}
                  @ac-radio-basic-change=${this._onPlanChange}
                  >Mensual</ac-radio-basic
                >
                <ac-radio-basic
                  name="registro-wizard-plan"
                  value="anual"
                  .checked=${this._plan === 'anual'}
                  @ac-radio-basic-change=${this._onPlanChange}
                  >Anual</ac-radio-basic
                >
              </fieldset>

              <div class="registro-wizard__actions">
                <ac-button-basic ambient="primary" @ac-button-basic-click=${this._onStep2NextClick}
                  >Siguiente</ac-button-basic
                >
              </div>
            </ac-expandable-step>

            <ac-expandable-step ${ref(this._step3Ref)} header="Resumen">
              <div class="registro-wizard__summary">
                <ac-avatar-basic name=${this._nombre} size="lg"></ac-avatar-basic>
                <div class="registro-wizard__summary-details">
                  <ac-text-basic tag="p" size="md"
                    >${this._nombre || '—'} · ${this._email || '—'}</ac-text-basic
                  >
                  <ac-badge-basic ambient="success"
                    >${ROL_BADGE_LABEL[this._rol] ?? 'Sin rol'}</ac-badge-basic
                  >
                </div>
              </div>

              <ac-divider-basic></ac-divider-basic>

              <ac-text-basic tag="p" size="sm"
                >Plan ${this._plan} · Notificaciones
                ${this._notificaciones ? 'activadas' : 'desactivadas'}</ac-text-basic
              >

              <div class="registro-wizard__actions">
                ${
                  this._loading
                    ? html`<ac-spinner-basic size="md" ambient="primary"></ac-spinner-basic>`
                    : html`<ac-button-basic
                        ambient="primary"
                        @ac-button-basic-click=${this._onConfirmClick}
                        >Confirmar</ac-button-basic
                      >`
                }
              </div>
            </ac-expandable-step>
          </ac-expandable-multistep>
        </div>
      </ac-transition-container>

      <ac-modal-basic
        ?open=${this._modalOpen}
        ?contained=${this.contained}
        .getBoundary=${this.getBoundary}
        header="Registro exitoso"
        primary-text="Cerrar"
        @ac-modal-basic-primary-click=${this._onModalPrimaryClick}
      >
        ${
          this._registeredUser
            ? html`
                <ac-text-basic tag="p" size="md"
                  >Usuario #${this._registeredUser.id} registrado con éxito.</ac-text-basic
                >
                <ac-text-basic tag="p" size="sm"
                  >${this._registeredUser.nombre} · ${this._registeredUser.email}</ac-text-basic
                >
                <ac-badge-basic ambient="success"
                  >${ROL_BADGE_LABEL[this._registeredUser.rol] ?? this._registeredUser.rol}</ac-badge-basic
                >
              `
            : ''
        }
      </ac-modal-basic>
    `;
  }
}
