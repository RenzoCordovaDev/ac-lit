import { CCPError } from './ccp-error.js';
import { CCP_ERROR_CODES } from './ccp-error-codes.js';

/**
 * @typedef {Object} ChannelEndpoint
 * @property {string} id - Identificador único del endpoint.
 * @property {string} name - Nombre lógico del canal.
 * @property {'in'|'out'} direction - Dirección del endpoint.
 * @property {boolean} retain - Si un OUT conserva su último mensaje.
 * @property {number} createdAt - Momento de registro (`Date.now()`).
 */

/**
 * Administra los endpoints registrados: alta, baja, consulta por id, y
 * consulta indexada por nombre lógico + dirección (para que el Matcher nunca
 * tenga que recorrer todos los endpoints de la aplicación en cada publish).
 */
export class ChannelRegistry {
  #byId = new Map();
  #idsByKey = new Map();

  /**
   * Agrega un endpoint nuevo al registro.
   * @param {ChannelEndpoint} endpoint
   * @throws {CCPError} DUPLICATE_ID si ya existe un endpoint con ese id.
   */
  add(endpoint) {
    if (this.#byId.has(endpoint.id)) {
      throw new CCPError(
        CCP_ERROR_CODES.DUPLICATE_ID,
        `Ya existe un endpoint registrado con id "${endpoint.id}".`,
        { id: endpoint.id },
      );
    }
    this.#byId.set(endpoint.id, endpoint);
    const key = `${endpoint.direction}:${endpoint.name}`;
    if (!this.#idsByKey.has(key)) this.#idsByKey.set(key, new Set());
    this.#idsByKey.get(key).add(endpoint.id);
  }

  /**
   * Quita un endpoint del registro.
   * @param {string} id
   * @returns {ChannelEndpoint} El endpoint eliminado.
   * @throws {CCPError} UNKNOWN_ENDPOINT si no existe ningún endpoint con ese id.
   */
  remove(id) {
    const endpoint = this.#byId.get(id);
    if (!endpoint) {
      throw new CCPError(
        CCP_ERROR_CODES.UNKNOWN_ENDPOINT,
        `No existe ningún endpoint con id "${id}".`,
        {
          id,
        },
      );
    }
    this.#byId.delete(id);
    const key = `${endpoint.direction}:${endpoint.name}`;
    const ids = this.#idsByKey.get(key);
    ids?.delete(id);
    if (ids && ids.size === 0) this.#idsByKey.delete(key);
    return endpoint;
  }

  /**
   * Busca un endpoint por su id.
   * @param {string} id
   * @returns {ChannelEndpoint|undefined}
   */
  get(id) {
    return this.#byId.get(id);
  }

  /**
   * Lista los endpoints de un nombre lógico + dirección específicos --
   * operación indexada, sin recorrer todo el registro.
   * @param {string} name
   * @param {'in'|'out'} direction
   * @returns {ChannelEndpoint[]}
   */
  listByNameAndDirection(name, direction) {
    const ids = this.#idsByKey.get(`${direction}:${name}`);
    if (!ids) return [];
    return [...ids].map(id => this.#byId.get(id));
  }

  /**
   * Lista endpoints filtrando opcionalmente por nombre y/o dirección.
   * @param {Object} [filters]
   * @param {string} [filters.name]
   * @param {'in'|'out'} [filters.direction]
   * @returns {ChannelEndpoint[]}
   */
  list({ name, direction } = {}) {
    return [...this.#byId.values()].filter(
      endpoint =>
        (name === undefined || endpoint.name === name) &&
        (direction === undefined || endpoint.direction === direction),
    );
  }

  /** Vacía el registro por completo (todos los endpoints). */
  clear() {
    this.#byId.clear();
    this.#idsByKey.clear();
  }
}
