import { html } from 'lit';
import DOMPurify from 'dompurify';
import { IntlMixin, getRegisteredTranslations } from '@ac-base/ac-intl-mixin';
import { ScopedElementsMixin } from '@ac-base/ac-scoped-elements-mixin';

/**
 * ComponentMixin - base mixin every ac-lit component extends.
 * Combines IntlMixin + ScopedElementsMixin and adds: ambient/mode/loading
 * properties, HTML sanitization (DOMPurify) and a default loading skeleton.
 */
export const ComponentMixin = superClass =>
  class extends IntlMixin(ScopedElementsMixin(superClass)) {
    static get properties() {
      return {
        ...(super.properties || {}),
        ambient: { type: String, reflect: true },
        mode: { type: String, reflect: true },
        loading: { type: Boolean, reflect: true },
        loadingA11yLabel: { type: String, attribute: 'loading-a11y-label' },
        mediaRangeConfig: { type: Object, attribute: 'media-range-config' },
      };
    }

    constructor() {
      super();
      this.ambient = 'light';
      this.mode = 'default';
      this.loading = false;
      this.loadingA11yLabel = 'Loading...';
      this.mediaRangeConfig = {};

      this._loadRegisteredTranslations();
      this._ensureCompatibility();
    }

    _loadRegisteredTranslations() {
      if (this._translations && Object.keys(this._translations).length > 0) {
        return;
      }

      const tagName = this.constructor.is;
      const registered = getRegisteredTranslations(tagName);
      if (registered && typeof registered === 'object') {
        this.loadTranslations(registered);
      }
    }

    /** Extension point for runtime compatibility shims (e.g. iOS Safari <= 16). */
    _ensureCompatibility() {
      if (!window.customElements) {
        console.warn('Custom Elements not supported');
      }
    }

    /**
     * Sanitize untrusted HTML with DOMPurify before rendering it with `unsafeHTML`.
     * @param {string} content - Raw HTML to sanitize.
     * @param {string[]|null} allowedTags - Restrict to this tag allow-list (DOMPurify `ALLOWED_TAGS`).
     * @param {(tagName: string) => boolean|null} tagNameCheck - Extra per-tag predicate; tags failing it are stripped.
     * @returns {string} Sanitized HTML, safe to render.
     */
    sanitizeHtml(content, allowedTags = null, tagNameCheck = null) {
      const config = allowedTags ? { ALLOWED_TAGS: allowedTags } : {};

      if (typeof tagNameCheck !== 'function') {
        return DOMPurify.sanitize(content ?? '', config);
      }

      const hook = (node, data) => {
        if (node.nodeType === Node.ELEMENT_NODE && !tagNameCheck(data.tagName)) {
          node.remove();
        }
      };
      DOMPurify.addHook('uponSanitizeElement', hook);
      try {
        return DOMPurify.sanitize(content ?? '', config);
      } finally {
        DOMPurify.removeHook('uponSanitizeElement', hook);
      }
    }

    /** Default loading state, rendered while `loading` is true. Override to customize. */
    get _skeletonTemplate() {
      return html`
        <div class="skeleton-loader" aria-label="${this.loadingA11yLabel}">
          <div class="skeleton-content">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
          </div>
        </div>
      `;
    }

    static scopedElementsFromClasses(classes) {
      return super.scopedElementsFromClasses(classes);
    }

    /**
     * Load translations from a `locales.json` file.
     * Prefers translations already registered at build time; falls back to
     * fetching `locales.json` from a handful of common relative paths.
     */
    async loadLocalesFromFile(localesPath = null) {
      if (Object.keys(this._translations).length > 0) {
        return;
      }

      this._loadRegisteredTranslations();
      if (Object.keys(this._translations).length > 0) {
        this.requestUpdate();
        return;
      }

      const paths = localesPath
        ? [localesPath]
        : ['/locales.json', './locales.json', '../locales.json', '../../locales.json'];

      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            const localesData = await response.json();
            this.loadTranslations(localesData);
            this.requestUpdate();
            await this.updateComplete;
            return;
          }
        } catch (_) {
          // try the next candidate path; locales.json is optional
        }
      }
    }

    async _loadLocalesAutomatically() {
      if (Object.keys(this._translations).length > 0) {
        return;
      }
      await this.loadLocalesFromFile().catch(() => {});
    }

    connectedCallback() {
      super.connectedCallback();
      this._loadLocalesAutomatically();
    }
  };
