import { CCPError } from './ccp-error.js';
import { CCP_ERROR_CODES } from './ccp-error-codes.js';
import { ChannelRegistry } from './channel-registry.js';
import { ChannelDispatcher } from './channel-dispatcher.js';
import { Channel } from './channel.js';

/**
 * Crea una instancia nueva e independiente de CCP. Nunca se comparte una
 * instancia global entre distintas aplicaciones que usen este paquete -- cada
 * una debe llamar a `createCCP()` la suya propia.
 * @returns {CCPManager}
 */
export function createCCP() {
  return new CCPManager();
}

/**
 * Coordinador principal de CCP (Channel Communication Pattern). Administra el
 * registro de endpoints y delega la distribución de mensajes al Dispatcher --
 * no contiene él mismo la lógica de registro, coincidencia o distribución.
 */
class CCPManager {
  #registry = new ChannelRegistry();
  #dispatcher = new ChannelDispatcher();
  #destroyed = false;

  /**
   * Registra un endpoint nuevo y devuelve el `Channel` para usarlo.
   * @param {Object} config
   * @param {string} config.name - Nombre lógico del canal.
   * @param {'in'|'out'} config.direction
   * @param {boolean} [config.retain=false] - Si un OUT conserva su último mensaje publicado.
   * @param {string} [config.id] - Id personalizado del endpoint; si se omite, se genera uno.
   * @returns {Channel}
   * @throws {CCPError} INVALID_NAME si `name` está vacío o no es un string.
   * @throws {CCPError} DUPLICATE_ID si `id` ya está en uso.
   * @throws {CCPError} DESTROYED si la instancia ya fue destruida.
   */
  register({ name, direction, retain = false, id } = {}) {
    this.#assertAlive();
    if (typeof name !== 'string' || name.trim() === '') {
      throw new CCPError(
        CCP_ERROR_CODES.INVALID_NAME,
        'El nombre lógico del canal no puede estar vacío.',
        {
          name,
        },
      );
    }
    const endpointId = id ?? crypto.randomUUID();
    this.#registry.add({ id: endpointId, name, direction, retain, createdAt: Date.now() });
    return new Channel({ id: endpointId, name, direction, retain, manager: this });
  }

  /**
   * Quita un endpoint del registro y libera sus suscripciones. Uso directo
   * reservado para casos avanzados -- normalmente se usa `channel.disconnect()`.
   * @param {string} id
   * @throws {CCPError} UNKNOWN_ENDPOINT si no existe ningún endpoint con ese id.
   * @throws {CCPError} DESTROYED si la instancia ya fue destruida.
   */
  unregister(id) {
    this.#assertAlive();
    this.#registry.remove(id);
    this.#dispatcher.teardown(id);
  }

  /**
   * Consulta de inspección: devuelve descriptores planos de los endpoints
   * registrados (nunca referencias mutables a los objetos internos).
   * @param {Object} [filters]
   * @param {string} [filters.name]
   * @param {'in'|'out'} [filters.direction]
   * @returns {Array<import('./channel-registry.js').ChannelEndpoint>}
   * @throws {CCPError} DESTROYED si la instancia ya fue destruida.
   */
  getChannels(filters = {}) {
    this.#assertAlive();
    return this.#registry.list(filters).map(endpoint => ({ ...endpoint }));
  }

  /**
   * Borra el mensaje retenido de un nombre lógico, o todos si no se pasa `name`.
   * @param {string} [name]
   * @throws {CCPError} DESTROYED si la instancia ya fue destruida.
   */
  clearRetained(name) {
    this.#assertAlive();
    this.#dispatcher.clearRetained(name);
  }

  /**
   * Destruye la instancia: libera endpoints, suscripciones y mensajes
   * retenidos. Cualquier operación posterior lanza `CCPError(DESTROYED)`.
   */
  destroy() {
    this.#registry.clear();
    this.#dispatcher.clearRetained();
    this.#destroyed = true;
  }

  /**
   * Punto de entrada interno usado por `Channel.publish()` -- nunca se llama
   * directamente desde fuera del paquete.
   * @param {import('./channel-message.js').ChannelMessage} message
   * @param {Object} options
   * @param {boolean} options.retain
   */
  _dispatch(message, options) {
    this.#assertAlive();
    this.#dispatcher.publish(this.#registry, message, options);
  }

  /**
   * Punto de entrada interno usado por `Channel.subscribe()` -- nunca se
   * llama directamente desde fuera del paquete.
   * @param {string} endpointId
   * @param {string} name
   * @param {(message: import('./channel-message.js').ChannelMessage) => void} callback
   * @param {Object} options
   * @returns {() => void}
   */
  _subscribe(endpointId, name, callback, options) {
    this.#assertAlive();
    return this.#dispatcher.subscribe(endpointId, name, callback, options);
  }

  #assertAlive() {
    if (this.#destroyed) {
      throw new CCPError(CCP_ERROR_CODES.DESTROYED, 'Esta instancia de CCP ya fue destruida.');
    }
  }
}
