/**
 * Códigos de error de Router (`@ac-base/ac-router`). Centralizados acá
 * para que cualquier consumidor pueda distinguir el tipo de fallo por `code`
 * sin parsear el mensaje.
 * @type {Object<string, string>}
 */
export const ROUTER_ERROR_CODES = Object.freeze({
  /** El array de rutas pasado a `createRouter()` está vacío o mal formado. */
  INVALID_ROUTES: 'invalid-routes',
  /** Se llamó a `navigate({ name })` con un nombre que no corresponde a ninguna ruta registrada. */
  UNKNOWN_ROUTE_NAME: 'unknown-route-name',
  /** Se llamó a `navigate({ name, params })` pero falta un `:param` que la ruta requiere. */
  MISSING_PARAM: 'missing-param',
  /** Cualquier operación sobre una instancia de router ya destruida con `destroy()`. */
  DESTROYED: 'destroyed',
});
