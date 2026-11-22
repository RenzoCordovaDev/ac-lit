import { LitElement, html } from 'lit';
import { ComponentMixin } from '@ac-base/ac-component-mixin';
import { setGlobalLocale } from '@ac-base/ac-intl-mixin';
// Authored in demo-content.styles.scss, compiled to demo-content.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { DemoContentStyles } from './demo-content.styles.js';
import { copyToClipboard } from './clipboard.js';
import { tokenizeHtml, splitTokensIntoLines } from './highlight-html.js';

const DEVICE_PRESETS = [
  { key: 'mobile', label: 'Móvil', width: 375, height: 667 },
  { key: 'tablet', label: 'Tablet', width: 768, height: 1024 },
  { key: 'desktop', label: 'Desktop', width: 1280, height: 800 },
];
const MAX_EVENT_LOG_ENTRIES = 50;
// Persiste el caso activo por componente (`name`), para que guardar un
// cambio con el demo corriendo (HMR) o recargar la página a mano no vuelva
// siempre al primer caso -- solo debería pasar la primera vez que se visita
// la demo (nada guardado todavía) o al elegir un caso a mano. 100% cliente,
// sin cuenta -- mismo patrón que el progreso del Laboratorio, envuelto en
// try/catch porque localStorage puede no estar disponible (privacidad, modo
// incógnito, cuota).
const ACTIVE_CASE_STORAGE_PREFIX = 'ac-lit:demo-active-case:';

function loadStoredCaseIndex(name) {
  if (!name) return null;
  try {
    const raw = localStorage.getItem(ACTIVE_CASE_STORAGE_PREFIX + name);
    if (raw === null) return null;
    const index = Number(raw);
    return Number.isInteger(index) && index >= 0 ? index : null;
  } catch (_) {
    return null;
  }
}

function saveActiveCaseIndex(name, index) {
  if (!name) return;
  try {
    localStorage.setItem(ACTIVE_CASE_STORAGE_PREFIX + name, String(index));
  } catch (_) {
    /* no-op */
  }
}
const THEMES = ['light', 'dark'];
const VIEW_MODES = ['visual', 'code'];
const STATE_PROPERTIES = [
  '_activeCaseIndex',
  '_activeDevice',
  '_viewMode',
  '_langIndex',
  '_theme',
  '_eventLog',
  'embedded',
];
const COPIED_FEEDBACK_MS = 1600;

const COPY_ICON = html`<svg
  viewBox="0 0 24 24"
  width="14"
  height="14"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <rect x="9" y="9" width="11" height="11" rx="2" />
  <path d="M5 15V6a2 2 0 0 1 2-2h9" />
</svg>`;

const CHECK_ICON = html`<svg
  viewBox="0 0 24 24"
  width="14"
  height="14"
  fill="none"
  stroke="currentColor"
  stroke-width="2.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d="M5 12.5l4.5 4.5L19 7.5" />
</svg>`;

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

const PLAIN_TOKEN_TYPES = new Set(['text', 'plain']);

function renderToken(token) {
  return PLAIN_TOKEN_TYPES.has(token.type)
    ? token.text
    : html`<span class="ac-demo-content__tok ac-demo-content__tok--${token.type}"
        >${token.text}</span
      >`;
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
 *
 * Con `embedded` no dibuja cabecera ni toolbar: quien lo incrusta maneja los
 * mismos controles desde afuera con los métodos `select*()` y lee `demoState`.
 *
 * El caso activo se persiste en `localStorage` por `name` (ver
 * `ACTIVE_CASE_STORAGE_PREFIX`): guardar un cambio con el demo corriendo
 * (HMR) o recargar la página a mano mantiene el caso elegido en vez de
 * volver siempre al primero -- solo vuelve al primer caso si nunca se guardó
 * nada todavía (primera vez que se visita esta demo) o al elegirlo a mano.
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
      embedded: { type: Boolean, reflect: true },
      _activeCaseIndex: { state: true },
      _activeDevice: { state: true },
      _viewMode: { state: true },
      _langIndex: { state: true },
      _theme: { state: true },
      _eventLog: { state: true },
      _eventsPanelOpen: { state: true },
      _copiedCommand: { state: true },
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
    this.embedded = false;
    this._activeCaseIndex = 0;
    this._activeDevice = 'mobile';
    this._viewMode = 'visual';
    this._langIndex = 0;
    this._theme = 'light';
    this._eventLog = [];
    this._eventsPanelOpen = false;
    this._copiedCommand = null;
    this._copiedTimer = undefined;
    this._onEvent = this._onEvent.bind(this);
    this._onPanelKeydown = this._onPanelKeydown.bind(this);
    this._onCaseLoad = this._onCaseLoad.bind(this);
    this._onBridgeMessage = this._onBridgeMessage.bind(this);
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

  get demoState() {
    return {
      cases: this._cases.map((caseEl, index) => ({
        index,
        header: caseEl.header || `Caso ${index + 1}`,
      })),
      activeCase: this._activeCaseIndex,
      languages: this._languages,
      activeLanguage: this._langIndex,
      ambients: this._ambientOptions,
      darkMode: this.darkMode,
      theme: this._theme,
      devices: DEVICE_PRESETS.map(({ key, label }) => ({ key, label })),
      device: this._activeDevice,
      viewMode: this._viewMode,
      eventNames: this._eventNames,
      eventCount: this._eventLog.length,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    for (const name of this._eventNames) {
      document.addEventListener(name, this._onEvent);
    }
    this.addEventListener('ac-demo-case-load', this._onCaseLoad);
    window.addEventListener('message', this._onBridgeMessage);
  }

  disconnectedCallback() {
    for (const name of this._eventNames) {
      document.removeEventListener(name, this._onEvent);
    }
    this.removeEventListener('ac-demo-case-load', this._onCaseLoad);
    window.removeEventListener('message', this._onBridgeMessage);
    document.removeEventListener('keydown', this._onPanelKeydown);
    clearTimeout(this._copiedTimer);
    super.disconnectedCallback();
  }

  firstUpdated() {
    const storedIndex = loadStoredCaseIndex(this.name);
    const initialIndex = storedIndex !== null && storedIndex < this._cases.length ? storedIndex : 0;
    this._activateCase(initialIndex);
    document.documentElement.setAttribute('data-theme', this._theme);
    if (this._languages.length === 2) {
      setGlobalLocale(this._languages[this._langIndex]);
    }
  }

  updated(changedProperties) {
    if (STATE_PROPERTIES.some(property => changedProperties.has(property))) {
      this.dispatchEvent(
        new CustomEvent('ac-demo-content-state-change', {
          detail: this.demoState,
          bubbles: true,
          composed: true,
        }),
      );
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
    saveActiveCaseIndex(this.name, index);
    this._syncThemeToActiveCase();
    this._syncLanguageToActiveCase();
    this._syncViewportPadding();
  }

  /** Un caso cargado en iframe (ver demo-case.js) tiene su propio documento:
   * no hereda el `data-theme` del documento padre, hay que replicarlo. */
  _syncThemeToActiveCase() {
    const iframe = this._cases[this._activeCaseIndex]?.iframe;
    iframe?.contentDocument?.documentElement.setAttribute('data-theme', this._theme);
  }

  /** `.ac-demo-content__viewport` trae 1rem de padding pensado para contenido
   * suelto (fragmento) que necesita respirar sobre el fondo del marco. Un
   * caso "documento completo" (iframe) suele ser una pantalla real de punta a
   * punta (ej. `ac-transition-container` a pantalla completa) — con ese
   * padding de por medio nunca puede llegar a los bordes del marco simulado,
   * aunque internamente esté midiendo/llenando el 100% de su propio iframe.
   * Se anula a mano en línea (mismo motivo que el resto de estilos en línea
   * de demo-case.js: CSS con scope de shadow DOM no alcanza el DOM liviano). */
  _syncViewportPadding() {
    const viewport = this.renderRoot.querySelector('.ac-demo-content__viewport');
    if (!viewport) return;
    const isIframeCase = Boolean(this._cases[this._activeCaseIndex]?.iframe);
    viewport.style.padding = isIframeCase ? '0' : '';
  }

  selectCase(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this._cases.length) return;
    this._activateCase(index);
  }

  selectLanguage(index) {
    if (this._languages.length !== 2 || (index !== 0 && index !== 1)) return;
    this._langIndex = index;
    setGlobalLocale(this._languages[index]);
    this._syncLanguageToActiveCase();
  }

  /** Mismo motivo que `_syncThemeToActiveCase`: un caso en iframe tiene su
   * propia copia del módulo de `@ac-base/ac-intl-mixin` — `setGlobalLocale()`
   * de arriba solo cambió la del documento padre. Se replica vía
   * case-event-bridge.js (import de cada caso en documento completo). */
  _syncLanguageToActiveCase() {
    if (this._languages.length !== 2) return;
    const iframe = this._cases[this._activeCaseIndex]?.iframe;
    iframe?.contentWindow?.postMessage(
      { __acDemoBridgeSetLocale: true, locale: this._languages[this._langIndex] },
      '*',
    );
  }

  selectAmbient(value) {
    const activeCase = this._cases[this._activeCaseIndex];
    if (!activeCase) return;

    for (const el of activeCase.querySelectorAll('*')) {
      if ('ambient' in el) {
        el.ambient = value;
      }
    }
  }

  selectTheme(theme) {
    if (!THEMES.includes(theme)) return;
    this._theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this._syncThemeToActiveCase();
  }

  selectDevice(key) {
    if (!DEVICE_PRESETS.some(preset => preset.key === key)) return;
    this._activeDevice = key;
  }

  selectViewMode(mode) {
    if (!VIEW_MODES.includes(mode)) return;
    this._viewMode = mode;
  }

  openEventsPanel() {
    this._eventsPanelOpen = true;
    document.addEventListener('keydown', this._onPanelKeydown);
  }

  closeEventsPanel() {
    this._eventsPanelOpen = false;
    document.removeEventListener('keydown', this._onPanelKeydown);
  }

  _onCaseChange(event) {
    this.selectCase(Number(event.target.value));
  }

  _onLanguageSelect(index) {
    this.selectLanguage(index);
  }

  _onAmbientChange(event) {
    this.selectAmbient(event.target.value);
  }

  // Un modal/toast/transition "contenido" de un caso renuncia a la capa
  // superior nativa (`showModal()`/`popover` SIEMPRE bloquean toda la página
  // real e ignoran cualquier ancestro para medirse — ver "Superposiciones" en
  // CONVENTIONS.md) y se abre con `dialog.show()`/`popover="manual"` sin
  // modal. Pero `position: absolute`/`fixed` tampoco resuelve contra un
  // ancestro a través del límite de shadow DOM (probado empíricamente: el
  // `offsetParent` de un `<dialog>` slotteado da `<body>`, no el div del
  // viewport simulado, aun con ese div en `position: relative` y el host en
  // `display: contents`) — así que el componente igual necesita medir el
  // viewport simulado por JS. `getBoundary` es una función (no el elemento)
  // porque ese div se reconstruye al alternar Visual/Código.
  _onCaseLoad(event) {
    const caseEl = event.target;
    const iframe = caseEl.iframe;
    if (iframe) {
      // Camino "documento completo" (demo-case.js): el iframe es su propio
      // browsing context, con su propia capa superior — un <dialog> nativo
      // ya queda acotado a sus límites sin contained/getBoundary. Lo único
      // que hay que cruzar a mano es lo que de verdad depende del documento
      // (tema) y lo que no cruza el límite del iframe por su cuenta (eventos
      // compuestos para el panel de eventos — ver case-event-bridge.js).
      this._syncThemeToActiveCase();
      this._syncLanguageToActiveCase();
      this._syncViewportPadding();
      if (this._eventNames.length) {
        iframe.contentWindow?.postMessage(
          { __acDemoBridgeInit: true, eventNames: this._eventNames },
          '*',
        );
      }
      return;
    }
    // Camino "fragmento" (innerHTML): mismo documento, se puede aplicar
    // contained/getBoundary a mano a lo que esté en el DOM liviano del caso.
    this._applyContainment(caseEl);
  }

  _applyContainment(caseEl) {
    const getBoundary = () => this.renderRoot.querySelector('.ac-demo-content__viewport');
    for (const el of caseEl.querySelectorAll('*')) {
      if ('contained' in el) {
        el.getBoundary = getBoundary;
        el.contained = true;
      }
    }
  }

  /** Recibe los eventos que `case-event-bridge.js` reenvía desde el iframe de
   * un caso "documento completo" — el equivalente a `_onEvent` para el
   * camino fragmento, que escucha directo en `document`. */
  _onBridgeMessage(event) {
    if (!event.data || event.data.__acDemoBridgeEvent !== true) return;
    const iframe = this._cases[this._activeCaseIndex]?.iframe;
    if (!iframe || event.source !== iframe.contentWindow) return;
    if (!this._eventNames.includes(event.data.name)) return;
    this._onEvent({ type: event.data.name, detail: event.data.detail });
  }

  _onThemeSelect(theme) {
    this.selectTheme(theme);
  }

  _onDeviceSelect(key) {
    this.selectDevice(key);
  }

  _onViewModeSelect(mode) {
    this.selectViewMode(mode);
  }

  async _onInstallCommandClick(command) {
    const copied = await copyToClipboard(command);
    if (!copied) return;

    this._copiedCommand = command;
    this.dispatchEvent(
      new CustomEvent('ac-demo-content-copy', {
        detail: { text: command },
        bubbles: true,
        composed: true,
      }),
    );
    clearTimeout(this._copiedTimer);
    this._copiedTimer = setTimeout(() => {
      this._copiedCommand = null;
    }, COPIED_FEEDBACK_MS);
  }

  _onEventsButtonClick() {
    this.openEventsPanel();
  }

  _onEventsPanelClose() {
    this.closeEventsPanel();
  }

  _onPanelKeydown(event) {
    if (event.key === 'Escape') {
      this.closeEventsPanel();
    }
  }

  render() {
    const hasHeader = Boolean(this.name || this.tech || this.packageName || this.docsHref);
    const devicePreset = DEVICE_PRESETS.find(preset => preset.key === this._activeDevice);

    return html`
      ${hasHeader && !this.embedded ? this._renderHeader() : ''}
      ${this.embedded ? '' : this._renderToolbar()}

      <div class="ac-demo-content__stage">
        ${this._viewMode === 'code' ? this._renderCodeView() : this._renderDeviceStage(devicePreset)}
      </div>

      ${this._eventsPanelOpen ? this._renderEventsPanel() : ''}
    `;
  }

  _renderToolbar() {
    return html`
      <div part="toolbar" class="ac-demo-content__toolbar">
        <div class="ac-demo-content__toolbar-cases">${this._renderCaseSwitcher(this._cases)}</div>
        <div class="ac-demo-content__toolbar-controls">
          ${this._languages.length === 2 ? this._renderLanguageSwitcher() : ''}
          ${this._ambientOptions.length ? this._renderAmbientSwitcher() : ''}
          ${this.darkMode ? this._renderThemeSwitcher() : ''} ${this._renderDeviceSwitcher()}
          ${this._renderViewModeSwitcher()}
          ${this._eventNames.length ? this._renderEventsButton() : ''}
        </div>
      </div>
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
    const commands = [`pnpm add ${this.packageName}`, `npm i ${this.packageName}`];
    return html`
      <div class="ac-demo-content__install">
        ${commands.map(command => this._renderInstallCommand(command))}
        <span class="ac-demo-content__visually-hidden" role="status" aria-live="polite"
          >${this._copiedCommand ? 'Copiado al portapapeles' : ''}</span
        >
      </div>
    `;
  }

  _renderInstallCommand(command) {
    const copied = this._copiedCommand === command;
    return html`
      <button
        type="button"
        class=${`ac-demo-content__install-cmd${copied ? ' ac-demo-content__install-cmd--copied' : ''}`}
        aria-label=${`Copiar comando: ${command}`}
        title="Copiar al portapapeles"
        @click=${() => this._onInstallCommandClick(command)}
      >
        ${command}${copied ? CHECK_ICON : COPY_ICON}
      </button>
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
    const activeCase = cases[this._activeCaseIndex];
    const activeLabel = activeCase?.header || `Caso ${this._activeCaseIndex + 1}`;
    return html`
      <label class="ac-demo-content__field ac-demo-content__field--case">
        <span class="ac-demo-content__field-label">Caso</span>
        <select
          class="ac-demo-content__case-select"
          title=${activeLabel}
          @change=${this._onCaseChange}
        >
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
        <span class="ac-demo-content__field-label">Ambiente</span>
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
    const source = (activeCase?.source ?? '')
      .replace(/\r\n?/g, '\n')
      .replace(/^\s*\n/, '')
      .trimEnd();
    const fileName = activeCase?.href?.split('/').pop() || 'caso.html';
    const lines = source
      ? splitTokensIntoLines(tokenizeHtml(source))
      : [[{ type: 'text', text: 'Cargando…' }]];

    return html`
      <div class="ac-demo-content__code-view">
        <div class="ac-demo-content__code-editor">
          <div class="ac-demo-content__code-titlebar">
            <span class="ac-demo-content__code-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="ac-demo-content__code-filename">${fileName}</span>
            <span class="ac-demo-content__code-lang">HTML</span>
          </div>
          <div
            class="ac-demo-content__code-block"
            role="region"
            tabindex="0"
            aria-label=${`Código fuente de ${fileName}`}
          >
            ${lines.map(
              (tokens, index) => html`
                <div class="ac-demo-content__code-line">
                  <span class="ac-demo-content__code-gutter" aria-hidden="true">${index + 1}</span>
                  <span class="ac-demo-content__code-text">${tokens.map(renderToken)}</span>
                </div>
              `,
            )}
          </div>
        </div>
      </div>
    `;
  }

  _renderEventsButton() {
    return html`
      <button
        type="button"
        class="ac-demo-content__events-button"
        aria-label="Ver eventos disparados: ${this._eventLog.length}"
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
