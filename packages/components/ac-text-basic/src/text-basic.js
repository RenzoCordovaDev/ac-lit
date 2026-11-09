import { LitElement, html } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
// Authored in text-basic.styles.scss, compiled to text-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { TextBasicStyles } from './text-basic.styles.js';

// Lista blanca: `tag` termina dentro de un template estático (`unsafeStatic`),
// así que NUNCA se acepta un valor arbitrario.
const ALLOWED_TAGS = new Set([
  'span',
  'p',
  'div',
  'strong',
  'em',
  'small',
  'label',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]);
const SIZES = new Set(['sm', 'md', 'lg']);
const TRANSLATIONS_CHANGED_EVENT = 'ac-text-basic-translations-changed';

// Traducciones de la aplicación, compartidas por todas las instancias:
// { 'es-PE': { clave: 'texto' }, 'en-EN': { ... } }.
const appTranslations = new Map();

/**
 * Registra (mezcla) las traducciones de la aplicación para `ac-text-basic`.
 * Misma forma que `locales.json`: `{ 'es-PE': { clave: 'texto' }, ... }`.
 * Las instancias ya montadas se actualizan solas.
 */
export function addTextTranslations(localesData = {}) {
  for (const [locale, entries] of Object.entries(localesData)) {
    appTranslations.set(locale, { ...appTranslations.get(locale), ...entries });
  }
  window.dispatchEvent(new CustomEvent(TRANSLATIONS_CHANGED_EVENT));
}

function interpolate(template, params = {}) {
  return Object.entries(params).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    template,
  );
}

export class TextBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-text-basic';
  }

  static get styles() {
    return [TextBasicStyles];
  }

  static get properties() {
    return {
      text: { type: String },
      params: { type: Object },
      translations: { type: Object },
      tag: { type: String },
      size: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.text = '';
    this.params = {};
    this.translations = {};
    this.tag = 'span';
    this.size = 'md';
    this.ambient = 'default';
    this._onTranslationsChanged = () => this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(TRANSLATIONS_CHANGED_EVENT, this._onTranslationsChanged);
  }

  disconnectedCallback() {
    window.removeEventListener(TRANSLATIONS_CHANGED_EVENT, this._onTranslationsChanged);
    super.disconnectedCallback();
  }

  get _tag() {
    return ALLOWED_TAGS.has(this.tag) ? this.tag : 'span';
  }

  get _size() {
    return SIZES.has(this.size) ? this.size : 'md';
  }

  /**
   * Orden de resolución de `key`: propiedad `translations` de la instancia,
   * traducciones de la aplicación (`addTextTranslations`), `locales.json` del
   * componente. Si ninguna la tiene, se muestra la propia `key` (el literal).
   */
  _translate(key) {
    const template =
      this.translations?.[this.locale]?.[key] ?? appTranslations.get(this.locale)?.[key];

    return template === undefined ? this.t(key, this.params) : interpolate(template, this.params);
  }

  render() {
    const tag = unsafeStatic(this._tag);
    const classes = `ac-text-basic ac-text--${this.ambient} ac-text--${this._size}`;

    return staticHtml`<${tag} part="root" class=${classes}>${
      this.text ? this._translate(this.text) : html`<slot></slot>`
    }</${tag}>`;
  }
}
