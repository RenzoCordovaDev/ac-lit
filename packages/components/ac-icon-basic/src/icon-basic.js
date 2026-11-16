import { LitElement, html, svg, nothing } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
// Authored in icon-basic.styles.scss, compiled to icon-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { IconBasicStyles } from './icon-basic.styles.js';

const SIZES = new Set(['sm', 'md', 'lg']);
const DEFAULT_SIZE = 'md';

// Set de íconos propio, mínimo, para el catálogo — mismo estilo visual que
// los íconos inline de ac-notification-basic (ver ICON_MAP/CLOSE_ICON en
// notification-basic.js): viewBox 24x24, fill none, stroke currentColor
// (heredado del `<svg>`, no de cada path/circle). `info`/`success`/`warning`/
// `danger` son deliberadamente idénticos a los de ac-notification-basic (ver
// docs/CONVENTIONS.md) para mantener consistencia visual exacta, no una
// reinterpretación.
//
// Importante: estos fragmentos van con la función `svg` de lit, NO `html`.
// Son `<path>`/`<circle>` sueltos, sin su propio `<svg>` envolvente (a
// diferencia de ICON_MAP/CLOSE_ICON de ac-notification-basic, que sí son un
// `<svg>` completo cada uno) -- con `html`, lit-html parsea el fragmento en
// un namespace HTML (nunca ven un `<svg>` ancestro en su propio template),
// así que el `<path>`/`<circle>` resultante queda en el namespace HTML
// (`http://www.w3.org/1999/xhtml`), no el de SVG, y el navegador no lo pinta
// aunque todos sus atributos estén bien -- aunque se inserte después como
// hijo de un `<svg>` real, los elementos no se re-asignan de namespace al
// moverse en el DOM. `svg` le dice a lit-html que clone el fragmento con el
// wrapper de namespace SVG correcto.
const ICON_MAP = {
  check: svg`<path d="M5 13l4 4L19 7" />`,
  close: svg`<path d="M6 6l12 12M18 6L6 18" />`,
  info: svg`<circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" />`,
  success: svg`<circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" />`,
  warning: svg`<path d="M12 4.5l9 15.5H3l9-15.5z" /><path d="M12 10.5v3.5M12 17v.01" />`,
  danger: svg`<circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16v.01" />`,
  'chevron-down': svg`<path d="M6 9l6 6 6-6" />`,
  'chevron-up': svg`<path d="M6 15l6-6 6 6" />`,
  'chevron-left': svg`<path d="M15 6l-6 6 6 6" />`,
  'chevron-right': svg`<path d="M9 6l6 6-6 6" />`,
  search: svg`<circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />`,
  menu: svg`<path d="M4 6h16M4 12h16M4 18h16" />`,
  'arrow-left': svg`<path d="M19 12H5M11 18l-6-6 6-6" />`,
  'arrow-right': svg`<path d="M5 12h14M13 6l6 6-6 6" />`,
};

// Fallback para cualquier `name` fuera de la whitelist de arriba — un círculo
// simple, el ícono nunca queda vacío/roto.
const FALLBACK_ICON = svg`<circle cx="12" cy="12" r="9" />`;

export class IconBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-icon-basic';
  }

  // componentBaseStyles primero: fija `font-family` (aunque acá no haya
  // texto propio, es la convención del catálogo, ver docs/CONVENTIONS.md) y
  // el skeleton de `loading` — no lo quites.
  static get styles() {
    return [componentBaseStyles, IconBasicStyles];
  }

  static get properties() {
    return {
      name: { type: String },
      size: { type: String, reflect: true },
      a11yLabel: { type: String, attribute: 'a11y-label' },
    };
  }

  constructor() {
    super();
    this.name = '';
    this.size = DEFAULT_SIZE;
    this.a11yLabel = '';
  }

  get _size() {
    return SIZES.has(this.size) ? this.size : DEFAULT_SIZE;
  }

  render() {
    const classes = `ac-icon-basic ac-icon-basic--${this._size}`;
    // Decorativo por defecto (sin `a11yLabel`): aria-hidden, igual criterio
    // que ICON_MAP de ac-notification-basic (el texto ya está al lado). Con
    // `a11yLabel` definido deja de ser decorativo: role="img" + aria-label.
    const label = this.a11yLabel ? this.t(this.a11yLabel) : '';

    return html`
      <svg
        part="icon"
        class=${classes}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        role=${label ? 'img' : nothing}
        aria-label=${label ? label : nothing}
        aria-hidden=${label ? nothing : 'true'}
      >
        ${ICON_MAP[this.name] ?? FALLBACK_ICON}
      </svg>
    `;
  }
}
