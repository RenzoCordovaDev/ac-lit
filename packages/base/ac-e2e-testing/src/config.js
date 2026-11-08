const isCI = Boolean(process.env.CI);

/** Tags WCAG evaluados en las suites de accesibilidad (axe-core). */
export const ACCESSIBILITY_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

export const CHROME_CAPABILITIES = {
  browserName: 'chrome',
  'goog:chromeOptions': {
    args: [
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--window-size=1280,800',
      ...(isCI ? ['--headless=new'] : []),
    ],
  },
  // Protocolo WebDriver Bidi (default de WDIO v10): selectores CSS atraviesan
  // shadow DOM automáticamente, sin necesitar `>>>` ni `shadow$()`. No forzar
  // 'wdio:enforceWebDriverClassic' — eso lo deshabilita y rompe el
  // auto-piercing (necesario para suites como @ac-base/ac-demo-content, que
  // seleccionan controles dentro de su shadow root).
};

/**
 * Construye una config de WebdriverIO + Cucumber compartida por todos los
 * componentes, con los valores por defecto del proyecto y overrides puntuales.
 */
export function buildWdioConfig({ baseUrl, specs, tags, cucumberOpts = {}, ...rest }) {
  return {
    runner: 'local',
    framework: 'cucumber',
    reporters: ['spec'],
    logLevel: 'warn',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 2,
    baseUrl,
    specs,
    capabilities: [CHROME_CAPABILITIES],
    cucumberOpts: {
      timeout: 60000,
      tags,
      ...cucumberOpts,
    },
    ...rest,
  };
}
