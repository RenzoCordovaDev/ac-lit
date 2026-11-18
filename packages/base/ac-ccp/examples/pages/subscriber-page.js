import { ChannelController } from '../../index.js';
import { css, html, LitElement } from 'lit';
import '@ac-components/ac-badge-basic';

/**
 * Página B del ejemplo de CCP. Se suscribe al canal `'users.selected'` (el mismo
 * que publica la página `publisher`) y muestra el último usuario recibido.
 * Si el canal tiene un mensaje retenido, lo muestra al montarse aunque el
 * publicador haya emitido antes de que esta página existiera.
 *
 * @element ccp-example-subscriber-page
 */
class CcpExampleSubscriberPage extends LitElement {
  static properties = {
    ccp: { attribute: false },
    _lastMessage: { state: true },
  };

  #controller;

  constructor() {
    super();
    /**
     * Instancia de CCP creada por la aplicación con `createCCP()`. La asigna
     * `examples.js` justo después de crear el elemento.
     *
     * @type {Object|undefined}
     */
    this.ccp = undefined;
    this._lastMessage = null;
  }

  /**
   * Crea el `ChannelController` una sola vez, en cuanto `ccp` está disponible.
   * Usa el `replay` por defecto, así que entrega el mensaje retenido al suscribirse.
   *
   * @param {Map<PropertyKey, unknown>} changedProperties - Propiedades que cambiaron en este ciclo.
   * @returns {void}
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('ccp') && this.ccp && !this.#controller) {
      this.#controller = new ChannelController(this, {
        ccp: this.ccp,
        name: 'users.selected',
        direction: 'in',
        onMessage: message => {
          this._lastMessage = message.payload;
        },
      });
    }
  }

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
      <h2>Página B — subscriber</h2>
      <p>
        Esta página escucha el canal <code>'users.selected'</code> y muestra el último usuario
        publicado, incluso si ya se había publicado antes de entrar a esta página (mensaje
        retenido).
      </p>
      ${
        this._lastMessage
          ? html`<ac-badge-basic ambient="success"
              >${this._lastMessage.name} (id ${this._lastMessage.id})</ac-badge-basic
            >`
          : html`<ac-badge-basic ambient="neutral">Sin mensajes aún</ac-badge-basic>`
      }
      <p><a href="#home">← Volver</a></p>
    `;
  }
}

customElements.define('ccp-example-subscriber-page', CcpExampleSubscriberPage);
