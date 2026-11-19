import { ChannelController } from '@ac-base/ac-ccp';
import { css, html, LitElement } from 'lit';
import '@ac-components/ac-button-basic';

/**
 * Página "Usuarios" de la app: muestra una lista fija de usuarios y publica en el
 * canal `'users.selected'` el usuario cuyo botón se presionó. El último usuario
 * publicado queda retenido en el canal.
 *
 * @element app-users-table-page
 * @fires ac-button-basic-click - Propagado desde cada botón de selección.
 */
class AppUsersTablePage extends LitElement {
  /**
   * Propiedades reactivas del componente.
   *
   * @type {Object}
   * @property {Object} ccp - Instancia de CCP devuelta por `createCCP()`. Se asigna desde fuera.
   * @property {Object|null} _selected - Último usuario seleccionado (estado interno).
   */
  static properties = {
    ccp: { attribute: false },
    _selected: { state: true },
  };

  /**
   * Controller del canal de salida `'users.selected'`. Se crea una sola vez
   * en cuanto `ccp` está disponible.
   *
   * @type {ChannelController|undefined}
   */
  #controller;

  /**
   * Lista fija de usuarios de ejemplo que se pueden seleccionar.
   *
   * @type {Array<{id: number, name: string}>}
   */
  #users = [
    { id: 1, name: 'Ana' },
    { id: 2, name: 'Luis' },
    { id: 3, name: 'Carla' },
  ];

  /**
   * Inicializa las propiedades reactivas del componente.
   */
  constructor() {
    super();
    this.ccp = undefined;
    this._selected = null;
  }

  /**
   * Crea el controller de salida la primera vez que `ccp` está disponible.
   *
   * @param {Map<PropertyKey, unknown>} changedProperties - Propiedades que cambiaron antes del update.
   * @returns {void}
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('ccp') && this.ccp && !this.#controller) {
      this.#controller = new ChannelController(this, {
        ccp: this.ccp,
        name: 'users.selected',
        direction: 'out',
        retain: true,
      });
    }
    super.willUpdate(changedProperties);
  }

  /**
   * Publica el usuario seleccionado en el canal y lo guarda como último seleccionado.
   *
   * @param {{id: number, name: string}} user - Usuario cuyo botón se presionó.
   * @returns {void}
   */
  _onSelectClick(user) {
    this.#controller.publish(user);
    this._selected = user;
  }

  /**
   * Estilos de la página: bloque simple con espaciado para la lista y los párrafos.
   *
   * @returns {import('lit').CSSResult}
   */
  static get styles() {
    return css`
      :host {
        display: block;
        line-height: 1.5;
      }

      p {
        margin: 0.75rem 0;
      }

      ul {
        display: grid;
        gap: 0.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }
    `;
  }

  render() {
    return html`
      <h2>Usuarios</h2>
      <p>
        Cada botón publica el usuario seleccionado en el canal <code>'users.selected'</code>; cada
        enlace "Ver detalle" navega a <code>/usuarios/:id</code> con el id de ese usuario.
      </p>
      <ul>
        ${this.#users.map(
          user => html`
            <li>
              <ac-button-basic
                ambient="primary"
                @ac-button-basic-click=${() => this._onSelectClick(user)}
              >
                Seleccionar a ${user.name}
              </ac-button-basic>
              <a href="#/usuarios/${user.id}">Ver detalle</a>
            </li>
          `,
        )}
      </ul>
      ${this._selected
        ? html`<p>Seleccionaste: <strong>${this._selected.name}</strong></p>`
        : html`<p>Todavía no seleccionaste a nadie.</p>`}
      <p><a href="#/">← Volver</a></p>
    `;
  }
}

customElements.define('app-users-table-page', AppUsersTablePage);
