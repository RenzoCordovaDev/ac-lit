import { ChannelController } from '@ac-base/ac-ccp';
import { css } from 'lit';

/**
 * Estilos base que comparten todas las páginas de esta app: `static get styles()`
 * devuelve `[pageBaseStyles, css`...`]`. `.page` es el contenedor principal del
 * contenido (espaciado vertical consistente); `.page-actions` agrupa enlaces/botones en fila.
 */
export const pageBaseStyles = css`
  :host {
    display: block;
    line-height: 1.5;
  }

  .page {
    display: flex;
    flex-direction: column;
    gap: var(--space-4, 1.5rem);
  }

  .page-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3, 1rem);
    align-items: center;
  }

  .icon-row {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
  }

  ac-card-basic::part(body) {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 0.5rem);
  }

  ac-badge-basic {
    align-self: flex-start;
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
 * 2. Sobreescribir `setupChannels()` y ahí llamar a `this.connectionOut(...)`/`this.connectionIn(...)`.
 *
 * `setupChannels()` se llama una sola vez, en `firstUpdated()` -- funciona
 * porque `src/app.js` le asigna `ccp` a TODAS las páginas de entrada, antes
 * de que cualquiera de ellas renderice por primera vez. Nunca hace falta
 * declarar `ccp` a mano ni crear `ChannelController` directamente.
 */
export const PageMixin = superClass =>
  class extends superClass {
    static get properties() {
      return {
        ...(super.properties || {}),
        ccp: { attribute: false },
      };
    }

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

    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      if (this.ccp) {
        this.setupChannels();
      }
    }
  };
