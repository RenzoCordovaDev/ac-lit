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
│   │   ├── ac-e2e-testing/       # @ac-base/ac-e2e-testing (config WebdriverIO/Cucumber/axe)
│   │   └── ac-demo-content/      # @ac-base/ac-demo-content (contenedor centralizado de demos)
│   └── components/               # catálogo de componentes publicables
│       ├── ac-button-basic/      # @ac-components/ac-button-basic
│       ├── ac-link-basic/
│       ├── ac-badge-basic/
│       └── ac-radio-basic/
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

## Componentes con estado compartido entre instancias

Un `<input type="radio">` (o cualquier otro control nativo que agrupe por atributo, ej. `name`) **solo coordina con otros controles del mismo shadow root**. Cada instancia de un componente vive en su propio shadow root, así que ese agrupado nativo **no funciona** entre instancias distintas — confirmado en Firefox, Chromium y Safari actuales.

`ac-radio-basic` resuelve esto con un registro propio en memoria (`Map<name, Set<instancia>>` a nivel de módulo): al marcarse una instancia, desmarca manualmente a las demás del mismo grupo. Cualquier componente futuro que necesite coordinación entre instancias (ej. un acordeón de "solo un panel abierto a la vez", pestañas) debe usar el mismo patrón — un registro en memoria por una clave de agrupación, no depender del navegador para coordinar estado entre shadow roots distintos.

## Dark-mode y colores de fondo sólido

Un componente que pinta un fondo sólido con un color de texto **fijo** (ej. un badge: fondo de color + texto blanco/negro) debe usar los tokens semánticos fijos (`--color-neutral`, `--color-success`, `--color-warning`, `--color-danger` — no se redefinen en `modern-warm-palette-light.css`), **nunca** `--color-muted`/`--color-bg`/`--color-surface` (que sí cambian entre `dark-mode` claro/oscuro). Si no, el contraste se rompe al activar modo claro — encontrado así en `ac-badge-basic` (ver `packages/base/ac-core/README.md`).

Un variant con **fondo `transparent`** (o sin caja propia, ej. texto plano sobre la página como en `ac-link-basic`) es más frágil todavía: su contraste depende por completo del fondo de la página, que SÍ cambia entre temas. Un tono ajustado para verse bien en fondo oscuro casi siempre falla en fondo claro y viceversa — no hay ningún token "fijo" que lo resuelva porque el fondo no es del componente. Dos salidas válidas, según el caso:

- Darle al variant un fondo propio y estable (ya no `transparent`), con el mismo patrón de tokens fijos de arriba — es lo que se hizo con `.ac-button--secondary-alt` (fondo `--color-accent-100` + texto `--color-accent-900`, ambos sin redefinir en el tema claro).
- Si el texto va realmente sobre el fondo de la página (sin caja), usar un color de texto que cambie según el tema con `:host-context([data-theme='light'])` — es lo que hace `ac-link-basic` para sus 4 variants.

En ambos casos, **la accesibilidad del demo debe probarse en los dos temas** — por eso cada feature de accesibilidad tiene un escenario "en modo claro" además del smoke test por defecto (que corre en modo oscuro). No alcanza con mirar el componente en un solo tema y asumir que el otro también cumple.

## Paquetes base

- **`@ac-base/ac-core`** — design tokens, utilidades DOM, helpers. Exports: `./tokens`, `./utils`.
- **`@ac-base/ac-component-mixin`** — mixin base: propiedades comunes (`ambient`, `mode`, `loading`), sanitización HTML (DOMPurify), skeleton de carga, `scopedElementsFromClasses()`. Integra los dos mixins siguientes.
- **`@ac-base/ac-scoped-elements-mixin`** — aislamiento de custom elements para evitar colisiones de tag names.
- **`@ac-base/ac-intl-mixin`** — API `t(key, params)`, `setLocale(locale)`, `loadTranslations(data)` sobre `locales.json`.

## Demos centralizadas (`ac-demo-content`)

**Toda demo de componente usa `@ac-base/ac-demo-content`** — ningún componente nuevo (a mano o vía CLI) reimplementa su propio selector de caso/idioma/tema/tamaño/panel de eventos. Centralizar esto en un solo paquete significa que cuando la demo evoluciona, se cambia en un solo lugar en vez de en cada componente.

```html
<ac-demo-content
  language="es-PE, en-EN"
  ambients="primary, secondary"
  events="ac-mi-componente-click"
  dark-mode
>
  <ac-demo-case header="Básico" href="case-basic.html"></ac-demo-case>
  <ac-demo-case header="Estados" href="case-states.html"></ac-demo-case>
</ac-demo-content>
```

- **Los archivos `href` de cada `ac-demo-case` van en `demo/public/`**, no directo en `demo/`: Vite solo copia `public/` tal cual al build — cualquier otro archivo no referenciado desde `index.html` queda afuera de `dist/` y el `fetch()` da 404 en `vite preview`/producción (aunque funcione en `vite dev`, que sirve el disco tal cual).
- El switcher de `ambients` solo tiene efecto visual si el componente demostrado **usa de verdad** la propiedad `ambient` (heredada de `ComponentMixin`) en su styling — no basta con tenerla disponible sin usarla.
- `dark-mode` requiere que el `demo.js` del componente importe **ambas** paletas de `@ac-base/ac-core` (`modern-warm-palette.css` y `modern-warm-palette-light.css`) — el contenedor solo togglea `data-theme` en `<html>`, no inyecta CSS.
- Ver [`packages/base/ac-demo-content/README.md`](../packages/base/ac-demo-content/README.md) para la API completa.

> `ac-button-basic`, `ac-link-basic`, `ac-badge-basic`, `ac-radio-basic` y el template del CLI ya usan `ac-demo-content` (demos a mano + `variant` eliminados). Cualquier componente nuevo parte de esto por defecto vía `ac component create`.

## CLI (`ac`)

Paquete `@ac-base/cli` (`cli/`), implementado con [Commander.js](https://github.com/tj/commander.js). Filosofía: **cero lógica de más** — sin wizard interactivo, sin resolución de rutas/config, siempre opera sobre el directorio desde el que se ejecuta.

### Scaffolding

- **`ac component create <nombre> [--no-e2e]`** — genera un componente completo (`src/`, `test/`, `test_e2e/`, `demo/`, `locales.json`, `index.js`, `package.json`, `README.md`) en el directorio actual. `<nombre>` debe ser el nombre completo con prefijo `ac-` (ej. `ac-mi-componente`) — de ahí se derivan clase, archivo, paquete npm, etc. según la tabla de naming de este documento. `--no-e2e` omite `test_e2e/` y sus entradas en `package.json`.
  - Para agregar un componente al catálogo de `ac-lit`: `cd packages/components && ac component create ac-mi-componente`.
- **`ac app create <nombre>`** — scaffolding de un proyecto `ac-lit` nuevo. **Pendiente de implementar.**

Los templates viven en `cli/templates/` como archivos reales (no un motor de templates) con placeholders `__token__` (ej. `__class_name__`, `__tag__`, `__file_base__`), reemplazados por una función propia de reemplazo de texto (`src/scaffold/render-template.js`). Por eso `cli/templates/` está en `.prettierignore`: un placeholder `__token__` suelto en un `.md` (fuera de un code span) es indistinguible de énfasis Markdown (`__bold__`) y Prettier lo normaliza a `**bold**`, corrompiéndolo — dentro de backticks/fences no hay problema.

### Tareas (passthrough genérico)

Cualquier otro comando (`ac test`, `ac lint`, `ac test:e2e`, `ac test:e2e:a11y`, `ac build`, `ac component:serve`, ...) es un passthrough directo a `pnpm run <nombre>` en el directorio actual — el CLI no conoce la lista de scripts de antemano, así que un script nuevo en cualquier `package.json` queda disponible como `ac <script>` sin tocar el CLI.

### Levantar el servidor de desarrollo (`component:serve` / `app:serve`)

El script para levantar el demo de un componente con Vite se llama **`component:serve`** (no `dev`) en todos los `package.json` de `packages/components/*` y en el template del CLI — `ac component:serve` (o `pnpm --filter <paquete> component:serve`) levanta `demo/index.html` en `http://localhost:5173`. Cuando `ac app create` esté implementado, los proyectos de tipo app usarán el equivalente `app:serve` — son nombres separados a propósito porque sirven cosas distintas (un componente aislado con su demo vs. una aplicación completa), no alias del mismo script. `packages/base/ac-demo-content` (y cualquier otro paquete base) no es un componente del catálogo, así que mantiene el nombre genérico `dev` en vez de `component:serve`.

## Testing

- `@open-wc/testing` + `@web/test-runner`, un archivo `*.test.js` por componente en `test/`.
- Los tests corren en navegador real (no jsdom), acorde a que se testean Custom Elements/Shadow DOM.
- **Interfaz TDD de Mocha**: `suite`/`test` en vez de `describe`/`it` (y `setup`/`teardown` en vez de `before`/`after`, si hace falta) — se activa con `testFramework: { config: { ui: 'tdd' } }` en `web-test-runner.config.js`. Así se alinea el naming con el framework del cliente que `ac-lit` prepara a los desarrolladores a usar.
- **Un solo `expect` por `test`**: cada test valida una sola cosa. Un caso que antes mezclaba varias aserciones (ej. "defaults to variant/disabled/loading") se separa en un test por aserción, aunque eso signifique repetir el `fixture(...)` en cada uno. Esto mantiene cada test enfocado en un único objetivo y hace que un fallo señale exactamente qué se rompió.

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
- **Selectores dentro de un shadow root**: con WebDriver Bidi (default de WDIO v10, y de este proyecto — no forzamos `wdio:enforceWebDriverClassic`), `$()`/`$$()` atraviesan shadow DOM automáticamente, pero **solo si se encadenan** (`$(host).$('.hijo')`), no con un string compuesto plano (`$('host .hijo')` — tira "invalid selector" o no encuentra nada). Ver `@ac-base/ac-demo-content/test_e2e` para un ejemplo real.
- Scripts por paquete: `test:e2e` (build + `vite preview` + suite funcional) y `test:e2e:a11y` (idem + suite de accesibilidad), vía `start-server-and-test`. Desde la raíz: `pnpm test:e2e` / `pnpm test:e2e:a11y` corren ambos sobre todos los paquetes que tengan la suite.
- En CI corren en un job `e2e` separado de `lint-and-test`, **no bloqueante** (`continue-on-error: true`, no es required status check) hasta que se demuestre estable en la práctica.

Ver [`packages/base/ac-e2e-testing/README.md`](../packages/base/ac-e2e-testing/README.md) para la API completa (`buildWdioConfig`, `PageObject`, `ComponentObject`, `pageProvider`, `componentProvider`).

## Lint y formato

- ESLint (flat config, `eslint.config.js`) + Prettier, mismas reglas en todo el monorepo.
- `pre-commit` corre `lint-staged` solo sobre archivos en stage.
