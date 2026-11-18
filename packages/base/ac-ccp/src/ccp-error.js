import { CCP_ERROR_CODES } from './ccp-error-codes.js';

/**
 * Error propio de CCP. Expone `code` (uno de CCP_ERROR_CODES) además del
 * `message` estándar de Error, para que el consumidor pueda manejar cada
 * caso por código sin parsear texto.
 */
export class CCPError extends Error {
  /**
   * @param {string} code - Uno de los valores de CCP_ERROR_CODES.
   * @param {string} message - Mensaje legible del error.
   * @param {*} [details] - Información adicional opcional (ej. el id involucrado).
   */
  constructor(code, message, details) {
    super(message);
    this.name = 'CCPError';
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}

export { CCP_ERROR_CODES };
