import { ChannelController } from '@ac-base/ac-ccp';
import { css } from 'lit';

/**
 * Estilos base que comparten todas las páginas de esta app: `static get styles()`
 * devuelve `[pageBaseStyles, css`...`]` en vez de repetir el mismo bloque
 * `:host { display: block; line-height: 1.5; }` en cada página.
 */
export const pageBaseStyles = css`
  :host {
    display: block;
    line-height: 1.5;
  }
`;

/**
 * PageMixin — mixin base para las páginas de esta app. Resuelve la property
 * `ccp` (se inyecta una sola vez desde `src/app.js`, la página nunca crea la
 * suya propia) y reduce publicar/suscribirse a un canal de `@ac-base/ac-ccp`
 * a dos métodos: `connectionOut(nombre, opciones)` / `connectionIn(nombre, onPayload, opciones)`.
 *
 * Una página que necesita canales solo tiene que:
 * 1. Extender `PageMixin(LitElement)`.
 * 2. Sobreescribir `setupChannels()` y ahí llamar a `this.connectionOut(...)`/`this.connectionIn(...)`
 *    -- se llama una sola vez, automáticamente, en cuanto `ccp` está disponible.
 *
 * Nunca hace falta declarar `ccp` a mano, escribir `willUpdate`, ni crear
 * `ChannelController` directamente.
 */
export const PageMixin = superClass =>
  class extends superClass {
    static get properties() {
      return {
        ...(super.properties || {}),
        ccp: { attribute: false },
      };
    }

    #canalesListos = false;

    constructor() {
      super();
      this.ccp = undefined;
    }

    /**
     * Punto de extensión: sobreescribir para registrar canales con
     * `this.connectionOut(...)`/`this.connectionIn(...)`. No hace nada por defecto.
     */
    setupChannels() {}

    /**
     * Crea un canal de salida y devuelve una función lista para publicar,
     * sin exponer el `ChannelController`.
     * @param {string} name - Nombre del canal.
     * @param {{retain?: boolean}} [options]
     * @returns {(payload: *, metadata?: Object) => void}
     */
    connectionOut(name, { retain = false } = {}) {
      const controller = new ChannelController(this, { ccp: this.ccp, name, direction: 'out', retain });
      return (payload, metadata) => controller.publish(payload, metadata);
    }

    /**
     * Se suscribe a un canal de entrada. `onPayload` recibe el payload ya
     * desenvuelto (no el `message` completo de `ChannelController`).
     * @param {string} name - Nombre del canal.
     * @param {(payload: *) => void} onPayload
     * @param {{replay?: boolean}} [options]
     */
    connectionIn(name, onPayload, { replay = true } = {}) {
      new ChannelController(this, {
        ccp: this.ccp,
        name,
        direction: 'in',
        replay,
        onMessage: message => onPayload(message.payload),
      });
    }

    willUpdate(changedProperties) {
      if (changedProperties.has('ccp') && this.ccp && !this.#canalesListos) {
        this.#canalesListos = true;
        this.setupChannels();
      }
      super.willUpdate(changedProperties);
    }
  };
