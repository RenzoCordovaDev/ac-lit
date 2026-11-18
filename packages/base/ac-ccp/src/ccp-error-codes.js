/**
 * Códigos de error de CCP (Channel Communication Pattern). Centralizados acá
 * para que cualquier consumidor pueda distinguir el tipo de fallo por `code`
 * sin parsear el mensaje.
 * @type {Object<string, string>}
 */
export const CCP_ERROR_CODES = Object.freeze({
  INVALID_NAME: 'invalid-name',
  DUPLICATE_ID: 'duplicate-id',
  UNKNOWN_ENDPOINT: 'unknown-endpoint',
  DESTROYED: 'destroyed',
  PUBLISH_ON_IN: 'publish-on-in',
  SUBSCRIBE_ON_OUT: 'subscribe-on-out',
  ENDPOINT_DISCONNECTED: 'endpoint-disconnected',
});
