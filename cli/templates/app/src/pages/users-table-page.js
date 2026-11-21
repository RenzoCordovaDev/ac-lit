import { LitElement, css, html, nothing } from 'lit';
import '@ac-components/ac-badge-basic';
import '@ac-components/ac-button-basic';
import '@ac-components/ac-card-basic';
import '@ac-components/ac-divider-basic';
import '@ac-components/ac-icon-basic';
import '@ac-components/ac-link-basic';
import '@ac-components/ac-text-basic';
import { PageMixin, pageBaseStyles } from '../utils/page-mixin.js';

const USERS = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Luis' },
  { id: 3, name: 'Carla' },
];

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
        .user-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2, 0.5rem);
        }

        .user-row {
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
        <ac-text-basic tag="h2">Usuarios</ac-text-basic>
        ${this._globalUser
          ? html`<ac-badge-basic ambient="neutral">
              <ac-icon-basic name="check" size="sm"></ac-icon-basic> Usuario global:
              ${this._globalUser.nombre}
            </ac-badge-basic>`
          : nothing}
        <ac-card-basic header-text="Selecciona un usuario">
          <div class="user-list">
            ${USERS.map(
              user => html`
                <div class="user-row">
                  <ac-button-basic
                    ambient="primary"
                    @ac-button-basic-click=${() => this._onSelectClick(user)}
                  >
                    Seleccionar a ${user.name}
                  </ac-button-basic>
                  <ac-link-basic href="#/usuarios/${user.id}"
                    >Ver detalle <ac-icon-basic name="arrow-right" size="sm"></ac-icon-basic
                  ></ac-link-basic>
                </div>
              `,
            )}
          </div>
          <ac-divider-basic></ac-divider-basic>
          ${this._selected
            ? html`<ac-badge-basic ambient="success">
                <ac-icon-basic name="success" size="sm"></ac-icon-basic> Seleccionaste:
                ${this._selected.name}
              </ac-badge-basic>`
            : html`<ac-badge-basic ambient="neutral">Todavía nadie seleccionado</ac-badge-basic>`}
        </ac-card-basic>
        <div class="page-actions">
          <ac-link-basic href="#/"
            ><ac-icon-basic name="arrow-left" size="sm"></ac-icon-basic> Volver</ac-link-basic
          >
        </div>
      </div>
    `;
  }
}

customElements.define('app-users-table-page', AppUsersTablePage);
