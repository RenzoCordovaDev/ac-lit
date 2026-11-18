import { LitElement, html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

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

export class RegistroWizard extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-registro-wizard';
  }

  static get styles() {
    return [componentBaseStyles, RegistroWizardStyles];
  }

  static get properties() {
    return {
      contained: { type: Boolean, reflect: true },
      _open: { state: true },
      _modalOpen: { state: true },
      _nombre: { state: true },
      _email: { state: true },
      _rol: { state: true },
      _nombreError: { state: true },
      _notificaciones: { state: true },
      _terminos: { state: true },
      _plan: { state: true },
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
    this._apiUsersRef = createRef();
    this._step1Ref = createRef();
    this._step2Ref = createRef();
    this._step3Ref = createRef();
  }

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

  init() {
    this._apiUsersRef.value?.obtenerDatosUsuario(1);
  }

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
      this._step3Ref.value.completed = false;
      this._step3Ref.value.active = false;
    }
    this._emit('ac-registro-wizard-reset');
  }

  _onInitDataSuccess(event) {
    this._welcomeUser = event.detail.data;
  }

  _onInitDataError(event) {
    this._errorMessage = event.detail.error?.message ?? this.t('registro-wizard-welcome-error');
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
      this._nombreError = this.t('registro-wizard-nombre-error');
      return;
    }
    this._step1Ref.value?.complete();
  }

  _onStep2NextClick() {
    this._step2Ref.value?.complete();
  }

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
      rol: this._rol || 'lector',
    });
  }

  _onRegisterSuccess(event) {
    this._loading = false;
    this._errorMessage = '';
    this._registeredUser = event.detail.data;
    this._open = false;
    this._modalOpen = true;
    this._emit('ac-registro-wizard-register-success', { data: event.detail.data });
  }

  _onRegisterError(event) {
    this._loading = false;
    this._errorMessage = event.detail.error?.message ?? this.t('registro-wizard-register-error');
    this._emit('ac-registro-wizard-register-error', { error: event.detail.error });
  }

  _onDismissError() {
    this._errorMessage = '';
  }

  _onModalPrimaryClick() {
    this._modalOpen = false;
    this.reset();
  }

  _onBackIconClick() {
    this.reset();
  }

  _onMultistepStepChange(event) {
    this._emit('ac-registro-wizard-step-change', {
      step: event.detail.stepNumber,
      totalSteps: event.detail.totalSteps,
    });
  }

  render() {
    return html`
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
        header-text=${this.t('registro-wizard-header-text')}
        hide-menu-icon
        @ac-transition-container-header-back-icon-click=${this._onBackIconClick}
      >
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
          <ac-expandable-multistep
            @ac-expandable-multistep-active-step-change=${this._onMultistepStepChange}
          >
            <ac-expandable-step
              ${ref(this._step1Ref)}
              header=${this.t('registro-wizard-step1-header')}
              active
            >
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
                label=${this.t('registro-wizard-nombre-label')}
                .value=${this._nombre}
                .error=${this._nombreError}
                @ac-input-basic-input=${this._onNombreInput}
              ></ac-input-basic>
              <ac-input-basic
                label=${this.t('registro-wizard-email-label')}
                type="email"
                .value=${this._email}
                @ac-input-basic-input=${this._onEmailInput}
              ></ac-input-basic>
              <div class="registro-wizard__field-with-hint">
                <ac-select-basic
                  label=${this.t('registro-wizard-rol-label')}
                  placeholder=${this.t('registro-wizard-rol-placeholder')}
                  .options=${ROL_OPTIONS}
                  .value=${this._rol}
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
              <div class="registro-wizard__actions">
                <ac-button-basic ambient="primary" @ac-button-basic-click=${this._onStep1NextClick}
                  >${this.t('registro-wizard-next')}</ac-button-basic
                >
              </div>
            </ac-expandable-step>

            <ac-expandable-step
              ${ref(this._step2Ref)}
              header=${this.t('registro-wizard-step2-header')}
            >
              <ac-checkbox-basic
                .checked=${this._terminos}
                @ac-checkbox-basic-change=${this._onTerminosChange}
                >${this.t('registro-wizard-terminos-label')}</ac-checkbox-basic
              >
              <ac-switch-basic
                .checked=${this._notificaciones}
                @ac-switch-basic-change=${this._onNotificacionesChange}
                >${this.t('registro-wizard-notificaciones-label')}</ac-switch-basic
              >
              <fieldset class="registro-wizard__plan">
                <legend>${this.t('registro-wizard-plan-legend')}</legend>
                <ac-radio-basic
                  name="registro-wizard-plan"
                  value="mensual"
                  .checked=${this._plan === 'mensual'}
                  @ac-radio-basic-change=${this._onPlanChange}
                  >${this.t('registro-wizard-plan-mensual')}</ac-radio-basic
                >
                <ac-radio-basic
                  name="registro-wizard-plan"
                  value="anual"
                  .checked=${this._plan === 'anual'}
                  @ac-radio-basic-change=${this._onPlanChange}
                  >${this.t('registro-wizard-plan-anual')}</ac-radio-basic
                >
              </fieldset>
              <div class="registro-wizard__actions">
                <ac-button-basic ambient="primary" @ac-button-basic-click=${this._onStep2NextClick}
                  >${this.t('registro-wizard-next')}</ac-button-basic
                >
              </div>
            </ac-expandable-step>

            <ac-expandable-step
              ${ref(this._step3Ref)}
              header=${this.t('registro-wizard-step3-header')}
            >
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
                        >${this.t('registro-wizard-confirm')}</ac-button-basic
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
        header=${this.t('registro-wizard-modal-header')}
        primary-text=${this.t('registro-wizard-modal-primary')}
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

  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}
