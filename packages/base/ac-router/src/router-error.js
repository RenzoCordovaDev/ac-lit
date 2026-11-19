import { ROUTER_ERROR_CODES } from './router-error-codes.js';

/**
 * Error propio de Router. Expone `code` (uno de ROUTER_ERROR_CODES) además del
 * `message` estándar de Error, para que el consumidor pueda manejar cada
 * caso por código sin parsear texto.
 */
export class RouterError extends Error {
  /**
   * @param {string} code - Uno de los valores de ROUTER_ERROR_CODES.
   * @param {string} message - Mensaje legible del error.
   * @param {*} [details] - Información adicional opcional (ej. el nombre de la ruta o el param faltante).
   */
  constructor(code, message, details) {
    super(message);
    this.name = 'RouterError';
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}

export { ROUTER_ERROR_CODES };
