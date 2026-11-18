import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import '@ac-components/ac-badge-basic';
import '@ac-components/ac-text-basic';

import { ROL_BADGE_LABEL } from '../../utils/constants.js';
import { RegistroWizardModalResultadoStyles } from './registro-wizard-modal-resultado.styles.js';

/**
 * Contenido del modal de éxito de ac-registro-wizard: muestra el id, nombre, correo y rol del usuario recién registrado. Es puramente de presentación -- no dispara ningún evento propio y no renderiza nada hasta que recibe un nombre real.
 * @lit @webcomponent @customElement
 */
export class RegistroWizardModalResultado extends ComponentMixin(LitElement) {
  static get is() {
    return 'registro-wizard-modal-resultado';
  }

  static get styles() {
    return [componentBaseStyles, RegistroWizardModalResultadoStyles];
  }

  static get properties() {
    return {
      /**
       * Id numérico del usuario recién registrado, devuelto por ac-api-users.
       * @type {Number}
       * @default null
       */
      userId: { type: Number, attribute: 'user-id' },
      /**
       * Nombre completo del usuario recién registrado.
       * @type {String}
       * @default ''
       */
      nombre: { type: String },
      /**
       * Correo electrónico del usuario recién registrado.
       * @type {String}
       * @default ''
       */
      email: { type: String },
      /**
       * Rol asignado al usuario, usado como clave para obtener su etiqueta en ROL_BADGE_LABEL.
       * @type {String}
       * @default ''
       */
      rol: { type: String },
    };
  }

  constructor() {
    super();
    this.userId = null;
    this.nombre = '';
    this.email = '';
    this.rol = '';
  }

  /**
   * Renderiza el contenido del modal de éxito. Devuelve un template vacío si todavía no hay nombre.
   * @public
   */
  render() {
    if (!this.nombre) return html``;

    return html`
      <ac-text-basic tag="p" size="md">Usuario #${this.userId} registrado con éxito.</ac-text-basic>
      <ac-text-basic tag="p" size="sm">${this.nombre} · ${this.email}</ac-text-basic>
      <ac-badge-basic ambient="success">${ROL_BADGE_LABEL[this.rol] ?? this.rol}</ac-badge-basic>
    `;
  }
}
