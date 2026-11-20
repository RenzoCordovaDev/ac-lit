import { html, LitElement } from 'lit';
import '@ac-components/ac-badge-basic';
import '@ac-components/ac-card-basic';
import { pageBaseStyles } from '../utils/page-mixin.js';

const USERS = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Luis' },
  { id: 3, name: 'Carla' },
];

/**
 * Página "Detalle": lee el parámetro `:id` de la ruta `/usuarios/:id`
 * (inyectado como `routeParams` por el shell, ver `src/app.js`) y busca ese
 * usuario en la misma lista fija de `users-table-page.js`. No usa `PageMixin`
 * -- no necesita canales, solo `routeParams`.
 *
 * @element app-user-detail-page
 */
class AppUserDetailPage extends LitElement {
  static properties = {
    routeParams: { attribute: false },
  };

  constructor() {
    super();
    this.routeParams = {};
  }

  static get styles() {
    return [pageBaseStyles];
  }

  render() {
    const user = USERS.find(candidate => String(candidate.id) === this.routeParams.id);
    return html`
      <div class="page">
        <h2>Detalle</h2>
        <ac-card-basic header-text="Usuario de la ruta">
          ${user
            ? html`
                <p>Usuario: <strong>${user.name}</strong></p>
                <ac-badge-basic ambient="neutral">ID ${user.id}</ac-badge-basic>
              `
            : html`<ac-badge-basic ambient="danger">Usuario no encontrado</ac-badge-basic>`}
        </ac-card-basic>
        <div class="page-actions">
          <a href="#/usuarios">← Volver a Usuarios</a>
        </div>
      </div>
    `;
  }
}

customElements.define('app-user-detail-page', AppUserDetailPage);
