import { LitElement, html } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
import { setGlobalLocale, getGlobalLocale } from '@ac-base/ac-intl-mixin';
// Authored in demo-content.styles.scss, compiled to demo-content.styles.js by
// `pnpm run build:styles` (scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm build` or `pnpm dev` to generate it.
import { DemoContentStyles } from './demo-content.styles.js';

const DEFAULT_SIZES = [320, 480, 768, 1024, 1440];
const MAX_SIZES = 5;
const MAX_EVENT_LOG_ENTRIES = 50;

function parseList(value) {
  return value
    ? value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
    : [];
}

/**
 * ac-demo-content: contenedor centralizado para demos de componentes.
 * Hijos: uno o más <ac-demo-case header="..." href="caso.html">. Controla,
 * para el caso activo: idioma (setGlobalLocale, reutiliza IntlMixin), ambient
 * (seteado directamente sobre los componentes del caso activo), modo
 * oscuro/claro (data-theme en <html>, ver @ac-base/ac-core), tamaño de
 * viewport (hasta 5 presets) y un panel de eventos escuchados en `document`.
 */
export class DemoContent extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-demo-content';
  }

  static get styles() {
    return [DemoContentStyles];
  }

  static get properties() {
    return {
      language: { type: String },
      ambients: { type: String },
      events: { type: String },
      sizes: { type: String },
      darkMode: { type: Boolean, reflect: true, attribute: 'dark-mode' },
      _activeCaseIndex: { state: true },
      _activeSize: { state: true },
      _theme: { state: true },
      _eventLog: { state: true },
    };
  }

  constructor() {
    super();
    this.language = '';
    this.ambients = '';
    this.events = '';
    this.sizes = '';
    this.darkMode = false;
    this._activeCaseIndex = 0;
    this._activeSize = null;
    this._theme = 'dark';
    this._eventLog = [];
    this._onEvent = this._onEvent.bind(this);
  }

  get _languages() {
    return parseList(this.language);
  }

  get _ambientOptions() {
    return parseList(this.ambients);
  }

  get _eventNames() {
    return parseList(this.events);
  }

  get _sizePresets() {
    const parsed = this.sizes
      ? this.sizes
          .split(',')
          .map(value => parseInt(value.trim(), 10))
          .filter(value => !Number.isNaN(value))
      : DEFAULT_SIZES;
    return parsed.slice(0, MAX_SIZES);
  }

  get _cases() {
    return Array.from(this.querySelectorAll(':scope > ac-demo-case'));
  }

  connectedCallback() {
    super.connectedCallback();
    for (const name of this._eventNames) {
      document.addEventListener(name, this._onEvent);
    }
  }

  disconnectedCallback() {
    for (const name of this._eventNames) {
      document.removeEventListener(name, this._onEvent);
    }
    super.disconnectedCallback();
  }

  firstUpdated() {
    this._activateCase(0);
  }

  _onEvent(event) {
    const entry = { time: new Date().toLocaleTimeString(), name: event.type, detail: event.detail };
    this._eventLog = [entry, ...this._eventLog].slice(0, MAX_EVENT_LOG_ENTRIES);
  }

  _activateCase(index) {
    const cases = this._cases;
    cases.forEach((caseEl, i) => {
      caseEl.active = i === index;
    });
    this._activeCaseIndex = index;
  }

  _onCaseChange(event) {
    this._activateCase(Number(event.target.value));
  }

  _onLanguageChange(event) {
    setGlobalLocale(event.target.value);
  }

  _onAmbientChange(event) {
    const value = event.target.value;
    const activeCase = this._cases[this._activeCaseIndex];
    if (!activeCase) return;

    for (const el of activeCase.querySelectorAll('*')) {
      if ('ambient' in el) {
        el.ambient = value;
      }
    }
  }

  _onThemeToggle() {
    this._theme = this._theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this._theme);
  }

  _onSizeChange(event) {
    const value = event.target.value;
    this._activeSize = value === 'full' ? null : Number(value);
  }

  render() {
    const cases = this._cases;

    return html`
      <div part="toolbar" class="ac-demo-content__toolbar">
        ${cases.length > 1 ? this._renderCaseSwitcher(cases) : ''}
        ${this._languages.length ? this._renderLanguageSwitcher() : ''}
        ${this._ambientOptions.length ? this._renderAmbientSwitcher() : ''}
        ${this.darkMode ? this._renderThemeToggle() : ''} ${this._renderSizeSwitcher()}
      </div>

      <div
        part="viewport"
        class="ac-demo-content__viewport"
        style=${this._activeSize ? `max-width: ${this._activeSize}px` : ''}
      >
        <slot></slot>
      </div>

      ${this._eventNames.length ? this._renderEventLog() : ''}
    `;
  }

  _renderCaseSwitcher(cases) {
    return html`
      <label class="ac-demo-content__field">
        Caso
        <select class="ac-demo-content__case-select" @change=${this._onCaseChange}>
          ${cases.map(
            (caseEl, i) => html`
              <option value=${i} ?selected=${i === this._activeCaseIndex}>
                ${caseEl.header || `Caso ${i + 1}`}
              </option>
            `,
          )}
        </select>
      </label>
    `;
  }

  _renderLanguageSwitcher() {
    const current = getGlobalLocale();
    return html`
      <label class="ac-demo-content__field">
        Locale
        <select class="ac-demo-content__locale-select" @change=${this._onLanguageChange}>
          ${this._languages.map(
            locale =>
              html`<option value=${locale} ?selected=${locale === current}>${locale}</option>`,
          )}
        </select>
      </label>
    `;
  }

  _renderAmbientSwitcher() {
    return html`
      <label class="ac-demo-content__field">
        Ambient
        <select class="ac-demo-content__ambient-select" @change=${this._onAmbientChange}>
          ${this._ambientOptions.map(ambient => html`<option value=${ambient}>${ambient}</option>`)}
        </select>
      </label>
    `;
  }

  _renderThemeToggle() {
    return html`
      <button
        part="theme-toggle"
        class="ac-demo-content__theme-toggle"
        @click=${this._onThemeToggle}
      >
        ${this._theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      </button>
    `;
  }

  _renderSizeSwitcher() {
    return html`
      <label class="ac-demo-content__field">
        Tamaño
        <select class="ac-demo-content__size-select" @change=${this._onSizeChange}>
          <option value="full">100%</option>
          ${this._sizePresets.map(size => html`<option value=${size}>${size}px</option>`)}
        </select>
      </label>
    `;
  }

  _renderEventLog() {
    return html`
      <div part="event-log" class="ac-demo-content__event-log">
        ${this._eventLog.map(
          entry => html`<div>[${entry.time}] ${entry.name}: ${JSON.stringify(entry.detail)}</div>`,
        )}
      </div>
    `;
  }
}
