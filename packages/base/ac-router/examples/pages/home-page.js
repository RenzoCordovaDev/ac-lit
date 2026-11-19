import { css, html, LitElement } from 'lit';

/**
 * Página de portada del ejemplo de `@ac-base/ac-router`. Explica el ejemplo y
 * enlaza a la lista de usuarios; no usa el router directamente.
 */
class RouterExampleHomePage extends LitElement {
  /**
   * Estilos mínimos para que el texto de la portada sea legible.
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
      <h2>Bienvenido</h2>
      <p>
        Este ejemplo muestra <code>@ac-base/ac-router</code>, un enrutador vanilla por hash con
        parámetros de ruta (<code>#/usuarios/:id</code>) y navegación programática con
        <code>router.navigate(...)</code>, sin ninguna librería externa.
      </p>
      <p>
        Las rutas se declaran una sola vez al crear el router. Cada cambio de hash actualiza la
        página visible, y las páginas pueden leer sus parámetros directamente desde la URL.
      </p>
      <p><a href="#/usuarios">Ir a Usuarios →</a></p>
    `;
  }
}

customElements.define('ac-router-example-home-page', RouterExampleHomePage);
