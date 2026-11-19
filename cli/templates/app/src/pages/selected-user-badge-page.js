import { ChannelController } from '@ac-base/ac-ccp';
import { css, html, LitElement } from 'lit';
import '@ac-components/ac-badge-basic';

/**
 * Página "Seleccionado" de la app: se suscribe al canal `'users.selected'` y
 * muestra el último usuario seleccionado en la página "Usuarios". Si ya había un
 * mensaje retenido en el canal, lo muestra al montarse.
 *
 * @element app-selected-user-badge-page
 */
class AppSelectedUserBadgePage extends LitElement {
  /**
   * Propiedades reactivas del componente.
   *
   * @type {Object}
   * @property {Object} ccp - Instancia de CCP devuelta por `createCCP()`. Se asigna desde fuera.
   * @property {Object|null} _lastMessage - Último usuario recibido (estado interno).
   */
  static properties = {
    ccp: { attribute: false },
    _lastMessage: { state: true },
  };

  /**
   * Controller del canal de entrada `'users.selected'`. Se crea una sola vez
   * en cuanto `ccp` está disponible.
   *
   * @type {ChannelController|undefined}
   */
  #controller;

  /**
   * Inicializa las propiedades reactivas del componente.
   */
  constructor() {
    super();
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
    super.willUpdate(changedProperties);
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
    return html`
      <h2>Seleccionado</h2>
      <p>
        Esta página muestra el último usuario seleccionado en <strong>Usuarios</strong>, incluso si
        ya se había seleccionado antes de entrar acá (mensaje retenido).
      </p>
      ${this._lastMessage
        ? html`<ac-badge-basic ambient="success">${this._lastMessage.name}</ac-badge-basic>`
        : html`<ac-badge-basic ambient="neutral">Nadie seleccionado aún</ac-badge-basic>`}
      <p><a href="#home">← Volver</a></p>
    `;
  }
}

customElements.define('app-selected-user-badge-page', AppSelectedUserBadgePage);
