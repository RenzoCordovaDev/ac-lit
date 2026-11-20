import { LitElement, css, html } from 'lit';
import '@ac-components/ac-button-basic';
import { PageMixin, pageBaseStyles } from '../utils/page-mixin.js';

/**
 * Página "Usuarios" de la app: muestra una lista fija de usuarios y publica en el
 * canal `'users.selected'` el usuario cuyo botón se presionó. El último usuario
 * publicado queda retenido en el canal.
 *
 * @element app-users-table-page
 * @fires ac-button-basic-click - Propagado desde cada botón de selección.
 */
class AppUsersTablePage extends PageMixin(LitElement) {
  static get properties() {
    return {
      _selected: { state: true },
    };
  }

  #publicarSeleccionado;

  #users = [
    { id: 1, name: 'Ana' },
    { id: 2, name: 'Luis' },
    { id: 3, name: 'Carla' },
  ];

  constructor() {
    super();
    this._selected = null;
  }

  setupChannels() {
    this.#publicarSeleccionado = this.connectionOut('users.selected', { retain: true });
  }

  _onSelectClick(user) {
    this.#publicarSeleccionado(user);
    this._selected = user;
  }

  static get styles() {
    return [
      pageBaseStyles,
      css`
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
      `,
    ];
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
