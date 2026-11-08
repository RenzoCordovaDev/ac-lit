import { LitElement, html } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
import { setGlobalLocale } from '@ac-base/ac-intl-mixin';
// Authored in demo-content.styles.scss, compiled to demo-content.styles.js by
// `pnpm run build:styles` (scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm build` or `pnpm dev` to generate it.
import { DemoContentStyles } from './demo-content.styles.js';

const DEVICE_PRESETS = [
  { key: 'mobile', label: 'Móvil', width: 375, height: 667 },
  { key: 'tablet', label: 'Tablet', width: 768, height: 1024 },
  { key: 'desktop', label: 'Desktop', width: 1280, height: 720 },
];
const MAX_EVENT_LOG_ENTRIES = 50;

const SUN_ICON = html`<svg
  viewBox="0 0 24 24"
  width="15"
  height="15"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <circle cx="12" cy="12" r="4" />
  <path
    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
  />
</svg>`;

const MOON_ICON = html`<svg
  viewBox="0 0 24 24"
  width="15"
  height="15"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
</svg>`;

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
 * para el caso activo: idioma (switch de 2 opciones), ambient (seteado
 * directamente sobre los componentes del caso activo), modo claro/oscuro
 * (switch de 2 iconos, claro por defecto), tamaño de dispositivo (con marco
 * y ALTURA fijos por preset — el contenido scrollea adentro, no empuja el
 * marco), vista visual/código (código muestra el HTML fuente del caso
 * activo) y un panel lateral de eventos con el detalle de cada uno.
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
      name: { type: String },
      tech: { type: String },
      packageName: { type: String, attribute: 'package-name' },
      docsHref: { type: String, attribute: 'docs-href' },
      language: { type: String },
      ambients: { type: String },
      events: { type: String },
      darkMode: { type: Boolean, reflect: true, attribute: 'dark-mode' },
      _activeCaseIndex: { state: true },
      _activeDevice: { state: true },
      _viewMode: { state: true },
      _langIndex: { state: true },
      _theme: { state: true },
      _eventLog: { state: true },
      _eventsPanelOpen: { state: true },
    };
  }

  constructor() {
    super();
    this.name = '';
    this.tech = '';
    this.packageName = '';
    this.docsHref = '';
    this.language = '';
    this.ambients = '';
    this.events = '';
    this.darkMode = false;
    this._activeCaseIndex = 0;
    this._activeDevice = 'mobile';
    this._viewMode = 'visual';
    this._langIndex = 0;
    this._theme = 'light';
    this._eventLog = [];
    this._eventsPanelOpen = false;
    this._onEvent = this._onEvent.bind(this);
    this._onPanelKeydown = this._onPanelKeydown.bind(this);
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
    document.removeEventListener('keydown', this._onPanelKeydown);
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

  _onLanguageSelect(index) {
    this._langIndex = index;
    setGlobalLocale(this._languages[index]);
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

  _onThemeSelect(theme) {
    this._theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }

  _onDeviceSelect(key) {
    this._activeDevice = key;
  }

  _onViewModeSelect(mode) {
    this._viewMode = mode;
  }

  _onEventsButtonClick() {
    this._eventsPanelOpen = true;
    document.addEventListener('keydown', this._onPanelKeydown);
  }

  _onEventsPanelClose() {
    this._eventsPanelOpen = false;
    document.removeEventListener('keydown', this._onPanelKeydown);
  }

  _onPanelKeydown(event) {
    if (event.key === 'Escape') {
      this._onEventsPanelClose();
    }
  }

  render() {
    const hasHeader = Boolean(this.name || this.tech || this.packageName || this.docsHref);
    const devicePreset = DEVICE_PRESETS.find(preset => preset.key === this._activeDevice);

    return html`
      ${hasHeader ? this._renderHeader() : ''}

      <div part="toolbar" class="ac-demo-content__toolbar">
        ${this._renderCaseSwitcher(this._cases)}
        ${this._languages.length === 2 ? this._renderLanguageSwitcher() : ''}
        ${this._ambientOptions.length ? this._renderAmbientSwitcher() : ''}
        ${this.darkMode ? this._renderThemeSwitcher() : ''} ${this._renderDeviceSwitcher()}
        ${this._renderViewModeSwitcher()}
        ${this._eventNames.length ? this._renderEventsButton() : ''}
      </div>

      <div class="ac-demo-content__stage">
        ${this._viewMode === 'code' ? this._renderCodeView() : this._renderDeviceStage(devicePreset)}
      </div>

      ${this._eventsPanelOpen ? this._renderEventsPanel() : ''}
    `;
  }

  _renderHeader() {
    return html`
      <div class="ac-demo-content__header">
        <div class="ac-demo-content__header-title">
          ${this.name ? html`<h2 class="ac-demo-content__name">${this.name}</h2>` : ''}
          ${this.tech ? html`<span class="ac-demo-content__tech-badge">${this.tech}</span>` : ''}
        </div>
        ${
          this.packageName || this.docsHref
            ? html`
                <div class="ac-demo-content__header-meta">
                  ${this.packageName ? this._renderInstallSnippets() : ''}
                  ${
                    this.docsHref
                      ? html`<a
                          class="ac-demo-content__docs-link"
                          href=${this.docsHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          >Documentación</a
                        >`
                      : ''
                  }
                </div>
              `
            : ''
        }
      </div>
    `;
  }

  _renderInstallSnippets() {
    return html`
      <div class="ac-demo-content__install">
        <code class="ac-demo-content__install-cmd">pnpm add ${this.packageName}</code>
        <code class="ac-demo-content__install-cmd">npm i ${this.packageName}</code>
      </div>
    `;
  }

  _renderSegmented({ wrapperClass, ariaLabel, options, activeValue, onSelect }) {
    return html`
      <div class="ac-demo-content__segmented ${wrapperClass}" role="group" aria-label=${ariaLabel}>
        ${options.map(
          (option, index) => html`
            ${index > 0 ? html`<span class="ac-demo-content__segmented-divider"></span>` : ''}
            <button
              type="button"
              data-value=${option.value}
              class=${`ac-demo-content__segmented-button${
                option.value === activeValue ? ' ac-demo-content__segmented-button--active' : ''
              }`}
              aria-pressed=${option.value === activeValue}
              aria-label=${option.ariaLabel ?? ''}
              @click=${() => onSelect(option.value)}
            >
              ${option.icon ?? option.label}
            </button>
          `,
        )}
      </div>
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
    return this._renderSegmented({
      wrapperClass: 'ac-demo-content__locale-switcher',
      ariaLabel: 'Idioma',
      activeValue: this._langIndex,
      onSelect: index => this._onLanguageSelect(index),
      options: [
        { value: 0, label: languageLabel(first), ariaLabel: `Idioma: ${first}` },
        { value: 1, label: languageLabel(second), ariaLabel: `Idioma: ${second}` },
      ],
    });
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

  _renderThemeSwitcher() {
    return this._renderSegmented({
      wrapperClass: 'ac-demo-content__theme-switcher',
      ariaLabel: 'Tema',
      activeValue: this._theme,
      onSelect: theme => this._onThemeSelect(theme),
      options: [
        { value: 'light', icon: SUN_ICON, ariaLabel: 'Modo claro' },
        { value: 'dark', icon: MOON_ICON, ariaLabel: 'Modo oscuro' },
      ],
    });
  }

  _renderDeviceSwitcher() {
    return this._renderSegmented({
      wrapperClass: 'ac-demo-content__device-switcher',
      ariaLabel: 'Tamaño del dispositivo',
      activeValue: this._activeDevice,
      onSelect: key => this._onDeviceSelect(key),
      options: DEVICE_PRESETS.map(preset => ({
        value: preset.key,
        label: preset.label,
        ariaLabel: preset.label,
      })),
    });
  }

  _renderViewModeSwitcher() {
    return this._renderSegmented({
      wrapperClass: 'ac-demo-content__viewmode-switcher',
      ariaLabel: 'Tipo de vista',
      activeValue: this._viewMode,
      onSelect: mode => this._onViewModeSelect(mode),
      options: [
        { value: 'visual', label: 'Visual', ariaLabel: 'Vista visual' },
        { value: 'code', label: 'Código', ariaLabel: 'Vista de código' },
      ],
    });
  }

  _renderDeviceStage(devicePreset) {
    return html`
      <div
        part="device-frame"
        class="ac-demo-content__device-frame ac-demo-content__device-frame--${this._activeDevice}"
        style="--ac-demo-content-device-width: ${devicePreset.width}px; --ac-demo-content-device-height: ${devicePreset.height}px"
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
    `;
  }

  _renderCodeView() {
    const activeCase = this._cases[this._activeCaseIndex];
    const source = activeCase?.source?.trim();
    return html`
      <div class="ac-demo-content__code-view">
        <pre class="ac-demo-content__code-block"><code>${source || 'Cargando…'}</code></pre>
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

  _renderEventsPanel() {
    return html`
      <div class="ac-demo-content__panel-backdrop" @click=${this._onEventsPanelClose}>
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
              @click=${this._onEventsPanelClose}
            >
              ✕
            </button>
          </div>
          <p class="ac-demo-content__modal-config">
            <strong>Escuchando:</strong> <code>${this._eventNames.join(', ')}</code>
          </p>
          <div class="ac-demo-content__modal-list">
            ${
              this._eventLog.length
                ? this._eventLog.map(
                    entry => html`
                      <div class="ac-demo-content__modal-entry">
                        <div class="ac-demo-content__modal-entry-row">
                          <span class="ac-demo-content__modal-entry-label">Evento:</span>
                          <span class="ac-demo-content__modal-entry-value">${entry.name}</span>
                        </div>
                        <div class="ac-demo-content__modal-entry-row">
                          <span class="ac-demo-content__modal-entry-label">Hora:</span>
                          <span class="ac-demo-content__modal-entry-value">${entry.time}</span>
                        </div>
                        <div
                          class="ac-demo-content__modal-entry-row ac-demo-content__modal-entry-row--block"
                        >
                          <span class="ac-demo-content__modal-entry-label">Payload:</span>
                          <pre class="ac-demo-content__modal-entry-detail">
${JSON.stringify(entry.detail, null, 2)}</pre>
                        </div>
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
