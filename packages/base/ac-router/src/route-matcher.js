/**
 * Separa un path en sus segmentos no vacíos. Los strings vacíos (producidos
 * por la barra inicial, por barras dobles o por la barra final) se descartan,
 * así que `/` produce 0 segmentos y `/usuarios/` produce 1.
 * @param {string} path - Path que empieza con "/".
 * @returns {string[]} Segmentos no vacíos, en orden.
 */
function splitSegments(path) {
  return path.split('/').filter(segment => segment !== '');
}

/**
 * Compila una definición de ruta ({ path, name }) en una forma lista para
 * matchear: separa el `path` en segmentos y marca cuáles son dinámicos
 * (prefijo `:`).
 * @param {{path: string, name: string}} route
 * @returns {{name: string, segments: Array<{dynamic: boolean, value: string}>}}
 */
export function compileRoute(route) {
  const segments = splitSegments(route.path).map(segment => {
    if (segment.startsWith(':')) {
      return { dynamic: true, value: segment.slice(1) };
    }
    return { dynamic: false, value: segment };
  });
  return { name: route.name, segments };
}

/**
 * Busca, en orden, la primera ruta compilada cuyo shape de segmentos
 * coincide con `path` (misma cantidad de segmentos; un segmento dinámico
 * matchea cualquier valor no vacío, un segmento estático debe ser idéntico).
 * El primer match gana: no se busca una ruta "mejor" más adelante.
 * @param {Array<{name: string, segments: Array<{dynamic: boolean, value: string}>}>} compiledRoutes
 * @param {string} path - Ya normalizado (empieza con "/", sin query string, sin "/" final salvo raíz).
 * @returns {{matched: true, name: string, params: Object<string, string>} | {matched: false}}
 */
export function matchRoutes(compiledRoutes, path) {
  const pathSegments = splitSegments(path);

  for (const compiledRoute of compiledRoutes) {
    if (compiledRoute.segments.length !== pathSegments.length) {
      continue;
    }

    const params = {};
    let matches = true;

    for (let i = 0; i < compiledRoute.segments.length; i++) {
      const segment = compiledRoute.segments[i];
      const value = pathSegments[i];

      // Un valor vacío nunca matchea: en la práctica no ocurre porque
      // splitSegments ya descartó los vacíos, pero se deja explícito.
      if (value === '') {
        matches = false;
        break;
      }

      if (segment.dynamic) {
        params[segment.value] = value;
      } else if (segment.value !== value) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return { matched: true, name: compiledRoute.name, params };
    }
  }

  return { matched: false };
}
