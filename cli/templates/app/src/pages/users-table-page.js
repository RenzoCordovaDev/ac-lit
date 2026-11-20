import { LitElement, css, html, nothing } from 'lit';
import '@ac-components/ac-badge-basic';
import '@ac-components/ac-button-basic';
import '@ac-components/ac-card-basic';
import '@ac-components/ac-divider-basic';
import { PageMixin, pageBaseStyles } from '../utils/page-mixin.js';

const USERS = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Luis' },
  { id: 3, name: 'Carla' },
];

/**
 * Página "Usuarios": muestra una lista fija de usuarios y publica en el canal
 * `'users.selected'` el usuario cuyo botón se presionó (retenido). También
 * muestra el usuario global recibido por `'global.user.data'` (publicado por
 * la página Home).
 *
 * @element app-users-table-page
 * @fires ac-button-basic-click - Propagado desde cada botón de selección.
 */
class AppUsersTablePage extends PageMixin(LitElement) {
  static get properties() {
    return {
      _selected: { state: true },
      _globalUser: { state: true },
    };
  }

  constructor() {
    super();
    this._selected = null;
    this._globalUser = null;
    this.publishSelected = null;
  }

  setupChannels() {
    this.publishSelected = this.connectionOut('users.selected', { retain: true });
    this.connectionIn('global.user.data', user => {
      this._globalUser = user;
    });
  }

  _onSelectClick(user) {
    this.publishSelected(user);
    this._selected = user;
  }

  static get styles() {
    return [
      pageBaseStyles,
      css`
        ul {
          display: grid;
          gap: var(--space-2, 0.5rem);
          list-style: none;
          margin: 0;
          padding: 0;
        }

        li {
          display: flex;
          align-items: center;
          gap: var(--space-2, 0.5rem);
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="page">
        <h2>Usuarios</h2>
        ${this._globalUser
          ? html`<ac-badge-basic ambient="neutral">Usuario global: ${this._globalUser.nombre}</ac-badge-basic>`
          : nothing}
        <ac-card-basic header-text="Selecciona un usuario">
          <ul>
            ${USERS.map(
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
          <ac-divider-basic></ac-divider-basic>
          ${this._selected
            ? html`<ac-badge-basic ambient="success">Seleccionaste: ${this._selected.name}</ac-badge-basic>`
            : html`<ac-badge-basic ambient="neutral">Todavía nadie seleccionado</ac-badge-basic>`}
        </ac-card-basic>
        <div class="page-actions">
          <a href="#/">← Volver</a>
        </div>
      </div>
    `;
  }
}

customElements.define('app-users-table-page', AppUsersTablePage);
