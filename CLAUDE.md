# Instrucciones para Claude Code — ac-lit

Antes de cualquier cambio, leé (en este orden):

1. [`PROGRESS.md`](PROGRESS.md) — estado actual del proyecto: qué está hecho, qué sigue, qué está bloqueado, qué decisiones ya se tomaron (no las reabras sin motivo).
2. [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) — arquitectura, naming, convenciones de componentes/CLI/tests/accesibilidad. Es la fuente de verdad técnica.
3. [`CONTRIBUTING.md`](CONTRIBUTING.md) — flujo de ramas, convención de commits, versionado con Changesets.

No dupliques esas convenciones acá — si algo cambia, se actualiza en esos archivos, no en este.

## Reglas no negociables

- **Conventional Commits**, forzado por commitlint. Sin rastro de IA en commits/PRs (sin trailers de co-autoría, sin menciones) salvo que el mantenedor lo pida explícitamente para un commit puntual.
- **Trunk-based**: rama corta desde `main` (prefijo `feat/`, `fix/`, `docs/`, etc.), PR obligatorio, CI en verde (lint + test), squash merge. Nunca push directo a `main` (está protegida).
- **Commit sin push automático**: commiteá en local y esperá confirmación explícita de Renzo antes de `git push`, salvo que la tarea en curso ya haya sido autorizada para subir y abrir PR.
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

## Cómo trabajar: liderá, no ejecutes todo vos mismo

Para cualquier tarea no trivial (más de un archivo, más de un paso, o con incertidumbre real sobre la causa/solución), el rol por defecto es **líder de equipo que orquesta subagentes**, no ejecutor único de principio a fin:

1. **Analizá y descomponé primero.** Antes de tocar código, dividí la tarea en piezas con un resultado verificable cada una (un archivo o módulo concreto, un criterio de "terminado" claro — qué test pasa, qué se ve en el navegador, qué comando corre sin error).
2. **Delegá la pieza, no el pensamiento.** Un subagente (fork o agente nuevo) recibe un encargo completo y autocontenido: archivos exactos, comportamiento esperado, criterio de aceptación, qué está fuera de alcance. Nunca "investigá por qué pasa esto y arreglalo" sin más contexto — eso te toca a vos definirlo antes de delegar, así el subagente ejecuta sin tener que volver a preguntar.
3. **Usá un fork para todo lo exploratorio o de prueba-y-error** (debugging de un bug esquivo, revisar muchos archivos para entender algo, iterar hipótesis en el navegador) — el fork hereda tu contexto completo, así que no hay que reexplicarle nada, y el ruido de sus intentos intermedios no vuelve a esta conversación; solo la conclusión.
4. **Validá acotado mientras iterás, completo solo al cerrar.** Mientras trabajás en un paquete, corré solo sus propios tests (`pnpm --filter <paquete> run component:test...`). La corrida completa del monorepo (lint + build + unit + e2e + a11y de todos los paquetes) es el último paso antes de commitear/abrir PR, no algo para repetir en cada vuelta.
5. **Vos revisás y sos responsable del resultado final.** El subagente reporta; vos decidís si está bien, lo integrás, y sos quien valida antes de avisarle a Renzo que algo quedó listo. Delegar la ejecución no delega el criterio.

Esto no es una preferencia de estilo — es la forma de trabajar por defecto en este repo mientras haya tareas complejas pendientes (catálogo de componentes, scaffolding del CLI, decisiones de arquitectura como el `.gitignore` de los `.styles.js`), precisamente para no gastar de más resolviendo todo en un solo hilo largo.
