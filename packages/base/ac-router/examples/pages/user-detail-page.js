import { css, html, LitElement } from 'lit';
import { RouterController } from '../../index.js';

/**
 * Página de detalle de usuario del ejemplo de `@ac-base/ac-router`. Demuestra
 * el patrón "componente Lit que lee su propia ruta": crea un `RouterController`
 * una sola vez, en cuanto recibe el router, y lee el parámetro `:id` de
 * `controller.route` en cada render.
 */
class RouterExampleUserDetailPage extends LitElement {
  static properties = {
    router: { attribute: false },
  };

  /** @type {RouterController | undefined} */
  #controller;

  #users = [
    { id: '1', name: 'Ana' },
    { id: '2', name: 'Luis' },
    { id: '3', name: 'Carla' },
  ];

  /**
   * Crea el `RouterController` la primera vez que el router está disponible.
   * Así el componente se suscribe a los cambios de ruta y se vuelve a renderizar
   * solo cuando cambia el hash.
   * @param {Map<PropertyKey, unknown>} changedProperties - Propiedades que cambiaron antes de este update.
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('router') && this.router && !this.#controller) {
      this.#controller = new RouterController(this, { router: this.router });
    }
  }

  /**
   * Estilos mínimos para que el texto del detalle sea legible.
   * @returns {import('lit').CSSResult} Estilos del componente.
   */
  static get styles() {
    return css`
      :host {
        display: block;
        line-height: 1.6;
        max-width: 60ch;
      }
    `;
  }

  render() {
    if (!this.#controller) {
      return html`<p>Cargando...</p>`;
    }
    const { id } = this.#controller.route.params;
    const user = this.#users.find(candidate => candidate.id === id);
    return html`
      ${
        user
          ? html`
              <h2>Detalle de ${user.name}</h2>
              <p>ID: ${user.id}</p>
            `
          : html`
              <h2>Usuario no encontrado</h2>
              <p>El id de la URL no corresponde a ningún usuario conocido.</p>
            `
      }
      <p><a href="#/usuarios">← Volver a Usuarios</a></p>
    `;
  }
}

customElements.define('ac-router-example-user-detail-page', RouterExampleUserDetailPage);
