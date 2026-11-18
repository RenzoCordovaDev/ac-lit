import { css, html, LitElement } from 'lit';

/**
 * Página de portada del ejemplo de Channel Communication Pattern (CCP).
 * Explica el ejemplo y enlaza a las páginas publisher y subscriber; no usa CCP directamente.
 */
class CcpExampleHomePage extends LitElement {
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
      <h2>Channel Communication Pattern — ejemplo</h2>
      <p>
        Channel Communication Pattern (CCP) es un patrón de publicación y suscripción (pub/sub)
        basado en canales con nombre. Cada canal tiene una dirección: <code>in</code> para recibir
        mensajes y <code>out</code> para publicarlos. La coincidencia se hace por nombre exacto, sin
        comodines.
      </p>
      <p>
        Este ejemplo usa un canal retenido llamado <code>'users.selected'</code>. La página
        publisher publica un usuario de ejemplo en ese canal y la página subscriber lo recibe,
        incluso si se suscribe después de que el mensaje ya se publicó, gracias al mensaje retenido.
      </p>
      <p>
        Pruébalo: abre una de las páginas, publica o suscríbete, y luego navega a la otra para ver
        cómo llega el mensaje.
      </p>
      <p><a href="#publisher">Ir a la página publisher →</a></p>
      <p><a href="#subscriber">Ir a la página subscriber →</a></p>
    `;
  }
}

customElements.define('ccp-example-home-page', CcpExampleHomePage);
