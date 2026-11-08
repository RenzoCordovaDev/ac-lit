import { LitElement, html } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
import { setGlobalLocale } from '@ac-base/ac-intl-mixin';
// Authored in demo-content.styles.scss, compiled to demo-content.styles.js by
// `pnpm run build:styles` (scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm build` or `pnpm dev` to generate it.
import { DemoContentStyles } from './demo-content.styles.js';

const DEVICE_PRESETS = [
  { key: 'mobile', label: 'Móvil', width: 375 },
  { key: 'tablet', label: 'Tablet', width: 768 },
  { key: 'desktop', label: 'Desktop', width: 1280 },
];
const MAX_EVENT_LOG_ENTRIES = 50;

function parseList(value) {
  return value
    ? value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
    : [];
}

function languageLabel(localeCode) {
  return localeCode.split('-')[0].toUpperCase();
}

/**
 * ac-demo-content: contenedor centralizado para demos de componentes.
 * Hijos: uno o más <ac-demo-case header="..." href="caso.html">. Controla,
 * para el caso activo: idioma (switch de 2 opciones, reusa setGlobalLocale de
 * IntlMixin), ambient (seteado directamente sobre los componentes del caso
 * activo), modo claro/oscuro (data-theme en <html>, claro por defecto — ver
 * @ac-base/ac-core), tamaño de dispositivo (móvil/tablet/desktop, con marco
 * visual según el tipo) y un botón de eventos que abre un modal con el
 * detalle de lo escuchado en `document`.
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
      darkMode: { type: Boolean, reflect: true, attribute: 'dark-mode' },
      _activeCaseIndex: { state: true },
      _activeDevice: { state: true },
      _langIndex: { state: true },
      _theme: { state: true },
      _eventLog: { state: true },
      _eventModalOpen: { state: true },
    };
  }

  constructor() {
    super();
    this.language = '';
    this.ambients = '';
    this.events = '';
    this.darkMode = false;
    this._activeCaseIndex = 0;
    this._activeDevice = 'mobile';
    this._langIndex = 0;
    this._theme = 'light';
    this._eventLog = [];
    this._eventModalOpen = false;
    this._onEvent = this._onEvent.bind(this);
    this._onModalKeydown = this._onModalKeydown.bind(this);
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
    document.removeEventListener('keydown', this._onModalKeydown);
    super.disconnectedCallback();
  }

  firstUpdated() {
    this._activateCase(0);
    document.documentElement.setAttribute('data-theme', this._theme);
    if (this._languages.length === 2) {
      setGlobalLocale(this._languages[this._langIndex]);
    }
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

  _onLanguageToggle() {
    this._langIndex = this._langIndex === 0 ? 1 : 0;
    setGlobalLocale(this._languages[this._langIndex]);
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

  _onDeviceChange(key) {
    this._activeDevice = key;
  }

  _onEventsButtonClick() {
    this._eventModalOpen = true;
    document.addEventListener('keydown', this._onModalKeydown);
  }

  _onEventsModalClose() {
    this._eventModalOpen = false;
    document.removeEventListener('keydown', this._onModalKeydown);
  }

  _onModalKeydown(event) {
    if (event.key === 'Escape') {
      this._onEventsModalClose();
    }
  }

  render() {
    const cases = this._cases;
    const devicePreset = DEVICE_PRESETS.find(preset => preset.key === this._activeDevice);

    return html`
      <div part="toolbar" class="ac-demo-content__toolbar">
        ${cases.length > 1 ? this._renderCaseSwitcher(cases) : ''}
        ${this._languages.length === 2 ? this._renderLanguageSwitcher() : ''}
        ${this._ambientOptions.length ? this._renderAmbientSwitcher() : ''}
        ${this.darkMode ? this._renderThemeToggle() : ''} ${this._renderDeviceSwitcher()}
        ${this._eventNames.length ? this._renderEventsButton() : ''}
      </div>

      <div class="ac-demo-content__stage">
        <div
          part="device-frame"
          class="ac-demo-content__device-frame ac-demo-content__device-frame--${this._activeDevice}"
          style="--ac-demo-content-device-width: ${devicePreset.width}px"
        >
          <div class="ac-demo-content__device-chrome" aria-hidden="true">
            ${
              this._activeDevice === 'desktop'
                ? html`
                    <span class="ac-demo-content__device-dot"></span>
                    <span class="ac-demo-content__device-dot"></span>
                    <span class="ac-demo-content__device-dot"></span>
                  `
                : html`<span class="ac-demo-content__device-notch"></span>`
            }
          </div>
          <div part="viewport" class="ac-demo-content__viewport">
            <slot></slot>
          </div>
        </div>
      </div>

      ${this._eventModalOpen ? this._renderEventsModal() : ''}
    `;
  }

  _renderCaseSwitcher(cases) {
    return html`
      <label class="ac-demo-content__field">
        <span class="ac-demo-content__field-label">Caso</span>
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
    const [first, second] = this._languages;
    const checked = this._langIndex === 1;
    return html`
      <div class="ac-demo-content__field ac-demo-content__field--switch">
        <span class="ac-demo-content__switch-label">${languageLabel(first)}</span>
        <button
          type="button"
          role="switch"
          aria-checked=${checked}
          aria-label="Idioma: cambiar a ${checked ? first : second}"
          class="ac-demo-content__switch ac-demo-content__locale-switch"
          @click=${this._onLanguageToggle}
        >
          <span class="ac-demo-content__switch-thumb"></span>
        </button>
        <span class="ac-demo-content__switch-label">${languageLabel(second)}</span>
      </div>
    `;
  }

  _renderAmbientSwitcher() {
    return html`
      <label class="ac-demo-content__field">
        <span class="ac-demo-content__field-label">Ambient</span>
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

  _renderDeviceSwitcher() {
    return html`
      <div
        class="ac-demo-content__device-switcher"
        role="group"
        aria-label="Tamaño del dispositivo"
      >
        ${DEVICE_PRESETS.map(
          preset => html`
            <button
              type="button"
              data-device=${preset.key}
              class=${`ac-demo-content__device-button${
                this._activeDevice === preset.key ? ' ac-demo-content__device-button--active' : ''
              }`}
              aria-pressed=${this._activeDevice === preset.key}
              @click=${() => this._onDeviceChange(preset.key)}
            >
              ${preset.label}
            </button>
          `,
        )}
      </div>
    `;
  }

  _renderEventsButton() {
    return html`
      <button
        type="button"
        class="ac-demo-content__events-button"
        aria-label="Ver eventos disparados (${this._eventLog.length})"
        @click=${this._onEventsButtonClick}
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M12 2a6 6 0 0 0-6 6v3.5c0 .9-.4 1.7-1 2.3L4 15h16l-1-1.2c-.6-.6-1-1.4-1-2.3V8a6 6 0 0 0-6-6Z"
          />
          <path d="M9 19a3 3 0 0 0 6 0" />
        </svg>
        ${
          this._eventLog.length
            ? html`<span class="ac-demo-content__events-count">${this._eventLog.length}</span>`
            : ''
        }
      </button>
    `;
  }

  _renderEventsModal() {
    return html`
      <div class="ac-demo-content__modal-backdrop" @click=${this._onEventsModalClose}>
        <div
          class="ac-demo-content__modal"
          role="dialog"
          aria-modal="true"
          aria-label="Eventos del demo"
          @click=${event => event.stopPropagation()}
        >
          <div class="ac-demo-content__modal-header">
            <h2 class="ac-demo-content__modal-title">Eventos</h2>
            <button
              type="button"
              class="ac-demo-content__modal-close"
              aria-label="Cerrar"
              @click=${this._onEventsModalClose}
            >
              ✕
            </button>
          </div>
          <p class="ac-demo-content__modal-config">
            Escuchando: <code>${this._eventNames.join(', ')}</code>
          </p>
          <div class="ac-demo-content__modal-list">
            ${
              this._eventLog.length
                ? this._eventLog.map(
                    entry => html`
                      <div class="ac-demo-content__modal-entry">
                        <div class="ac-demo-content__modal-entry-head">
                          <span class="ac-demo-content__modal-entry-name">${entry.name}</span>
                          <span class="ac-demo-content__modal-entry-time">${entry.time}</span>
                        </div>
                        <pre class="ac-demo-content__modal-entry-detail">
${JSON.stringify(entry.detail, null, 2)}</pre>
                      </div>
                    `,
                  )
                : html`<p class="ac-demo-content__modal-empty">
                    Todavía no se disparó ningún evento.
                  </p>`
            }
          </div>
        </div>
      </div>
    `;
  }
}
