/**
 * IntlMixin - internationalization for components backed by a `locales.json`
 * file. Keeps a global locale shared across every component instance, so
 * changing it anywhere updates the whole page.
 */

let globalLocale = 'es-PE';
const translationsCache = new Map();
const translationsRegistry = new Map();

export function registerTranslations(tagName, localesData) {
  if (typeof tagName !== 'string' || !tagName) return;
  translationsRegistry.set(tagName, localesData || {});
}

export function getRegisteredTranslations(tagName) {
  if (typeof tagName !== 'string' || !tagName) return undefined;
  return translationsRegistry.get(tagName);
}

export const IntlMixin = superClass =>
  class extends superClass {
    static get properties() {
      return {
        ...(super.properties || {}),
        locale: { type: String, reflect: true },
      };
    }

    constructor() {
      super();
      this.locale = globalLocale;
      this._translations = {};
      this._onLocaleChanged = e => {
        try {
          const newLocale = e && e.detail && e.detail.locale;
          if (newLocale && newLocale !== this.locale) {
            this.locale = newLocale;
            this.requestUpdate('locale');
          }
        } catch (_) {
          /* no-op: malformed locale-change event, keep current locale */
        }
      };
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('ac-locale-changed', this._onLocaleChanged);
      }
    }

    /** Load the translations object read from this component's `locales.json`. */
    loadTranslations(localesData) {
      this._translations = localesData || {};
      const cacheKey = this.constructor.name;
      translationsCache.set(cacheKey, this._translations);
    }

    /** Translate `key` for the current locale, interpolating `{param}` placeholders. */
    t(key, params = {}) {
      const translations =
        this._translations[this.locale] || this._translations[globalLocale] || {};
      let text = translations[key];

      if (!text) {
        return key;
      }

      Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
      });

      return text;
    }

    /** Set the locale globally, propagating the change to every mounted instance. */
    setLocale(locale) {
      if (this.constructor && typeof this.constructor.setGlobalLocale === 'function') {
        this.constructor.setGlobalLocale(locale);
      } else {
        const oldLocale = this.locale;
        globalLocale = locale;
        this.locale = locale;
        if (oldLocale !== locale) this.requestUpdate('locale', oldLocale);
      }
    }

    getLocale() {
      return this.locale;
    }

    static getGlobalLocale() {
      return globalLocale;
    }

    static setGlobalLocale(locale) {
      globalLocale = locale;
      try {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('ac-locale-changed', { detail: { locale } }));
        }
      } catch (_) {
        /* no-op: dispatch is best-effort outside a browser environment */
      }
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) super.disconnectedCallback();
      try {
        if (typeof window !== 'undefined' && window.removeEventListener) {
          window.removeEventListener('ac-locale-changed', this._onLocaleChanged);
        }
      } catch (_) {
        /* no-op */
      }
    }
  };
