import { resolveSubscribers } from './channel-matcher.js';

/**
 * Distribuye mensajes publicados a los endpoints IN compatibles, y administra
 * los mensajes retenidos (el último mensaje publicado por nombre lógico,
 * para entregarlo a un suscriptor que se suscriba más tarde).
 */
export class ChannelDispatcher {
  #retained = new Map();
  #subscribersByEndpointId = new Map();

  /**
   * Suscribe un callback a los mensajes de un endpoint IN ya registrado.
   * @param {string} endpointId - Id del endpoint IN.
   * @param {string} name - Nombre lógico del canal.
   * @param {(message: import('./channel-message.js').ChannelMessage) => void} callback
   * @param {Object} [options]
   * @param {boolean} [options.replay=true] - Si debe recibir el último mensaje retenido (si existe) al suscribirse.
   * @returns {() => void} Función para cancelar esta suscripción puntual. Llamarla más de una vez no debe lanzar error.
   */
  subscribe(endpointId, name, callback, { replay = true } = {}) {
    if (!this.#subscribersByEndpointId.has(endpointId)) {
      this.#subscribersByEndpointId.set(endpointId, new Set());
    }
    this.#subscribersByEndpointId.get(endpointId).add(callback);
    if (replay && this.#retained.has(name)) {
      callback(this.#retained.get(name));
    }
    return () => {
      this.#subscribersByEndpointId.get(endpointId)?.delete(callback);
    };
  }

  /**
   * Publica un mensaje: lo entrega a todos los suscriptores IN compatibles, y
   * opcionalmente lo retiene. Un callback que lanza error (sincrónico o
   * rechazando una promesa) no debe impedir que los demás reciban el mensaje.
   * @param {import('./channel-registry.js').ChannelRegistry} registry
   * @param {import('./channel-message.js').ChannelMessage} message
   * @param {Object} [options]
   * @param {boolean} [options.retain=false]
   */
  publish(registry, message, { retain = false } = {}) {
    if (retain) this.#retained.set(message.channel, message);
    const subscribers = resolveSubscribers(registry, message.channel);
    for (const endpoint of subscribers) {
      const callbacks = this.#subscribersByEndpointId.get(endpoint.id);
      if (!callbacks) continue;
      for (const callback of [...callbacks]) {
        try {
          const result = callback(message);
          if (result && typeof result.catch === 'function') {
            result.catch(() => {});
          }
        } catch (_error) {
          // Un callback roto no debe impedir que los demás reciban el mensaje.
        }
      }
    }
  }

  /**
   * Borra el mensaje retenido de un nombre lógico, o todos si no se pasa `name`.
   * @param {string} [name]
   */
  clearRetained(name) {
    if (name === undefined) {
      this.#retained.clear();
      return;
    }
    this.#retained.delete(name);
  }

  /**
   * Quita todas las suscripciones de un endpoint (al desconectarlo). No toca
   * los mensajes retenidos.
   * @param {string} endpointId
   */
  teardown(endpointId) {
    this.#subscribersByEndpointId.delete(endpointId);
  }
}
