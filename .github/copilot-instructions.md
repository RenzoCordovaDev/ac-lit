# Instrucciones para GitHub Copilot — ac-lit

Antes de cualquier cambio, leé (en este orden):

1. [`PROGRESS.md`](../PROGRESS.md) — estado actual del proyecto: qué está hecho, qué sigue, qué está bloqueado, qué decisiones ya se tomaron (no las reabras sin motivo).
2. [`docs/CONVENTIONS.md`](../docs/CONVENTIONS.md) — arquitectura, naming, convenciones de componentes/CLI/tests/accesibilidad. Es la fuente de verdad técnica.
3. [`CONTRIBUTING.md`](../CONTRIBUTING.md) — flujo de ramas, convención de commits, versionado con Changesets.

No dupliques esas convenciones acá — si algo cambia, se actualiza en esos archivos, no en este.

## Reglas no negociables

- **Conventional Commits**, forzado por commitlint. Sin rastro de IA en commits/PRs (sin trailers de co-autoría, sin menciones) salvo que el mantenedor lo pida explícitamente para un commit puntual.
- **Trunk-based**: rama corta desde `main` (prefijo `feat/`, `fix/`, `docs/`, etc.), PR obligatorio, CI en verde (lint + test), squash merge. Nunca push directo a `main` (está protegida).
- **Sin TypeScript** en ningún paquete. **Sin wizard interactivo** en la CLI — defaults sensatos, flags solo para excepciones.
- Todo componente nuevo usa la propiedad **`ambient`** (heredada de `ComponentMixin`), nunca `variant`.
- Toda demo de componente usa **`@ac-base/ac-demo-content`** — nunca reimplementes a mano un selector de caso/idioma/tema/tamaño/panel de eventos. Ver la API completa en `packages/base/ac-demo-content/README.md`.
- Tests unitarios: interfaz TDD de Mocha (**`suite`/`test`**, no `describe`/`it`), **un solo `expect` por test**.
- Los archivos `href` de cada `ac-demo-case` van en `demo/public/`, nunca directo en `demo/` (Vite solo copia `public/` tal cual al build).
- **Nunca uses `opacity` para atenuar texto** — rompe contraste WCAG de forma impredecible entre temas. Para fondos sólidos con texto fijo, usá los tokens semánticos fijos (`--color-neutral`, `--color-success`, etc.), nunca `--color-muted`/`--color-bg`/`--color-surface` (cambian entre modo claro/oscuro). Para texto sin caja propia (va directo sobre la página), usá `:host-context([data-theme='light'])` para adaptarlo al tema. Ver "Dark-mode y colores de fondo sólido" en `docs/CONVENTIONS.md`.
- Validá accesibilidad en **ambos temas** (claro y oscuro), no solo el default — varios bugs reales de contraste solo aparecían en uno de los dos.

## Al terminar una tarea con cambios reales

En el mismo PR (no en uno aparte):

1. Actualizá **`PROGRESS.md`**: mové lo completado de "Pendiente" a "Completado" (con el número de PR), y dejá el próximo paso concreto si cambió.
2. Si encontraste o estableciste un **patrón nuevo, una convención, o un bug real** (ej. un problema de contraste, una limitación de una librería), documentalo en **`docs/CONVENTIONS.md`** — no dejes ese conocimiento solo en el mensaje del commit.
3. Si el cambio afecta la API pública de un paquete (`@ac-base/*`, `@ac-components/*`), actualizá su `README.md`.

No asumas que esto queda implícito — decilo explícitamente al pedir una tarea no trivial, por ejemplo: _"...y cuando termines, actualizá PROGRESS.md con lo que se hizo y docs/CONVENTIONS.md si encontraste algo nuevo, en el mismo commit."_

## Cómo trabajar: planificá antes de ejecutar

Para cualquier tarea no trivial (más de un archivo, más de un paso, o con incertidumbre real sobre la causa/solución), no improvises cambios amplios directo en el código:

1. **Descomponé la tarea primero.** Antes de tocar archivos, dividila en piezas con un resultado verificable cada una (un archivo o módulo concreto, un criterio de "terminado" claro — qué test pasa, qué se ve en el navegador, qué comando corre sin error). Si vas a usar el modo agente, dale ese plan completo de entrada, no "arreglá esto" a secas.
2. **Para debugging de causa incierta** (un bug que no se explica a la primera, código que hay que leer mucho para entender), primero investigá y confirmá la causa raíz con evidencia (un log, una prueba reproducible) antes de empezar a cambiar código a prueba y error — cada iteración sin diagnóstico cuesta más de lo que ahorra.
3. **Piezas realmente independientes del trabajo pendiente** (componentes separados del catálogo, el `.gitignore` de `.styles.js`, etc.) conviene asignarlas por separado — como tarea de GitHub Copilot coding agent o como issue aparte — en vez de resolver todo en una sola sesión larga de edición.
4. **Validá acotado mientras iterás, completo solo al cerrar.** Mientras trabajás en un paquete, corré solo sus propios tests (`pnpm --filter <paquete> run component:test...`). La corrida completa del monorepo (lint + build + unit + e2e + a11y de todos los paquetes) es el último paso antes de commitear/abrir PR, no algo para repetir en cada vuelta.

Esto no es una preferencia de estilo — es la forma de trabajar por defecto en este repo mientras haya tareas complejas pendientes (catálogo de componentes, scaffolding del CLI, decisiones de arquitectura), precisamente para no gastar de más resolviendo todo sin un plan.
