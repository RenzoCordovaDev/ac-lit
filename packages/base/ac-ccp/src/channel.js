import { CCPError } from './ccp-error.js';
import { CCP_ERROR_CODES } from './ccp-error-codes.js';
import { createChannelMessage } from './channel-message.js';

/**
 * Endpoint concreto que usa el desarrollador para publicar o suscribirse,
 * según su `direction`. Lo construye y devuelve `CCPManager.register()` --
 * nunca se instancia directamente desde fuera del paquete.
 */
export class Channel {
  #manager;
  #disconnected = false;

  /**
   * @param {Object} config
   * @param {string} config.id
   * @param {string} config.name
   * @param {'in'|'out'} config.direction
   * @param {boolean} config.retain
   * @param {Object} config.manager - Instancia de CCPManager dueña de este endpoint.
   */
  constructor({ id, name, direction, retain, manager }) {
    this.id = id;
    this.name = name;
    this.direction = direction;
    this.retain = retain;
    this.#manager = manager;
  }

  /**
   * Publica un mensaje. Solo disponible para canales `direction: 'out'`.
   * @param {*} payload
   * @param {Object} [metadata]
   * @returns {import('./channel-message.js').ChannelMessage} El mensaje publicado.
   * @throws {CCPError} PUBLISH_ON_IN si este canal es `in`.
   * @throws {CCPError} ENDPOINT_DISCONNECTED si ya se llamó a `disconnect()`.
   */
  publish(payload, metadata = {}) {
    if (this.#disconnected) {
      throw new CCPError(
        CCP_ERROR_CODES.ENDPOINT_DISCONNECTED,
        `El canal "${this.id}" ya fue desconectado.`,
        { id: this.id },
      );
    }
    if (this.direction !== 'out') {
      throw new CCPError(
        CCP_ERROR_CODES.PUBLISH_ON_IN,
        `El canal "${this.id}" es de dirección "in" y no puede publicar.`,
        { id: this.id },
      );
    }
    const message = createChannelMessage({
      channel: this.name,
      source: this.id,
      payload,
      metadata,
    });
    this.#manager._dispatch(message, { retain: this.retain });
    return message;
  }

  /**
   * Se suscribe a los mensajes de este canal. Solo disponible para canales
   * `direction: 'in'`.
   * @param {(message: import('./channel-message.js').ChannelMessage) => void} callback
   * @param {Object} [options]
   * @param {boolean} [options.replay=true]
   * @returns {() => void} Función para cancelar esta suscripción puntual.
   * @throws {CCPError} SUBSCRIBE_ON_OUT si este canal es `out`.
   * @throws {CCPError} ENDPOINT_DISCONNECTED si ya se llamó a `disconnect()`.
   */
  subscribe(callback, options = {}) {
    if (this.#disconnected) {
      throw new CCPError(
        CCP_ERROR_CODES.ENDPOINT_DISCONNECTED,
        `El canal "${this.id}" ya fue desconectado.`,
        { id: this.id },
      );
    }
    if (this.direction !== 'in') {
      throw new CCPError(
        CCP_ERROR_CODES.SUBSCRIBE_ON_OUT,
        `El canal "${this.id}" es de dirección "out" y no puede suscribirse.`,
        { id: this.id },
      );
    }
    return this.#manager._subscribe(this.id, this.name, callback, options);
  }

  /**
   * Desconecta este endpoint por completo (quita sus suscripciones y lo
   * elimina del registro). Idempotente: llamarlo más de una vez no lanza error.
   */
  disconnect() {
    if (this.#disconnected) return;
    this.#disconnected = true;
    this.#manager.unregister(this.id);
  }
}
