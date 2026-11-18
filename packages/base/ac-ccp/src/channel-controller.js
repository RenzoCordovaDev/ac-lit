import { CCPError } from './ccp-error.js';
import { CCP_ERROR_CODES } from './ccp-error-codes.js';

/**
 * Reactive Controller de Lit que conecta un host al ciclo de vida de un canal
 * de CCP. Nunca crea una instancia de CCP por su cuenta -- siempre recibe una
 * ya existente vía `config.ccp` (creada una sola vez por aplicación con
 * `createCCP()`). Se registra en `hostConnected()` con un id nuevo en cada
 * ciclo (nunca reutiliza uno anterior) y se desconecta por completo en
 * `hostDisconnected()`, así que soporta ciclos `connect → disconnect →
 * connect` sin duplicar suscripciones.
 */
export class ChannelController {
  #ccp;
  #host;
  #name;
  #direction;
  #retain;
  #replay;
  #onMessage;
  #channel;
  #unsubscribe;

  /**
   * @param {import('lit').ReactiveControllerHost} host
   * @param {Object} config
   * @param {Object} config.ccp - Instancia devuelta por `createCCP()`.
   * @param {string} config.name - Nombre lógico del canal.
   * @param {'in'|'out'} config.direction
   * @param {boolean} [config.retain=false] - Solo aplica a canales `out`.
   * @param {boolean} [config.replay=true] - Solo aplica a canales `in`.
   * @param {(message: import('./channel-message.js').ChannelMessage) => void} [config.onMessage] - Callback para canales `in`. Se ignora si `direction` es `out`.
   */
  constructor(host, { ccp, name, direction, retain = false, replay = true, onMessage } = {}) {
    if (!ccp) {
      throw new CCPError(
        CCP_ERROR_CODES.INVALID_NAME,
        'ChannelController necesita una instancia de CCP existente en `config.ccp` -- nunca crea una propia.',
      );
    }
    this.#ccp = ccp;
    this.#host = host;
    this.#name = name;
    this.#direction = direction;
    this.#retain = retain;
    this.#replay = replay;
    this.#onMessage = onMessage;
    host.addController(this);
  }

  /**
   * Registra un endpoint nuevo en CCP y, si es `in` con `onMessage`, se
   * suscribe. Cada llamada pide un id nuevo al Registry, así que reconectar
   * nunca hereda ni duplica la suscripción del ciclo anterior.
   */
  hostConnected() {
    this.#channel = this.#ccp.register({
      name: this.#name,
      direction: this.#direction,
      retain: this.#retain,
    });
    if (this.#direction === 'in' && this.#onMessage) {
      this.#unsubscribe = this.#channel.subscribe(
        message => {
          this.#onMessage(message);
          this.#host.requestUpdate();
        },
        { replay: this.#replay },
      );
    }
  }

  /**
   * Cancela la suscripción (si existe) y desconecta el endpoint por completo.
   */
  hostDisconnected() {
    this.#unsubscribe?.();
    this.#unsubscribe = undefined;
    this.#channel?.disconnect();
    this.#channel = undefined;
  }

  /**
   * Publica un mensaje por este canal. Solo válido para canales `out`.
   * @param {*} payload
   * @param {Object} [metadata]
   * @returns {import('./channel-message.js').ChannelMessage}
   * @throws {CCPError} PUBLISH_ON_IN si el canal es `in`.
   * @throws {CCPError} ENDPOINT_DISCONNECTED si el host no está conectado.
   */
  publish(payload, metadata) {
    if (!this.#channel) {
      throw new CCPError(
        CCP_ERROR_CODES.ENDPOINT_DISCONNECTED,
        'El host todavía no se conectó (o ya se desconectó) -- no hay canal activo.',
      );
    }
    return this.#channel.publish(payload, metadata);
  }
}
