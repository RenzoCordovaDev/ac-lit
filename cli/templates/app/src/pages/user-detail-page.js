import { css, html, LitElement } from 'lit';
import '@ac-components/ac-badge-basic';

/**
 * Página "Detalle" de la app: lee el parámetro `:id` de la ruta `/usuarios/:id`
 * (inyectado como `routeParams` por el shell, ver `src/app.js`) y busca ese
 * usuario en la misma lista fija de `users-table-page.js`.
 *
 * @element app-user-detail-page
 */
class AppUserDetailPage extends LitElement {
  /**
   * Propiedades reactivas del componente.
   *
   * @type {Object}
   * @property {Object} routeParams - Parámetros de la ruta activa (`{ id }`), inyectados por el shell.
   */
  static properties = {
    routeParams: { attribute: false },
  };

  /**
   * Lista fija de usuarios de ejemplo (misma lista que `users-table-page.js`).
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
    this.routeParams = {};
  }

  /**
   * Estilos de la página: bloque simple con espaciado entre párrafos.
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
        margin: 0 0 0.75rem;
      }
    `;
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
