# Progreso de ac-lit

Checklist de avance del proyecto, para retomar sin depender de la conversación. Fecha de este corte: **2026-11-08**.

## Completado (mergeado a `main`)

- **Bootstrap del repo**: git/GitHub (identidad `RenzoCordovaDev` vía noreply, sin rastro de IA en commits/PRs), licencia MIT, ESLint+Prettier, Changesets, commitlint+Husky, branch protection en `main` (PR #1-4).
- **Paquetes base**: `@ac-base/ac-core`, `@ac-base/ac-component-mixin`, `@ac-base/ac-scoped-elements-mixin`, `@ac-base/ac-intl-mixin`.
- **`@ac-base/ac-e2e-testing`** (PR #6): config compartida WebdriverIO v10 + Cucumber + axe-core (inyectado directo, sin `@axe-core/webdriverio` por incompatibilidad con WDIO v10).
- **Catálogo de componentes**, los 3 con molde completo (`src/`+`test/`+`test_e2e/`+`demo/`):
  - `ac-button-basic` (PR #4/#6)
  - `ac-link-basic` (PR #7) — link real, no boilerplate del repo de referencia
  - `ac-badge-basic` (PR #8) — variantes semánticas de estado, sin interacción
- **`@ac-base/cli`** (PR #9, ver abajo): `ac component create`, passthrough genérico de tareas.

## En curso

- **PR #9 — CLI**: https://github.com/RenzoCordovaDev/ac-lit/pull/9
  - Estado: **abierto, CI en verde** (`lint-and-test` + `e2e` pasaron). Falta que Renzo confirme el merge.
  - Rama: `feat/cli-base`.

## Pendiente / siguiente paso concreto

1. **Mergear PR #9** una vez Renzo lo confirme (mismo flujo manual de siempre — nunca auto-merge en este proyecto).
2. **`ac app create <nombre>`** — queda como stub (`throw new Error(...)`) en `cli/src/commands/app-create.js`. Es scaffold de un proyecto `ac-lit` completo nuevo (bootstrap de monorepo: `pnpm-workspace.yaml`, root `package.json`, ESLint, Husky, docs, etc.) — pieza grande e independiente, no empezada.
3. **Usar la CLI para el próximo componente** en vez de construirlo a mano: `cd packages/components && ac component create ac-<nombre>` (o `node ../../cli/bin/ac.js ...` hasta que el CLI esté linkeado como bin). Sirve además como prueba de regresión real del scaffold.
4. **Promover el job `e2e` de CI a required status check** — hoy es `continue-on-error: true`, no bloqueante a propósito (decisión de Renzo: observar varias corridas estables antes de confiar en él). Aún no se ha pedido promoverlo.

## Bloqueado / fuera de este repo

- **`G:\academy_cells`** (carpeta de referencia original, ya no se usa como base) no se pudo renombrar/borrar por un lock de archivo del SO. Renzo dijo que lo maneja él manualmente si hace falta.

## Decisiones ya tomadas (no reabrir sin motivo)

- Sin TypeScript en ningún paquete (incluida la CLI) — consistencia con el resto del monorepo.
- Sin wizard interactivo en la CLI — defaults sensatos, flags solo para excepciones.
- Templates de la CLI: archivos reales + reemplazo de tokens `__token__` propio, sin motor de templates. `cli/templates/` está en `.prettierignore` (un `__token__` suelto en Markdown colisiona con énfasis `__bold__`).
- Cero rastro de Claude/IA en commits y PRs de este repo, salvo que Renzo pida lo contrario explícitamente.

Ver `docs/CONVENTIONS.md` para arquitectura/naming, `CONTRIBUTING.md` para el flujo de ramas y commits.
