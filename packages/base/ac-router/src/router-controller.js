import { RouterError } from './router-error.js';
import { ROUTER_ERROR_CODES } from './router-error-codes.js';

/**
 * Reactive Controller de Lit que conecta un host al ciclo de vida de un
 * router. Nunca crea una instancia de Router por su cuenta -- siempre recibe
 * una ya existente vía `config.router` (creada una sola vez por aplicación
 * con `createRouter()`). Expone `controller.route`, siempre al día, para que
 * el host la lea directo en su `render()`.
 */
export class RouterController {
  #router;
  #host;
  #onChange;
  #unsubscribe;

  /**
   * @param {import('lit').ReactiveControllerHost} host
   * @param {Object} config
   * @param {Object} config.router - Instancia devuelta por `createRouter()`.
   * @param {(route: Object) => void} [config.onChange] - Callback opcional, llamado en cada cambio de ruta.
   */
  constructor(host, { router, onChange } = {}) {
    if (!router) {
      throw new RouterError(
        ROUTER_ERROR_CODES.INVALID_ROUTES,
        'RouterController necesita una instancia de Router existente en `config.router` -- nunca crea una propia.',
      );
    }
    this.#router = router;
    this.#host = host;
    this.#onChange = onChange;
    this.route = router.current;
    host.addController(this);
  }

  /**
   * Toma la ruta actual y se suscribe a los cambios siguientes.
   */
  hostConnected() {
    this.route = this.#router.current;
    this.#unsubscribe = this.#router.subscribe(route => {
      this.route = route;
      this.#onChange?.(route);
      this.#host.requestUpdate();
    });
  }

  /**
   * Cancela la suscripción al router.
   */
  hostDisconnected() {
    this.#unsubscribe?.();
    this.#unsubscribe = undefined;
  }

  /**
   * Navega por el router subyacente. Atajo de conveniencia, no agrega estado
   * propio -- equivalente a llamar directamente a `router.navigate(target)`.
   * @param {string | {name: string, params?: Object, query?: Object}} target
   */
  navigate(target) {
    this.#router.navigate(target);
  }
}
