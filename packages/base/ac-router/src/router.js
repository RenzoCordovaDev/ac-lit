import { RouterError } from './router-error.js';
import { ROUTER_ERROR_CODES } from './router-error-codes.js';
import { compileRoute, matchRoutes } from './route-matcher.js';
import { parseQuery, stringifyQuery } from './query-params.js';

/**
 * Crea una instancia nueva e independiente de Router a partir de un array de
 * rutas. Nunca se comparte una instancia global entre distintas aplicaciones
 * que usen este paquete -- cada una debe llamar a `createRouter()` la suya propia.
 * @param {Array<{path: string, name: string}>} routes - En el orden en que deben matchearse (primer match gana).
 * @returns {Router}
 * @throws {RouterError} INVALID_ROUTES si `routes` está vacío o alguna ruta no tiene `path`/`name` válidos.
 */
export function createRouter(routes) {
  return new Router(routes);
}

/**
 * Enrutador vanilla por hash (`#/segmento/:param`), sin dependencias en
 * runtime. Resuelve la ruta actual al crearse (sin esperar el primer
 * `hashchange`), notifica a quien se suscriba en cada cambio, y permite
 * navegar por path literal o por nombre de ruta + parámetros.
 */
class Router {
  #routesByName = new Map();
  #compiledRoutes;
  #subscribers = new Set();
  #current;
  #destroyed = false;
  #suppressNextHashChange = false;

  /**
   * @param {Array<{path: string, name: string}>} routes
   */
  constructor(routes) {
    if (!Array.isArray(routes) || routes.length === 0) {
      throw new RouterError(
        ROUTER_ERROR_CODES.INVALID_ROUTES,
        'createRouter() necesita un array de rutas no vacío.',
      );
    }
    for (const route of routes) {
      const validPath = typeof route?.path === 'string' && route.path.startsWith('/');
      const validName = typeof route?.name === 'string' && route.name.trim() !== '';
      if (!validPath || !validName) {
        throw new RouterError(
          ROUTER_ERROR_CODES.INVALID_ROUTES,
          'Cada ruta necesita un "path" que empiece con "/" y un "name" no vacío.',
          { route },
        );
      }
      this.#routesByName.set(route.name, route);
    }
    this.#compiledRoutes = routes.map(compileRoute);
    this.#current = this.#resolve();
    window.addEventListener('hashchange', this.#handleHashChange);
  }

  /**
   * La ruta actual, ya resuelta: `{ matched, name, path, params, query }`.
   * Si ninguna ruta registrada matchea el hash actual, `matched` es `false`
   * y `name` es `undefined` -- el consumidor decide el fallback.
   * @returns {{matched: boolean, name: string|undefined, path: string, params: Object<string,string>, query: Object<string,string>}}
   */
  get current() {
    this.#assertAlive();
    return this.#current;
  }

  /**
   * Se suscribe a los cambios de ruta. NO se llama de inmediato con la ruta
   * actual -- leé `router.current` una vez para el estado inicial.
   * @param {(route: ReturnType<Router['current']['constructor']>) => void} callback
   * @returns {() => void} Función para cancelar esta suscripción puntual.
   */
  subscribe(callback) {
    this.#assertAlive();
    this.#subscribers.add(callback);
    return () => {
      this.#subscribers.delete(callback);
    };
  }

  /**
   * Navega a un path literal (`'/usuarios/42'`) o a una ruta por nombre
   * (`{ name, params, query }`, arma el path sustituyendo los `:param`).
   * Actualiza `location.hash` y notifica a los suscriptores de inmediato
   * (no depende de que el navegador dispare `hashchange` primero).
   * @param {string | {name: string, params?: Object<string,string>, query?: Object<string,string>}} target
   * @throws {RouterError} UNKNOWN_ROUTE_NAME si `target.name` no está registrado.
   * @throws {RouterError} MISSING_PARAM si falta un `:param` requerido por la ruta.
   */
  navigate(target) {
    this.#assertAlive();
    const hash = `#${this.#buildHash(target)}`;
    this.#suppressNextHashChange = hash !== location.hash;
    location.hash = hash;
    this.#applyHash();
  }

  /**
   * Saca el listener de `hashchange` y libera las suscripciones. Cualquier
   * operación posterior lanza `RouterError(DESTROYED)`.
   */
  destroy() {
    window.removeEventListener('hashchange', this.#handleHashChange);
    this.#subscribers.clear();
    this.#destroyed = true;
  }

  #handleHashChange = () => {
    if (this.#suppressNextHashChange) {
      this.#suppressNextHashChange = false;
      return;
    }
    this.#applyHash();
  };

  #applyHash() {
    this.#current = this.#resolve();
    for (const callback of [...this.#subscribers]) {
      callback(this.#current);
    }
  }

  #buildHash(target) {
    if (typeof target === 'string') {
      return target;
    }
    const route = this.#routesByName.get(target.name);
    if (!route) {
      throw new RouterError(
        ROUTER_ERROR_CODES.UNKNOWN_ROUTE_NAME,
        `No existe ninguna ruta registrada con name "${target.name}".`,
        { name: target.name },
      );
    }
    const params = target.params ?? {};
    const path = route.path
      .split('/')
      .map(segment => {
        if (!segment.startsWith(':')) return segment;
        const key = segment.slice(1);
        const value = params[key];
        if (value === undefined || value === null || value === '') {
          throw new RouterError(
            ROUTER_ERROR_CODES.MISSING_PARAM,
            `Falta el parámetro ":${key}" para navegar a "${target.name}".`,
            { name: target.name, param: key },
          );
        }
        return String(value);
      })
      .join('/');
    const query = target.query ? `?${stringifyQuery(target.query)}` : '';
    return `${path}${query}`;
  }

  #resolve() {
    const raw = location.hash.replace(/^#/, '');
    const [pathPart, queryPart = ''] = raw.split('?');
    const path = pathPart === '' ? '/' : decodeURIComponent(pathPart);
    const query = parseQuery(queryPart);
    const result = matchRoutes(this.#compiledRoutes, path);
    if (!result.matched) {
      return { matched: false, name: undefined, path, params: {}, query };
    }
    return { matched: true, name: result.name, path, params: result.params, query };
  }

  #assertAlive() {
    if (this.#destroyed) {
      throw new RouterError(
        ROUTER_ERROR_CODES.DESTROYED,
        'Esta instancia de router ya fue destruida.',
      );
    }
  }
}
