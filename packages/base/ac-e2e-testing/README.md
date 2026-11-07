# @ac-base/ac-e2e-testing

Configuración y helpers compartidos para los tests **E2E / BDD** de los componentes de `ac-lit`: [WebdriverIO](https://webdriver.io) v10 + [Cucumber](https://cucumber.io) + [axe-core](https://github.com/dequelabs/axe-core-npm) para accesibilidad.

Esta capa de testing es **adicional** a los tests unitarios de `test/` (`@open-wc/testing` + `@web/test-runner`): valida el componente ya compilado, corriendo de verdad en Chrome contra el demo servido estáticamente — escenarios en Gherkin, Page Objects, y una suite de accesibilidad separada, al estilo de un proyecto real de BDD/QA.

## Uso en un componente

Cada componente que quiera esta capa agrega una carpeta `test_e2e/` sibling a `src/`, `test/` y `demo/`:

```
test_e2e/
  wdio.conf.js              # suite funcional
  wdio.a11y.conf.js         # suite de accesibilidad
  features/
    <componente>.feature
    <componente>-accessibility.feature
  step-definitions/
    <componente>.steps.js
  pages/
    demo.page.js
    <componente>.page.js
```

`wdio.conf.js`:

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildWdioConfig } from '@ac-base/ac-e2e-testing';

const here = path.dirname(fileURLToPath(import.meta.url));

export const config = buildWdioConfig({
  baseUrl: process.env.AC_E2E_BASE_URL ?? 'http://localhost:4173',
  specs: [path.join(here, 'features/**/*.feature')],
  tags: 'not @accessibility',
  cucumberOpts: { import: [path.join(here, 'step-definitions/**/*.js')] },
});
```

`wdio.a11y.conf.js` es igual pero con `tags: '@accessibility'`.

> Usa rutas absolutas (vía `import.meta.url`) para `specs` y `cucumberOpts.import`: WebdriverIO las resuelve de forma distinta según si vienen de `wdio run` en el root del paquete o desde dentro de `test_e2e/`, y una ruta relativa ambigua hace que los step definitions no se carguen (los steps "no están definidos") sin un error claro.

## API

- **`buildWdioConfig(overrides)`** — config base de WebdriverIO/Cucumber (Chrome headless en CI, reporter `spec`, timeouts) + tus `baseUrl`/`specs`/`tags`/`cucumberOpts`.
- **`CHROME_CAPABILITIES`** — capabilities de Chrome ya usadas por `buildWdioConfig`, por si necesitas extenderlas manualmente.
- **`ACCESSIBILITY_TAGS`** — `['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']`, para pasar a `new AxeBuilder(...).withTags(ACCESSIBILITY_TAGS)`.
- **`PageObject`** — clase base para la página del demo: `new DemoPage({ path: '' })`, método `open()`.
- **`ComponentObject`** — clase base para el componente bajo prueba: `new MyComponentPage({ selector })`, getter `root` (`$(selector)`), `waitForDisplayed()`, `click()`.
- **`pageProvider.open(PageClass, ...args)`** / **`componentProvider.find(ComponentClass, ...args)`** — helpers que instancian y, en el caso de la página, navegan.

> `browser`, `$` y `$$` son los globals que inyecta WebdriverIO en el proceso del worker — no se importan en ningún archivo de `test_e2e/`.

## Por qué existe este paquete

El patrón (Page Objects + BDD en Gherkin + accesibilidad como suite separada) está inspirado en el testing E2E usado en proyectos cliente reales — la intención es que practicar con `ac-lit` transfiera bien a ese tipo de entornos, aunque toda la implementación aquí es 100% open-source y propia de `ac-lit` (sin ninguna dependencia ni referencia a frameworks cerrados de terceros).
