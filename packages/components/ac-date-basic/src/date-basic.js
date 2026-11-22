import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
// Dependencia real del catálogo (no devDependency): se registra como efecto
// de importar su `index.js` — mismo patrón que `ac-icon-button-basic` con
// `ac-icon-basic` o `ac-profile-card-basic` con `ac-text-basic`/etc. (ver
// "Dependencias entre componentes del catálogo" en docs/CONVENTIONS.md).
import '@ac-components/ac-text-basic';
// Authored in date-basic.styles.scss, compiled to date-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { DateBasicStyles } from './date-basic.styles.js';

// Lista blanca con fallback (mismo patrón que `ALLOWED_TYPES`/`_type` de
// `ac-input-basic` o `ICON_MAP`/`FALLBACK_ICON` de `ac-icon-basic`): un
// `type` fuera de la lista cae al valor por defecto, nunca se usa tal cual.
const ALLOWED_TYPES = new Set(['short', 'long']);
const DEFAULT_TYPE = 'short';

export class DateBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-date-basic';
  }

  // componentBaseStyles primero: fija `font-family` y el skeleton de
  // `loading` compartidos, convención del catálogo (ver docs/CONVENTIONS.md).
  static get styles() {
    return [componentBaseStyles, DateBasicStyles];
  }

  static get properties() {
    return {
      value: { type: String },
      type: { type: String },
      format: { type: String },
      size: { type: String },
      tag: { type: String },
    };
  }

  constructor() {
    super();
    this.value = '';
    this.type = DEFAULT_TYPE;
    this.format = '';
    this.size = 'md';
    this.tag = 'span';
    // `ac-text-basic` no define estilo propio para el ambient heredado de
    // ComponentMixin ('light'); 'default' es el que de verdad estila.
    this.ambient = 'default';
  }

  get _type() {
    return ALLOWED_TYPES.has(this.type) ? this.type : DEFAULT_TYPE;
  }

  /**
   * Reemplazo de tokens simple y manual (NO un formateo locale-aware como
   * `Intl.DateTimeFormat` — ver README): soporta `YYYY` (año, 4 dígitos),
   * `MM` (mes, 01-12) y `DD` (día, 01-31), con los getters nativos de `Date`.
   *
   * Usa los getters UTC (`getUTCFullYear`/`getUTCMonth`/`getUTCDate`), no los
   * locales: un `value` de solo fecha (ej. `'2026-11-22'`, sin hora) lo
   * parsea `new Date()` como medianoche UTC — leerlo con los getters locales
   * desplaza el día en cualquier zona horaria con offset negativo (ej.
   * América), mostrando `'21'` en vez de `'22'`. Con los getters UTC el
   * token coincide siempre con la fecha literal del `value` recibido.
   */
  _formatWithTokens(date) {
    const year = String(date.getUTCFullYear()).padStart(4, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return this.format.replaceAll('YYYY', year).replaceAll('MM', month).replaceAll('DD', day);
  }

  get _formatted() {
    const date = new Date(this.value);

    // Fallback seguro: un `value` que no parsea a una fecha válida muestra
    // el valor crudo tal cual, sin intentar formatear — no se pierde
    // información silenciosamente.
    if (Number.isNaN(date.getTime())) {
      return this.value;
    }

    if (this.format) {
      return this._formatWithTokens(date);
    }

    return new Intl.DateTimeFormat(this.locale, { dateStyle: this._type }).format(date);
  }

  render() {
    // `ac-text-basic` recibe el texto YA FORMATEADO como contenido del slot
    // por defecto (luz, no shadow) — nunca por su propiedad `text`, que trata
    // el valor como CLAVE DE TRADUCCIÓN (`this.t(key)`), no como texto final.
    return html`<ac-text-basic part="root" size=${this.size} tag=${this.tag} ambient=${this.ambient}
      >${this._formatted}</ac-text-basic
    >`;
  }
}
