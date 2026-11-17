import { nothing } from 'lit';

/**
 * ApiSimulatorMixin - base mixin para los componentes `ac-api-*`: simuladores de
 * consumo de API sin UI (sin render), pensados para que otros componentes los
 * declaren en su `render()` e invoquen sus métodos públicos, igual que a
 * cualquier componente visual del catálogo.
 *
 * Da: `version`/`timeout`/`simulateError`, una latencia simulada (`_wait`), el
 * disparo de eventos con la convención acción+resultado del catálogo (`_emit`)
 * y un orquestador (`_simulateCall`) que cada método público usa para no
 * repetir el patrón "esperar → ¿falla? → emitir éxito/error".
 */
export const ApiSimulatorMixin = superClass =>
  class extends superClass {
    static get properties() {
      return {
        ...(super.properties || {}),
        version: { type: String, reflect: true },
        timeout: { type: Number },
        simulateError: { type: Boolean, attribute: 'simulate-error', reflect: true },
      };
    }

    constructor() {
      super();
      this.version = 'v1';
      this.timeout = 3000;
      this.simulateError = false;
    }

    /** Sin render: el componente nunca pinta nada, solo expone métodos y eventos. */
    render() {
      return nothing;
    }

    /** Latencia simulada; usa `this.timeout` salvo que se pase un override puntual. */
    _wait(ms = this.timeout) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    _emit(name, detail) {
      this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
    }

    /**
     * Orquesta una llamada simulada: espera `this.timeout`, y si `simulateError`
     * está activo dispara `errorEvent` y rechaza; si no, resuelve el mock vía
     * `resolveData()` y dispara `successEvent`.
     * @param {string} method - Nombre del método público que llama (para el detail del evento).
     * @param {unknown} params - Parámetros recibidos por ese método (para el detail del evento).
     * @param {object} options
     * @param {string} options.successEvent
     * @param {string} options.errorEvent
     * @param {() => unknown} options.resolveData - Construye el mock a devolver/emitir.
     * @param {string} [options.errorMessage] - Mensaje del error simulado.
     */
    async _simulateCall(method, params, { successEvent, errorEvent, resolveData, errorMessage }) {
      await this._wait();

      if (this.simulateError) {
        const error = { message: errorMessage || `Error simulado en ${method}`, method, params };
        this._emit(errorEvent, { method, params, error });
        throw error;
      }

      try {
        const data = resolveData();
        this._emit(successEvent, { method, params, data });
        return data;
      } catch (cause) {
        // `resolveData` también puede fallar por una razón de dominio (ej. "usuario
        // no existe" en el mock) — se emite por el mismo canal de error que el fallo
        // forzado por `simulateError`, así quien escucha no necesita distinguir el origen.
        const error = {
          message: cause?.message || errorMessage || `Error en ${method}`,
          method,
          params,
        };
        this._emit(errorEvent, { method, params, error });
        throw error;
      }
    }
  };
