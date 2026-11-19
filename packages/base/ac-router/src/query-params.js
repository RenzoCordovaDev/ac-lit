/**
 * Convierte una query string a un objeto plano. Acepta la query string con o
 * sin el "?" inicial: si viene con "?", se quita explícitamente antes de
 * delegar en `URLSearchParams`. Si una clave aparece varias veces, `Object.fromEntries`
 * se queda con el último valor. Un valor vacío, `undefined` o `null` devuelve
 * un objeto vacío y nunca lanza.
 * @param {string} queryString - Ej. "foo=bar&baz=1", "?foo=bar", o "" (vacío).
 * @returns {Object<string, string>}
 */
export function parseQuery(queryString) {
  if (!queryString) {
    return {};
  }
  const normalized = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  return Object.fromEntries(new URLSearchParams(normalized));
}

/**
 * Convierte un objeto plano de parámetros a una query string, SIN el "?" inicial.
 * Cada valor se convierte a string antes de pasarlo a `URLSearchParams`, así los
 * números y booleanos no producen "[object Object]" ni se pierden. Un objeto vacío,
 * `undefined` o `null` devuelve "" y nunca lanza.
 * @param {Object<string, string|number|boolean>} queryObject
 * @returns {string} - Ej. "foo=bar&baz=1", o "" si el objeto está vacío/es undefined.
 */
export function stringifyQuery(queryObject) {
  if (!queryObject) {
    return '';
  }
  const entries = Object.entries(queryObject).map(([key, value]) => [key, String(value)]);
  return new URLSearchParams(entries).toString();
}
