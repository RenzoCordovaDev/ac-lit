# Guía para agentes de IA — ac-lit

Contexto del proyecto para cualquier asistente de código (Claude, Copilot, Gemini, Cursor, etc.). Es la base compartida del repositorio — cada colaborador puede copiarla a su propio archivo de configuración local (`CLAUDE.md`, `.github/copilot-instructions.md`, `GEMINI.md`, `.cursorrules`, ...) y ajustarla a su flujo de trabajo; esos archivos personales no se versionan (ver `.gitignore`).

Antes de cualquier cambio, lee:

1. [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) — arquitectura, naming, convenciones de componentes/CLI/tests/accesibilidad. Es la fuente de verdad técnica.
2. [`CONTRIBUTING.md`](CONTRIBUTING.md) — flujo de ramas, convención de commits, versionado con Changesets.

No dupliques esas convenciones acá — si algo cambia, se actualiza en esos archivos, no en este.

## Reglas no negociables

- **Conventional Commits**, forzado por commitlint (hook `commit-msg` de Husky) — un commit que no respete el formato se rechaza automáticamente.
- **Trunk-based**: rama corta desde `main` (prefijo `feat/`, `fix/`, `docs/`, etc.), PR obligatorio, CI en verde (lint + test), squash merge. Nunca push directo a `main` (está protegida).
- **Sin TypeScript** en ningún paquete. **Sin wizard interactivo** en la CLI — defaults sensatos, flags solo para excepciones.
- Todo componente nuevo usa la propiedad **`ambient`** (heredada de `ComponentMixin`), nunca `variant`.
- Toda demo de componente usa **`@ac-base/ac-demo-content`** — nunca reimplementes a mano un selector de caso/idioma/tema/tamaño/panel de eventos. Ver la API completa en `packages/base/ac-demo-content/README.md`.
- Tests unitarios: interfaz TDD de Mocha (**`suite`/`test`**, no `describe`/`it`), **un solo `expect` por test**.
- Los archivos `href` de cada `ac-demo-case` van en `demo/public/`, nunca directo en `demo/` (Vite solo copia `public/` tal cual al build).
- **Nunca uses `opacity` para atenuar texto** — rompe contraste WCAG de forma impredecible entre temas. Para fondos sólidos con texto fijo, usa los tokens semánticos fijos (`--color-neutral`, `--color-success`, etc.), nunca `--color-muted`/`--color-bg`/`--color-surface` (cambian entre modo claro/oscuro). Para texto sin caja propia (va directo sobre la página), usa `:host-context([data-theme='light'])` para adaptarlo al tema. Ver "Dark-mode y colores de fondo sólido" en `docs/CONVENTIONS.md`.
- Valida accesibilidad en **ambos temas** (claro y oscuro), no solo el default — varios bugs reales de contraste solo aparecían en uno de los dos.

## Al terminar una tarea con cambios reales

En el mismo PR (no en uno aparte):

1. Si encontraste o estableciste un **patrón nuevo, una convención, o un bug real** (ej. un problema de contraste, una limitación de una librería), documéntalo en **`docs/CONVENTIONS.md`** — no dejes ese conocimiento solo en el mensaje del commit.
2. Si el cambio afecta la API pública de un paquete (`@ac-base/*`, `@ac-components/*`), actualiza su `README.md`.

No asumas que esto queda implícito — dilo explícitamente al pedir una tarea no trivial.

## Cómo trabajar: lidera, no ejecutes todo tú mismo

Para cualquier tarea no trivial (más de un archivo, más de un paso, o con incertidumbre real sobre la causa/solución), el rol por defecto es **líder de equipo que orquesta subagentes**, no ejecutor único de principio a fin:

1. **Analiza y descompón primero.** Antes de tocar código, divide la tarea en piezas con un resultado verificable cada una (un archivo o módulo concreto, un criterio de "terminado" claro — qué test pasa, qué se ve en el navegador, qué comando corre sin error).
2. **Delega la pieza, no el pensamiento.** Un subagente recibe un encargo completo y autocontenido: archivos exactos, comportamiento esperado, criterio de aceptación, qué está fuera de alcance. Nunca "investiga por qué pasa esto y arréglalo" sin más contexto — eso se define antes de delegar, así el subagente ejecuta sin tener que volver a preguntar.
3. **Usa exploración aislada para todo lo exploratorio o de prueba-y-error** (debugging de un bug esquivo, revisar muchos archivos para entender algo, iterar hipótesis en el navegador) — así el ruido de los intentos intermedios no satura el contexto principal; solo vuelve la conclusión.
4. **Valida acotado mientras iteras, completo solo al cerrar.** Mientras se trabaja en un paquete, corre solo sus propios tests (`pnpm --filter <paquete> run component:test...`). La corrida completa del monorepo (lint + build + unit + e2e + a11y de todos los paquetes) es el último paso antes de commitear/abrir PR, no algo para repetir en cada vuelta.
5. **Quien lidera revisa y es responsable del resultado final.** El subagente reporta; quien coordina decide si está bien, lo integra, y valida antes de dar la tarea por cerrada. Delegar la ejecución no delega el criterio.

Esto no es una preferencia de estilo — es la forma de trabajar por defecto en este repo mientras haya tareas complejas pendientes (catálogo de componentes, scaffolding del CLI), para no gastar de más resolviendo todo en un solo hilo largo.
