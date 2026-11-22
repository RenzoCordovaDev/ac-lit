import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
// Dependencia real del catálogo (no devDependency): se registra como efecto
// de importar su `index.js` — mismo patrón que `ac-profile-card-basic` con
// `ac-text-basic`/`ac-avatar-basic`/`ac-badge-basic`/`ac-button-basic` (ver
// "Dependencias entre componentes del catálogo" en docs/CONVENTIONS.md).
import '@ac-components/ac-text-basic';

import { AmountBasicStyles } from './amount-basic.styles.js';

// Fallback seguro: si `currency` no es un código ISO 4217 que
// `Intl.NumberFormat` reconozca, reintenta con esta moneda (mismo patrón
// "whitelist con fallback seguro" que ALLOWED_TYPES/_type de ac-input-basic
// o ICON_MAP/FALLBACK_ICON de ac-icon-basic).
const DEFAULT_CURRENCY = 'PEN';

export class AmountBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-amount-basic';
  }

  static get styles() {
    return [componentBaseStyles, AmountBasicStyles];
  }

  static get properties() {
    return {
      amount: { type: Number },
      currency: { type: String },
      size: { type: String },
      tag: { type: String },
    };
  }

  constructor() {
    super();
    this.amount = 0;
    this.currency = DEFAULT_CURRENCY;
    // Passthrough hacia el `ac-text-basic` interno: mismos valores/defaults
    // que expone ese componente.
    this.size = 'md';
    this.tag = 'span';
    // `ac-text-basic` no define estilo propio para el ambient heredado de
    // ComponentMixin ('light'); 'default' es el que de verdad estila.
    this.ambient = 'default';
  }

  /**
   * Monto formateado como moneda en `this.locale` (de IntlMixin, parte de
   * ComponentMixin). Un `currency` inválido/no soportado hace que
   * `Intl.NumberFormat` lance — se reintenta con `DEFAULT_CURRENCY`.
   */
  get _formattedAmount() {
    try {
      return new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: this.currency,
      }).format(this.amount);
    } catch (_error) {
      return new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: DEFAULT_CURRENCY,
      }).format(this.amount);
    }
  }

  render() {
    // El texto ya formateado se pasa como contenido del slot por defecto
    // (luz, no shadow) de `ac-text-basic` — NUNCA vía su propiedad `text`,
    // que trata el valor como clave de traducción (this.t(key)).
    return html`<ac-text-basic part="root" size=${this.size} tag=${this.tag} ambient=${this.ambient}
      >${this._formattedAmount}</ac-text-basic
    >`;
  }
}
