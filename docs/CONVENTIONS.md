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

En ambos casos, **la accesibilidad del demo debe probarse en los dos temas** — por eso cada feature de accesibilidad tiene un escenario adicional que activa el toggle de tema, además del smoke test por defecto (que corre en el tema por defecto del demo — **claro**, desde que `ac-demo-content` lo adoptó como default). No alcanza con mirar el componente en un solo tema y asumir que el otro también cumple.

**Nunca uses `opacity` para "atenuar" texto** (micro-labels, subtítulos, texto secundario) — diluye el color efectivo hacia el fondo detrás, y cuánto contraste sobrevive depende del fondo de cada superficie, así que un valor que pasa WCAG AA en un lugar puede fallar en otro (encontrado así en el switch de idioma de `ac-demo-content`: `opacity: 0.6` sobre `--color-text` fallaba color-contrast, mientras que `opacity: 0.7` en otro label de al lado pasaba de casualidad, por un margen mínimo). Para texto secundario, usa un color de menor contraste **validado explícitamente** (nunca `--color-subtext`, que ya falla WCAG AA por su cuenta — ver más abajo) o simplemente mantené el mismo color de texto y diferenciá con tamaño/peso/mayúsculas en su lugar.

## Paquetes base

- **`@ac-base/ac-core`** — design tokens, utilidades DOM, helpers. Exports: `./tokens`, `./utils`.
- **`@ac-base/ac-component-mixin`** — mixin base: propiedades comunes (`ambient`, `mode`, `loading`), sanitización HTML (DOMPurify), skeleton de carga, `scopedElementsFromClasses()`. Integra los dos mixins siguientes.
- **`@ac-base/ac-scoped-elements-mixin`** — aislamiento de custom elements para evitar colisiones de tag names.
- **`@ac-base/ac-intl-mixin`** — API `t(key, params)`, `setLocale(locale)`, `loadTranslations(data)` sobre `locales.json`.

## Demos centralizadas (`ac-demo-content`)

**Toda demo de componente usa `@ac-base/ac-demo-content`** — ningún componente nuevo (a mano o vía CLI) reimplementa su propio selector de caso/idioma/tema/tamaño/panel de eventos. Centralizar esto en un solo paquete significa que cuando la demo evoluciona, se cambia en un solo lugar en vez de en cada componente.

```html
<ac-demo-content
  name="ac-mi-componente"
  tech="Lit v3"
  package-name="@ac-components/ac-mi-componente"
  docs-href="https://github.com/RenzoCordovaDev/ac-lit/blob/main/packages/components/ac-mi-componente/README.md"
  language="es-PE, en-EN"
  ambients="primary, secondary"
  events="ac-mi-componente-click"
  dark-mode
>
  <ac-demo-case header="Básico" href="case-basic.html"></ac-demo-case>
  <ac-demo-case header="Estados" href="case-states.html"></ac-demo-case>
</ac-demo-content>
```

- **El título ya no se escribe a mano en `demo/index.html`** (nada de `<h1>&lt;x&gt;</h1>`) — `name` centraliza el título (sin `<>`, el nombre tal cual), y con `tech` se muestra además la tecnología base como badge junto al nombre (`Lit v3` para todo el catálogo actual).
- `package-name` y `docs-href` son opcionales pero se usan en todo el catálogo: `package-name` muestra los snippets `pnpm add`/`npm i` listos para copiar, `docs-href` muestra un link "Documentación" apuntando al `README.md` del componente en GitHub (no a una ruta local — el dev server de Vite no sirve `README.md` fuera de `demo/`, y en `vite build`/`preview` tampoco existiría).
- **Los archivos `href` de cada `ac-demo-case` van en `demo/public/`**, no directo en `demo/`: Vite solo copia `public/` tal cual al build — cualquier otro archivo no referenciado desde `index.html` queda afuera de `dist/` y el `fetch()` da 404 en `vite preview`/producción (aunque funcione en `vite dev`, que sirve el disco tal cual).
- **El switcher de caso siempre se muestra**, incluso con un solo `<ac-demo-case>` — no hay gate por cantidad de casos.
- El switcher de `ambients` solo tiene efecto visual si el componente demostrado **usa de verdad** la propiedad `ambient` (heredada de `ComponentMixin`) en su styling — no basta con tenerla disponible sin usarla.
- `dark-mode` requiere que el `demo.js` del componente importe **ambas** paletas de `@ac-base/ac-core` (`modern-warm-palette.css` y `modern-warm-palette-light.css`) — el contenedor solo togglea `data-theme` en `<html>`, no inyecta CSS. El demo arranca en **modo claro** (no oscuro). El control es un switch de 2 iconos (sol/luna) dentro de un contenedor con borde redondeado y un divisor vertical entre ambos — nunca texto ("Modo claro"/"Modo oscuro"); el icono activo se resalta con los mismos tokens `--color-primary-700`/`--color-primary-50` que el resto de controles segmentados.
- `language` acepta **exactamente 2 locales** — el framework solo soporta español/inglés en el demo, así que se renderiza con el mismo patrón de control segmentado (ES | divisor | EN), no como `<select>` ni como un switch deslizante. No se ofrecen más de 2 idiomas aunque `locales.json` tenga más claves (ej. `pt-BR` sigue siendo una traducción válida del componente, solo no aparece en el switcher del demo).
- El tamaño de viewport ya **no es configurable vía atributo** (no existe más `sizes`) — son 3 presets fijos, con **ancho Y alto fijos** (no solo ancho): Móvil (375×667, activo por defecto), Tablet (768×1024) y Desktop (1280×720). Cada uno envuelve el `<slot>` en un marco visual (`ac-demo-content__device-frame`) que imita el bisel del dispositivo (notch en móvil/tablet, barra con puntos tipo navegador en desktop). El alto fijo es deliberado: si el contenido del caso activo no entra, **scrollea adentro del viewport simulado**, en vez de estirar el marco — así la demo se ve como el dispositivo real se vería, no como una página que crece sin límite.
- **Switch Visual/Código**: todo componente tiene este control (segmentado, igual que los demás). "Visual" (por defecto) muestra el caso activo renderizado de verdad, dentro del marco de dispositivo. "Código" muestra el HTML fuente de ese mismo caso (el contenido crudo de su `href`, vía `ac-demo-case.source`) en un bloque `<pre><code>`, sin el marco de dispositivo (ver código fuente no necesita simular un viewport).
- El panel de eventos es un ícono (campana) con contador — **no un log siempre visible**. Al hacer click abre un **panel lateral pegado al borde derecho de la pantalla** (no un modal centrado), con la configuración (qué eventos escucha) arriba y, por cada evento disparado, sus campos **etiquetados explícitamente**: `Evento:`, `Hora:`, `Payload:` (nunca datos sueltos sin decir qué son).
- **Nunca apliques `opacity` a texto** para "atenuarlo" (ver la sección de Dark-mode más arriba) — mismo motivo, mismo riesgo de romper contraste WCAG, y el mismo patrón apareció de nuevo acá en el link de "Documentación" (color pensado para fondo oscuro, usado directo sobre la página sin caja propia — mismo fix que en `ac-link-basic`: oscurecer con `:host-context([data-theme='light'])`).
- Ver [`packages/base/ac-demo-content/README.md`](../packages/base/ac-demo-content/README.md) para la API completa.

> `ac-button-basic`, `ac-link-basic`, `ac-badge-basic`, `ac-radio-basic` y el template del CLI ya usan `ac-demo-content` (demos a mano + `variant` eliminados). Cualquier componente nuevo parte de esto por defecto vía `ac component:create`.

## CLI (`ac`)

Paquete `@ac-base/cli` (`cli/`), implementado con [Commander.js](https://github.com/tj/commander.js). Filosofía: **cero lógica de más** — sin wizard interactivo, sin resolución de rutas/config, siempre opera sobre el directorio desde el que se ejecuta.

**Todos los comandos usan la forma `<tipo>:<accion>`** (`component:create`, `app:create`, `component:serve`, ...), nunca subcomandos separados por espacio — así el namespace `component:*` y el futuro `app:*` son simétricos y los comandos propios del CLI y los scripts de `package.json` comparten la misma sintaxis. `ac help` (también `ac -h`, `ac --help` o `ac` a secas) lista todos los comandos propios, las tareas habituales y los scripts del `package.json` del directorio actual. Los comandos propios se declaran en **un único registro** (`cli/src/commands/registry.js`); Commander y `ac help` leen de ahí, así que agregar un comando nuevo es una sola entrada. Un comando propio tiene prioridad sobre un script `package.json` con el mismo nombre. La sintaxis anterior con espacio (`ac component create`) ya no existe: imprime una sugerencia (`¿Quisiste decir ac component:create?`) en vez de caer al passthrough con un error confuso de pnpm.

### Scaffolding

- **`ac component:create <nombre> [--no-e2e]`** — genera un componente completo (`src/`, `test/`, `test_e2e/`, `demo/`, `locales.json`, `index.js`, `package.json`, `README.md`) en el directorio actual. `<nombre>` debe ser el nombre completo con prefijo `ac-` (ej. `ac-mi-componente`) — de ahí se derivan clase, archivo, paquete npm, etc. según la tabla de naming de este documento. `--no-e2e` omite `test_e2e/` y sus entradas en `package.json`.
  - Para agregar un componente al catálogo de `ac-lit`: `cd packages/components && ac component:create ac-mi-componente`.
- **`ac app:create <nombre>`** — scaffolding de un proyecto `ac-lit` nuevo. **Pendiente de implementar.**

Los templates viven en `cli/templates/` como archivos reales (no un motor de templates) con placeholders `__token__` (ej. `__class_name__`, `__tag__`, `__file_base__`), reemplazados por una función propia de reemplazo de texto (`src/scaffold/render-template.js`). Por eso `cli/templates/` está en `.prettierignore`: un placeholder `__token__` suelto en un `.md` (fuera de un code span) es indistinguible de énfasis Markdown (`__bold__`) y Prettier lo normaliza a `**bold**`, corrompiéndolo — dentro de backticks/fences no hay problema.

### Tareas (passthrough genérico)

Cualquier otro comando (`ac test`, `ac lint`, `ac test:e2e`, `ac test:e2e:a11y`, `ac build`, `ac component:serve`, ...) es un passthrough directo a `pnpm run <nombre>` en el directorio actual — el CLI no conoce la lista de scripts de antemano, así que un script nuevo en cualquier `package.json` queda disponible como `ac <script>` sin tocar el CLI.

### Levantar el servidor de desarrollo (`component:serve` / `app:serve`)

El script para levantar el demo de un componente con Vite se llama **`component:serve`** (no `dev`) en todos los `package.json` de `packages/components/*` y en el template del CLI — `ac component:serve` (o `pnpm --filter <paquete> component:serve`) levanta `demo/index.html` en `http://localhost:5173`. Cuando `ac app:create` esté implementado, los proyectos de tipo app usarán el equivalente `app:serve` — son nombres separados a propósito porque sirven cosas distintas (un componente aislado con su demo vs. una aplicación completa), no alias del mismo script. `packages/base/ac-demo-content` (y cualquier otro paquete base) no es un componente del catálogo, así que mantiene el nombre genérico `dev` en vez de `component:serve`.

**`component:serve` (y `dev`) recompilan el `.scss` del componente en modo watch, no una sola vez.** Vite por sí solo no sabe recompilar `src/*.styles.scss` — eso lo hace un script aparte (`@ac-base/cli/scripts/compile-scss-to-lit.cjs`, dentro del paquete del CLI, fuera del grafo de módulos de Vite), así que sin watch, `.scss` modificado con el server corriendo no se reflejaba hasta reiniciar. La solución: ese script acepta un flag `--watch` (recompila en cada guardado del `.scss`, con debounce), y cada paquete corre ese watcher en paralelo con `vite demo`/`vite dev` usando [`concurrently`](https://www.npmjs.com/package/concurrently) (`"component:serve": "pnpm run build:styles && concurrently -k -n styles,vite -c blue,green \"pnpm run build:styles:watch\" \"vite demo\""`). Como `src/*.styles.js` SÍ es un módulo real que el componente importa, Vite lo vigila por su cuenta y recarga el navegador solo en cuanto el watcher lo reescribe — sin reiniciar nada. Todo componente nuevo (a mano o vía `ac component:create`) debe tener este mismo patrón: `build:styles:watch` + `concurrently` en `component:serve`/`dev`, no solo `build:styles` una vez.

El script vive en `cli/scripts/compile-scss-to-lit.cjs` (no en la raíz del monorepo) y cada paquete lo invoca vía `node ./node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs ...` — resuelto a través de `node_modules`, no con una ruta relativa fija como `../../../scripts/...`. Esto es deliberado: una ruta relativa solo es correcta si el componente vive exactamente 3 niveles adentro de `ac-lit` (`packages/components/x/`); para cualquier componente afuera del monorepo (el caso de uso real de `ac component:create` corrido en otra carpeta) esa ruta fija simplemente no existe. Resolverlo vía `node_modules/@ac-base/cli/...` funciona sin importar dónde viva el componente, mientras `@ac-base/cli` sea una dependencia resoluble (`workspace:^` adentro del monorepo, `link:` afuera). Por eso todo componente (catálogo o template del CLI) tiene `@ac-base/cli` como `devDependency`.

> Esto resuelve el `.scss`. Los archivos `demo/public/*.html` (los `href` de cada `ac-demo-case`) siguen sin recargarse solos — `ac-demo-case` los carga una sola vez con `fetch()`, no son un módulo que Vite rastree. Ahí todavía hace falta recargar la pestaña a mano después de editarlos.

### Consumir un paquete de `ac-lit` desde un proyecto externo (sin publicar a npm)

Mientras ningún paquete esté publicado, un proyecto fuera de este monorepo (ej. un componente personal armado con `ac component:create` en otra carpeta, usando componentes del catálogo como dependencia) los consume con el protocolo `link:` de pnpm en vez de una versión real:

```json
"dependencies": {
  "@ac-components/ac-button-basic": "link:G:/ac-lit/packages/components/ac-button-basic"
}
```

Cosas a tener en cuenta, encontradas armando el primer componente personal así:

- **Cada `"workspace:^"` del `package.json` generado por el scaffold hay que reemplazarlo por un `link:`** apuntando a la ruta real dentro de `ac-lit` — `workspace:^` solo se resuelve dentro del workspace de pnpm de `ac-lit`. Esto incluye los 5 paquetes base que usa cualquier componente (`ac-component-mixin`, `ac-intl-mixin`, `ac-core`, `ac-demo-content`, `ac-e2e-testing`) **y `@ac-base/cli`** (lo usa el componente para resolver su propio `build:styles`, ver más arriba), más los componentes reales que se quieran usar.
- **`src/*.styles.js` es un archivo generado y gitignorado** — no existe hasta que alguien corre `build:styles`/`build`/`test`/`component:serve` para ese paquete _dentro de `ac-lit`_. Un proyecto externo que linkea un componente que nunca se construyó ahí se va a encontrar con `Failed to resolve import "./x.styles.js"` al levantar su demo. **No hay un hook automático que lo resuelva**: se probó agregar un script `prepare` (el mecanismo estándar de npm para "compilar antes de ser consumido") y pnpm **no lo corre para dependencias `link:`** — solo lo corre para paquetes del propio workspace. Mientras no se publiquen los paquetes de verdad (con el build incluido en lo que se publica), la regla práctica es: antes de linkear un paquete desde afuera, asegurate de haber corrido al menos una vez `pnpm build` (o `pnpm run build:styles`) para ese paquete dentro de `ac-lit`.
- **El scope `@ac-components/` que pone el scaffold en `"name"` es el del catálogo** — correcto si el componente va a vivir en `packages/components/`, no si es un componente personal/externo como este. El CLI no distingue los dos casos hoy; cambiá el scope a mano (o ninguno) si no es de catálogo.

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
