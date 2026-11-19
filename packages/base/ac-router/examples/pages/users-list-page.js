import { css, html, LitElement } from 'lit';

/**
 * Página de lista de usuarios del ejemplo de `@ac-base/ac-router`. Cada
 * usuario tiene un link declarativo a su detalle, y un botón que demuestra la
 * navegación programática con `router.navigate` por nombre de ruta.
 */
class RouterExampleUsersListPage extends LitElement {
  static properties = {
    router: { attribute: false },
  };

  #users = [
    { id: '1', name: 'Ana' },
    { id: '2', name: 'Luis' },
    { id: '3', name: 'Carla' },
  ];

  /**
   * Estilos mínimos para que el texto y la lista sean legibles.
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
    return html`
      <h2>Usuarios</h2>
      <p>
        Cada link navega a <code>/usuarios/:id</code> con el id de ese usuario. El botón elige uno
        al azar y navega a él desde código.
      </p>
      <ul>
        ${this.#users.map(
          user => html`<li><a href="#/usuarios/${user.id}">${user.name} — ver detalle</a></li>`,
        )}
      </ul>
      <p><button @click=${() => this._onRandomClick()}>Ver un usuario al azar</button></p>
      <p><a href="#/">← Volver</a></p>
    `;
  }

  /**
   * Elige un usuario al azar de la lista y navega a su detalle por nombre de
   * ruta (`usuario-detalle`), pasando su id como parámetro.
   */
  _onRandomClick() {
    const user = this.#users[Math.floor(Math.random() * this.#users.length)];
    this.router.navigate({ name: 'usuario-detalle', params: { id: user.id } });
  }
}

customElements.define('ac-router-example-users-list-page', RouterExampleUsersListPage);
