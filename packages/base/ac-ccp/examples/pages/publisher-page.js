import { ChannelController } from '../../index.js';
import { css, html, LitElement } from 'lit';
import '@ac-components/ac-button-basic';

/**
 * Página A del ejemplo de CCP: publica un usuario de prueba en el canal
 * `'users.selected'` cada vez que se hace clic en el botón.
 *
 * @element ccp-example-publisher-page
 * @fires ac-button-basic-click - Propagado desde el botón de publicación.
 */
class CcpExamplePublisherPage extends LitElement {
  /**
   * Propiedades reactivas del componente.
   *
   * @type {Object}
   * @property {Object} ccp - Instancia de CCP devuelta por `createCCP()`. Se asigna desde fuera.
   * @property {Object|null} _lastPublished - Último usuario publicado (estado interno).
   */
  static properties = {
    ccp: { attribute: false },
    _lastPublished: { state: true },
  };

  /**
   * Controller del canal de salida `'users.selected'`. Se crea una sola vez
   * en cuanto `ccp` está disponible.
   *
   * @type {ChannelController|undefined}
   */
  #controller;

  /**
   * Lista fija de usuarios de ejemplo que se publican en orden cíclico.
   *
   * @type {Array<{id: number, name: string}>}
   */
  #sampleUsers = [
    { id: 1, name: 'Renzo' },
    { id: 2, name: 'Valeria' },
    { id: 3, name: 'Diego' },
    { id: 4, name: 'Camila' },
  ];

  /**
   * Índice del próximo usuario de ejemplo a publicar.
   *
   * @type {number}
   */
  #nextIndex = 0;

  /**
   * Inicializa las propiedades reactivas del componente.
   */
  constructor() {
    super();
    this.ccp = undefined;
    this._lastPublished = null;
  }

  /**
   * Crea el controller de salida la primera vez que `ccp` está disponible.
   *
   * @param {Map<PropertyKey, unknown>} changedProperties - Propiedades que cambiaron antes del update.
   * @returns {void}
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('ccp') && this.ccp && !this.#controller) {
      this.#controller = new ChannelController(this, {
        ccp: this.ccp,
        name: 'users.selected',
        direction: 'out',
        retain: true,
      });
    }
    super.willUpdate(changedProperties);
  }

  /**
   * Publica el siguiente usuario de ejemplo en el canal y lo guarda como último publicado.
   *
   * @returns {void}
   */
  _onPublishClick() {
    const user = this.#sampleUsers[this.#nextIndex % this.#sampleUsers.length];
    this.#nextIndex += 1;
    this.#controller.publish(user);
    this._lastPublished = user;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        line-height: 1.5;
      }

      p {
        margin: 0.75rem 0;
      }
    `;
  }

  render() {
    return html`
      <h2>Página A — publisher</h2>
      <p>Cada clic publica un usuario de ejemplo en el canal <code>'users.selected'</code>.</p>
      <ac-button-basic ambient="primary" @ac-button-basic-click=${() => this._onPublishClick()}>
        Publicar usuario de ejemplo
      </ac-button-basic>
      ${
        this._lastPublished
          ? html`<p>
              Publicaste: <strong>${this._lastPublished.name}</strong> (id
              ${this._lastPublished.id})
            </p>`
          : html`<p>Todavía no publicaste nada.</p>`
      }
      <p><a href="#home">← Volver</a></p>
    `;
  }
}

customElements.define('ccp-example-publisher-page', CcpExamplePublisherPage);
