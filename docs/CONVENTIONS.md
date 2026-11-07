# Convenciones de ac-lit

Este documento es la referencia de arquitectura y naming del ecosistema. Todo lo que se genera con la CLI, y todo lo que se escribe a mano, debe seguir estas convenciones.

## Estructura del monorepo

```
ac-lit/
├── cli/                          # @ac-base/cli — comando `ac`
├── packages/
│   ├── base/                     # paquetes core reutilizables
│   │   ├── ac-core/              # @ac-base/ac-core (tokens, utils)
│   │   ├── ac-component-mixin/   # @ac-base/ac-component-mixin
│   │   ├── ac-scoped-elements-mixin/
│   │   ├── ac-intl-mixin/
│   │   └── ac-e2e-testing/       # @ac-base/ac-e2e-testing (config WebdriverIO/Cucumber/axe)
│   └── components/               # catálogo de componentes publicables
│       ├── ac-button-basic/      # @ac-components/ac-button-basic
│       ├── ac-link-basic/
│       └── ac-helper-demo/       # contenedor de demos (dev-only)
├── docs/
├── pnpm-workspace.yaml
└── package.json
```

Cada componente vive en su propio paquete dentro de `packages/components/` y contiene `src/`, `demo/`, `test/`, `locales.json`, `index.js`, `package.json` y `README.md`. Opcionalmente, `test_e2e/` para la suite E2E/BDD (ver [Testing E2E y accesibilidad](#testing-e2e-y-accesibilidad)).

## Scopes de npm

| Scope              | Uso                                                              |
| ------------------ | ---------------------------------------------------------------- |
| `@ac-base/*`       | CLI y paquetes core/mixins reutilizables (no son componentes UI) |
| `@ac-components/*` | Catálogo de Web Components publicables individualmente           |

## Convenciones de naming

| Elemento                  | Regla                                                                         | Ejemplo                           |
| ------------------------- | ----------------------------------------------------------------------------- | --------------------------------- |
| Tag name (custom element) | prefijo `ac-` + kebab-case                                                    | `<ac-button>`                     |
| Clase del componente      | PascalCase, sin prefijo                                                       | `class Button extends ...`        |
| Archivo del componente    | kebab-case                                                                    | `button.js`, `button.styles.scss` |
| Carpeta del paquete       | prefijo `ac-` + kebab-case                                                    | `ac-button-basic/`                |
| Evento custom             | prefijo `ac-` + nombre-del-componente-evento, `bubbles: true, composed: true` | `ac-button-click`                 |
| CSS custom property       | `--<componente>-<propiedad>`                                                  | `--button-bg`                     |
| CSS part                  | nombre semántico del elemento interno                                         | `part="button"`                   |
| Clave de traducción       | `<componente>-<descripcion>`                                                  | `button-submit-text`              |
| Locale                    | código BCP-47                                                                 | `es-PE`, `en-EN`, `pt-BR`         |

> Nota: ninguna de estas convenciones usa el prefijo `academy` ni ningún término asociado a él — el ecosistema se identifica exclusivamente como **ac-lit** / **ac-**.

## `locales.json`

Siempre en la raíz del paquete del componente (nunca en subcarpetas), con esta forma:

```json
{
  "es-PE": { "button-submit-text": "Aceptar" },
  "en-EN": { "button-submit-text": "Accept" },
  "pt-BR": { "button-submit-text": "Aceitar" }
}
```

## Paquetes base

- **`@ac-base/ac-core`** — design tokens, utilidades DOM, helpers. Exports: `./tokens`, `./utils`.
- **`@ac-base/ac-component-mixin`** — mixin base: propiedades comunes (`ambient`, `mode`, `loading`), sanitización HTML (DOMPurify), skeleton de carga, `scopedElementsFromClasses()`. Integra los dos mixins siguientes.
- **`@ac-base/ac-scoped-elements-mixin`** — aislamiento de custom elements para evitar colisiones de tag names.
- **`@ac-base/ac-intl-mixin`** — API `t(key, params)`, `setLocale(locale)`, `loadTranslations(data)` sobre `locales.json`.

## CLI (`ac`)

Comandos previstos (ver [`docs/CLI.md`](./CLI.md) cuando se implemente):

- `ac init <nombre-proyecto>` — scaffolding de un proyecto nuevo.
- `ac generate component <nombre>` (alias `ac g c`) — genera un componente completo (`src/`, `demo/`, `test/`, `locales.json`, `index.js`, `package.json`).
- `ac add <componentes...>` — instala componentes del catálogo vía npm.
- `ac list` — lista el catálogo de componentes disponible.
- `ac serve` / `ac dev` — levanta el servidor de desarrollo local (Vite) para el componente/proyecto actual.

## Testing

- `@open-wc/testing` + `@web/test-runner`, un archivo `*.test.js` por componente en `test/`.
- Los tests corren en navegador real (no jsdom), acorde a que se testean Custom Elements/Shadow DOM.

## Testing E2E y accesibilidad

Capa adicional, opcional por componente, que prueba el componente ya compilado corriendo contra su `demo/` servido estáticamente (no contra el código fuente como los tests unitarios). Usa [WebdriverIO](https://webdriver.io) v10 + [Cucumber](https://cucumber.io) (BDD) + [axe-core](https://github.com/dequelabs/axe-core-npm) para accesibilidad, con la config y los Page Objects base compartidos en `@ac-base/ac-e2e-testing`.

Estructura por componente (sibling a `src/`, `test/`, `demo/`):

```
test_e2e/
  wdio.conf.js              # suite funcional (tags: 'not @accessibility')
  wdio.a11y.conf.js         # suite de accesibilidad (tags: '@accessibility')
  features/
    <componente>.feature
    <componente>-accessibility.feature
  step-definitions/
    <componente>.steps.js
  pages/
    demo.page.js
    <componente>.page.js
```

Convenciones:

- **Gherkin en español**, consistente con el resto de la documentación del proyecto.
- Cada componente tiene **dos feature files**: uno funcional y uno de accesibilidad, separados por el tag `@accessibility` (así cada suite corre de forma independiente).
- Anclas de selector: los elementos que la suite E2E necesita ubicar llevan `data-testid="..."` en el `demo/index.html` — nunca se depende de texto visible o de la posición en el DOM.
- `specs` y `cucumberOpts.import` de cada `wdio*.conf.js` se construyen como rutas absolutas vía `import.meta.url` (ver ejemplo en el README del paquete) — una ruta relativa ambigua hace que los step definitions no se carguen sin dar un error claro.
- **Evita `/` en el texto de un step** (feature file o `Given/When/Then(...)`): en Cucumber Expressions `/` significa alternancia (`tea/coffee` = "tea" **o** "coffee"), no el carácter literal — `"WCAG 2.0/2.1"` no matchea como texto completo. Si necesitas una barra literal, usa una expresión regex (`/.../`) en vez de una Cucumber Expression, o redacta el step sin ella.
- Step definitions y Page Objects en **JS plano** (no TypeScript), para mantener consistencia con el resto del monorepo.
- `browser`, `$`, `$$` son globals que inyecta WebdriverIO en tiempo de ejecución — no se importan.
- Scripts por paquete: `test:e2e` (build + `vite preview` + suite funcional) y `test:e2e:a11y` (idem + suite de accesibilidad), vía `start-server-and-test`. Desde la raíz: `pnpm test:e2e` / `pnpm test:e2e:a11y` corren ambos sobre todos los paquetes que tengan la suite.
- En CI corren en un job `e2e` separado de `lint-and-test`, **no bloqueante** (`continue-on-error: true`, no es required status check) hasta que se demuestre estable en la práctica.

Ver [`packages/base/ac-e2e-testing/README.md`](../packages/base/ac-e2e-testing/README.md) para la API completa (`buildWdioConfig`, `PageObject`, `ComponentObject`, `pageProvider`, `componentProvider`).

## Lint y formato

- ESLint (flat config, `eslint.config.js`) + Prettier, mismas reglas en todo el monorepo.
- `pre-commit` corre `lint-staged` solo sobre archivos en stage.
