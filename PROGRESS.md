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
- **`@ac-base/cli`** (PR #9): `ac component create`, passthrough genérico de tareas.
- **Convención de tests** (PR #11): `suite`/`test` (interfaz TDD de Mocha) en vez de `describe`/`it`, un solo `expect` por test — aplicado a los 4 componentes y al template de la CLI. **No** a los paquetes base (`ac-core`, `ac-component-mixin`, etc. — fuera de alcance, no pedido).
- **`@ac-base/ac-demo-content`** (PR #13): contenedor centralizado de demos (casos, idioma, ambient, dark-mode, tamaño, panel de eventos), construido y validado de forma aislada (con `ac-button-basic` como contenido de ejemplo).

## En progreso (rama `feat/migrate-demo-content`, sin PR abierta aún)

- **Migración de los 4 componentes + template del CLI a `ac-demo-content`**, con renombre `variant` → `ambient`. Completa y validada (lint/format/build/unit/e2e/a11y en todo el monorepo, incluyendo un componente generado de prueba vía `ac component create` para validar el template de punta a punta). Incluye dos bugs de contraste reales encontrados y corregidos gracias a las nuevas escenas de accesibilidad en modo claro (antes solo se probaba en modo oscuro):
  - `ac-badge-basic` — variant `neutral` usaba `--color-muted` (cambia entre temas) con texto fijo blanco; se cambió a `--color-neutral` (fijo).
  - `ac-button-basic` — variant `secondary-alt` tenía fondo `transparent` con texto claro pensado para fondo de página oscuro; se le dio fondo propio estable (`--color-accent-100`/`--color-accent-900`).
  - `ac-link-basic` (sin caja propia, texto directo sobre el fondo de página) tenía el mismo problema en sus 4 variants; se resolvió con colores de texto dependientes del tema vía `:host-context([data-theme='light'])`.
  - Ver la sección "Dark-mode y colores de fondo sólido" en `docs/CONVENTIONS.md` para el patrón general.
- Pendiente: commitear, abrir PR y mergear esta rama.

## Pendiente / siguiente paso concreto

1. **`ac app create <nombre>`** — queda como stub (`throw new Error(...)`) en `cli/src/commands/app-create.js`. Scaffold de un proyecto `ac-lit` completo nuevo — pieza grande e independiente, no empezada.
2. **Promover el job `e2e` de CI a required status check** — hoy es `continue-on-error: true`, no bloqueante a propósito (decisión de Renzo: observar varias corridas estables antes de confiar en él). Aún no se ha pedido promoverlo.

## Bloqueado / fuera de este repo

- **`G:\academy_cells`** (carpeta de referencia original, ya no se usa como base) no se pudo renombrar/borrar por un lock de archivo del SO. Renzo dijo que lo maneja él manualmente si hace falta.

## Decisiones ya tomadas (no reabrir sin motivo)

- Sin TypeScript en ningún paquete (incluida la CLI) — consistencia con el resto del monorepo.
- Sin wizard interactivo en la CLI — defaults sensatos, flags solo para excepciones.
- Templates de la CLI: archivos reales + reemplazo de tokens `__token__` propio, sin motor de templates. `cli/templates/` está en `.prettierignore` (un `__token__` suelto en Markdown colisiona con énfasis `__bold__`).
- `ac-demo-case` (de `ac-demo-content`) deliberadamente sin Shadow DOM — ver `docs/CONVENTIONS.md`.
- Los archivos `href` de cada `ac-demo-case` van en `demo/public/`, no en `demo/` a secas (Vite solo copia `public/` al build).
- Cero rastro de Claude/IA en commits y PRs de este repo, salvo que Renzo pida lo contrario explícitamente.

Ver `docs/CONVENTIONS.md` para arquitectura/naming, `CONTRIBUTING.md` para el flujo de ramas y commits.
