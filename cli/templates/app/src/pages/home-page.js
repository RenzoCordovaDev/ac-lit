import { css, html, LitElement } from 'lit';

/**
 * Página de portada de la app. Explica cómo se comunican las páginas y enlaza
 * a las dos páginas de ejemplo. No usa CCP directamente.
 *
 * @element app-home-page
 */
class AppHomePage extends LitElement {
  /**
   * Estilos de la portada: bloque simple con espaciado entre párrafos.
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
    return html`
      <h2>Bienvenido</h2>
      <p>
        Esta app usa <code>@ac-base/ac-ccp</code> para comunicar sus páginas por canales. La página
        <strong>Usuarios</strong> publica a quién seleccionaste en un canal retenido, y la página
        <strong>Seleccionado</strong> lo muestra, incluso si entras a esa página después de haber
        seleccionado a alguien.
      </p>
      <p>
        Prueba seleccionar un usuario en <strong>Usuarios</strong> y luego abre
        <strong>Seleccionado</strong>: verás el mismo usuario, porque el canal guarda el último
        mensaje publicado.
      </p>
      <p><a href="#tabla">Ir a Usuarios →</a></p>
      <p><a href="#seleccion">Ir a Seleccionado →</a></p>
    `;
  }
}

customElements.define('app-home-page', AppHomePage);
