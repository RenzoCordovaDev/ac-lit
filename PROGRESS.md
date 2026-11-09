# Progreso de ac-lit

Checklist de avance del proyecto, para retomar sin depender de la conversación. Última actualización: **2026-11-08**.

## Completado (mergeado a `main`)

- **Bootstrap del repo**: git/GitHub (identidad `RenzoCordovaDev` vía noreply, sin rastro de IA en commits/PRs), licencia MIT, ESLint+Prettier, Changesets, commitlint+Husky, branch protection en `main` (PR #1-4).
- **Paquetes base**: `@ac-base/ac-core` (incluye paleta `light` para dark-mode), `@ac-base/ac-component-mixin`, `@ac-base/ac-scoped-elements-mixin`, `@ac-base/ac-intl-mixin`.
- **`@ac-base/ac-e2e-testing`** (PR #6): config compartida WebdriverIO v10 + Cucumber + axe-core (inyectado directo, sin `@axe-core/webdriverio` por incompatibilidad con WDIO v10). Ya no fuerza `wdio:enforceWebDriverClassic` (PR #13) — selectores que atraviesan shadow DOM se encadenan (`$(host).$('.hijo')`).
- **Catálogo de componentes**, los 4 con molde completo (`src/`+`test/`+`test_e2e/`+`demo/`):
  - `ac-button-basic` (PR #4/#6)
  - `ac-link-basic` (PR #7) — link real, no boilerplate del repo de referencia
  - `ac-badge-basic` (PR #8) — variantes semánticas de estado, sin interacción
  - `ac-radio-basic` (PR #12) — primero generado con `ac component create`; agrupado entre instancias coordinado a mano (radios nativos no agrupan entre shadow roots)
- **`@ac-base/cli`** (PR #9): `ac component create`, passthrough genérico de tareas. Comando para levantar el dev server renombrado a `component:serve` (PR #16) — `app:serve` queda reservado para cuando exista `ac app create`.
- **Convención de tests** (PR #11): `suite`/`test` (interfaz TDD de Mocha) en vez de `describe`/`it`, un solo `expect` por test — aplicado a los 4 componentes y al template de la CLI. **No** a los paquetes base (`ac-core`, `ac-component-mixin`, etc. — fuera de alcance, no pedido).
- **`@ac-base/ac-demo-content`** (PR #13): contenedor centralizado de demos (casos, idioma, ambient, dark-mode, tamaño, panel de eventos), construido y validado de forma aislada (con `ac-button-basic` como contenido de ejemplo).
- **Migración de los 4 componentes + template del CLI a `ac-demo-content`** (PR #15), con renombre `variant` → `ambient` en los 4. Dos bugs de contraste reales encontrados y corregidos gracias a las nuevas escenas de accesibilidad en modo claro:
  - `ac-badge-basic` — variant `neutral` usaba `--color-muted` (cambia entre temas) con texto fijo blanco; pasó a `--color-neutral` (fijo).
  - `ac-button-basic` (`secondary-alt`) y `ac-link-basic` (sus 4 variants, sin caja propia) tenían texto pensado para fondo oscuro, usado directo sobre la página — resuelto con fondo propio estable o `:host-context([data-theme='light'])` según el caso. Ver "Dark-mode y colores de fondo sólido" en `docs/CONVENTIONS.md`.
- **Rediseño de `ac-demo-content`** (PR #17):
  - Modo claro por defecto (antes oscuro); selects de caso/ambient modernizados.
  - Idioma, tema y tamaño de dispositivo ahora son controles segmentados (borde redondeado + divisor vertical + opción activa resaltada) — idioma exige exactamente 2 locales (ES/EN), tema son 2 iconos (sol/luna).
  - Tamaño de dispositivo: 3 presets fijos con **ancho y alto fijos** (móvil 375×667 por defecto, tablet 768×1024, desktop 1280×720) — el contenido scrollea adentro del marco simulado en vez de estirarlo.
  - Switcher de caso siempre visible (antes se ocultaba con un solo caso).
  - Nuevo toggle Visual/Código — "Código" muestra el HTML fuente real del caso activo (`ac-demo-case.source`).
  - Nuevo panel lateral de eventos (reemplaza el modal centrado), con cada campo etiquetado (`Evento:`, `Hora:`, `Payload:`).
  - Nuevo header: `name` (reemplaza el `<h1>` manual de cada `demo/index.html`, sin `<>`), `tech` (badge, "Lit v3"), `package-name` (snippets pnpm/npm) y `docs-href` (link a documentación).
  - Dos bugs más encontrados vía el a11y check existente: un link reusando un color pensado para fondo oscuro (mismo patrón que badge/button/link antes), y un falso positivo intermitente de axe-core por una transición CSS muestreada a mitad de camino (se sacó la transición).
  - Todo propagado a los 4 componentes + `ac-demo-content` + template del CLI.
- **Hot-reload de `.scss` en dev** (PR #17): el script de compilación (ahora `cli/scripts/compile-scss-to-lit.cjs`) soporta `--watch`; `component:serve`/`dev` corre ese watcher en paralelo a `vite demo` vía `concurrently` — guardar un `.scss` con el server corriendo ahora recarga el navegador solo, sin reiniciar nada. Antes solo compilaba una vez al arrancar.
- **Primera prueba real del CLI fuera del monorepo**: se armó un componente personal totalmente aislado (afuera de `packages/components/`, usando los 4 componentes del catálogo como dependencias vía `link:`) para validar que el flujo de `ac component create` + consumo externo funciona de punta a punta. Encontró y corrigió dos bugs reales del CLI/scaffolding:
  - El script `compile-scss-to-lit.cjs` vivía en `scripts/` (raíz del monorepo, fuera de `@ac-base/cli`) y los `package.json` generados lo referenciaban con una ruta relativa fija (`../../../scripts/...`) que solo es correcta si el componente vive exactamente 3 niveles adentro de `ac-lit`. Se movió a `cli/scripts/` (ahora se publica con el paquete del CLI) y cada componente lo referencia vía `node_modules/@ac-base/cli/scripts/...` — funciona sin importar dónde viva el componente. Se agregó `@ac-base/cli` como `devDependency` a los 4 componentes, `ac-demo-content` y el template del CLI.
  - Se probó (y descartó) agregar un script `prepare` para que `src/*.styles.js` se genere solo al instalar un paquete `link:` desde afuera — pnpm no corre `prepare` para dependencias `link:`. Documentada la regla práctica en su lugar (ver "Consumir un paquete de `ac-lit` desde un proyecto externo" en `docs/CONVENTIONS.md`).
- **CLI: comandos colon-style + `ac help`** (PR #22): `ac component create` → `ac component:create` y `ac app create` → `ac app:create` (la sintaxis con espacio ya no existe y sugiere la nueva). Nuevo `ac help` (también `ac -h`/`--help`/`ac` a secas) que lista los comandos propios, las tareas habituales y los scripts del `package.json` del directorio actual. Los comandos propios viven en un único registro (`cli/src/commands/registry.js`) del que leen Commander y la ayuda; tienen prioridad sobre un script homónimo.
- **Scripts homologados a `component:*`** (PR #23): `build:styles`, `build:styles:watch`, `build`, `preview`, `test`, `test:e2e`, `test:e2e:run`, `test:e2e:a11y` y `test:e2e:a11y:run` pasan a `component:<nombre>` en los 4 componentes, `ac-demo-content` (donde además `dev` → `component:serve`) y el template del CLI. Renombrado limpio, sin alias; las libs sin demo (`ac-core`, mixins, `cli`) conservan `test`. Los agregadores de la raíz encadenan `test` y `component:test` con `--if-present`; `build` y los e2e solo existen como `component:*`. Como `--if-present` omite sin error un script mal nombrado (CI en verde sin ejecutar nada), se añadió `cli/test/package-scripts.test.js`, que exige el juego completo de `component:*` en todo paquete con `demo/` y en el template. Validado con corridas reales de `pnpm test`, `pnpm build`, `pnpm test:e2e` y `pnpm test:e2e:a11y` (5 paquetes cada una). Documentado en "Scripts de paquete (`component:*`)" de `docs/CONVENTIONS.md`.
- **Mejoras de `ac-demo-content`** (PR #24): (1) el selector de caso va solo en su propia fila (los `header` largos ya no compiten con los demás controles); (2) lista desplegable moderna — `<select>` nativo con `appearance: base-select` (estiliza también la lista en Chromium, fallback nativo en el resto), aplicada también al select de `ambients`; (3) la vista "Código" ahora es un editor: barra de título con el nombre del archivo, líneas numeradas y resaltado de sintaxis HTML (`src/highlight-html.js`, tokenizador propio sin dependencias), con paleta fija oscura en ambos temas; (4) los snippets de instalación (`pnpm add`/`npm i`) son botones que copian al portapapeles, con estado "copiado", anuncio a lectores de pantalla y evento `ac-demo-content-copy`. Tests unitarios y E2E/a11y nuevos (incl. vista de código en modo oscuro y lectura real del portapapeles). Hallazgos documentados en `docs/CONVENTIONS.md`: axe da falsos positivos con un `base-select` abierto (se audita con `context`) y leer el portapapeles en E2E exige `browser.setPermissions`. Además, el preset Desktop pasó de 1280×720 a **1280×800** y el `.demo-root` de cada `demo-base.css` (4 componentes, `ac-demo-content`, template) de `820px` a `1440px`: con 820 px el marco Desktop quedaba recortado al mismo ancho que Tablet (el marco usa `max-width` y no puede exceder a su contenedor).
- **Ampliación del catálogo — Lote 1: texto y formularios** (PR pendiente): `ac-text-basic` (texto traducible con `this.t()`; `addTextTranslations`, `translations`, `params`, `tag` con lista blanca, `size`), `ac-input-basic` (etiqueta, ayuda, error con `role="alert"`, `a11y-label`, tipos con lista blanca), `ac-checkbox-basic` (marcado/indeterminado) y `ac-switch-basic` (`role="switch"`). Los 4 con molde completo (`src/`+`test/`+`test_e2e/`+`demo/`+README+locales), `ambient` `primary`/`secondary`, E2E y accesibilidad en ambos temas. Patrones y hallazgos en la sección "Controles de formulario y texto" de `docs/CONVENTIONS.md`. **Roadmap acordado con Renzo (10 componentes, 3 lotes, una PR por lote):** Lote 2 = `ac-select-basic`, `ac-slider-basic`, `ac-expandable-basic`; Lote 3 = `ac-modal-basic` (reutiliza `ac-button-basic` y `ac-link-basic`), `ac-toast-basic`, `ac-tabs-basic`.

## Pendiente / siguiente paso concreto

1. **Lote 2 del catálogo**: `ac-select-basic` (select+option en un componente), `ac-slider-basic`, `ac-expandable-basic` (con `group` para "uno abierto a la vez", patrón del registro de `ac-radio-basic`). Luego el Lote 3 (`ac-modal-basic`, `ac-toast-basic`, `ac-tabs-basic`).
2. **Revisar el estilo visual de los 4 componentes en sí** (`ac-button-basic`, `ac-link-basic`, `ac-badge-basic`, `ac-radio-basic`) — lo de `ac-demo-content` fue el _contenedor_ de la demo; los componentes reales (bordes, tipografía, espaciado) siguen con el estilo original. Siguiente tarea explícitamente acordada con Renzo.
3. **`ac app:create <nombre>`** — queda como stub (`throw new Error(...)`) en `cli/src/commands/app-create.js`. Scaffold de un proyecto `ac-lit` completo nuevo — pieza grande e independiente, no empezada.
4. **Promover el job `e2e` de CI a required status check** — hoy es `continue-on-error: true`, no bloqueante a propósito (decisión de Renzo: observar varias corridas estables antes de confiar en él). Aún no se ha pedido promoverlo.

## Bloqueado / fuera de este repo

- **`G:\academy_cells`** (carpeta de referencia original, ya no se usa como base) no se pudo renombrar/borrar por un lock de archivo del SO. Renzo dijo que lo maneja él manualmente si hace falta.

## Decisiones ya tomadas (no reabrir sin motivo)

- Sin TypeScript en ningún paquete (incluida la CLI) — consistencia con el resto del monorepo.
- Sin wizard interactivo en la CLI — defaults sensatos, flags solo para excepciones.
- Templates de la CLI: archivos reales + reemplazo de tokens `__token__` propio, sin motor de templates. `cli/templates/` está en `.prettierignore` (un `__token__` suelto en Markdown colisiona con énfasis `__bold__`).
- `ac-demo-case` (de `ac-demo-content`) deliberadamente sin Shadow DOM — ver `docs/CONVENTIONS.md`.
- Los archivos `href` de cada `ac-demo-case` van en `demo/public/`, no en `demo/` a secas (Vite solo copia `public/` al build) — y siguen necesitando recarga manual del navegador al editarlos (se cargan con `fetch()` en runtime, Vite no los rastrea).
- Paleta de colores actual (verde esmeralda + ámbar) se mantiene — evaluada una paleta nueva con más identidad, Renzo decidió no cambiarla por ahora.
- Cero rastro de Claude/IA en commits y PRs de este repo, salvo que Renzo pida lo contrario explícitamente.

Ver `docs/CONVENTIONS.md` para arquitectura/naming, `CONTRIBUTING.md` para el flujo de ramas y commits.
