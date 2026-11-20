import { css, html, LitElement } from 'lit';
import '@ac-components/ac-badge-basic';
import { pageBaseStyles } from '../utils/page-mixin.js';

/**
 * Página "Detalle" de la app: lee el parámetro `:id` de la ruta `/usuarios/:id`
 * (inyectado como `routeParams` por el shell, ver `src/app.js`) y busca ese
 * usuario en la misma lista fija de `users-table-page.js`.
 *
 * @element app-user-detail-page
 */
class AppUserDetailPage extends LitElement {
  static properties = {
    routeParams: { attribute: false },
  };

  #users = [
    { id: 1, name: 'Ana' },
    { id: 2, name: 'Luis' },
    { id: 3, name: 'Carla' },
  ];

  constructor() {
    super();
    this.routeParams = {};
  }

  static get styles() {
    return [
      pageBaseStyles,
      css`
        p {
          margin: 0 0 0.75rem;
        }
      `,
    ];
  }

  render() {
    const user = this.#users.find(candidate => String(candidate.id) === this.routeParams.id);
    return html`
      <h2>Detalle</h2>
      ${user
        ? html`
            <p>Usuario: <strong>${user.name}</strong></p>
            <ac-badge-basic ambient="neutral">ID ${user.id}</ac-badge-basic>
          `
        : html`<p>Usuario no encontrado: el id de la URL no corresponde a ningún usuario conocido.</p>`}
      <p><a href="#/usuarios">← Volver a Usuarios</a></p>
    `;
  }
}

customElements.define('app-user-detail-page', AppUserDetailPage);
