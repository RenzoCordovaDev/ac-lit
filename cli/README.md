# @ac-base/cli

CLI de `ac-lit` — comando `ac`. Implementado con [Commander.js](https://github.com/tj/commander.js), sin wizard interactivo ni resolución de rutas/config: siempre opera sobre el directorio desde el que lo ejecutas.

## Uso

Dentro de este monorepo (sin instalar nada):

```bash
node cli/bin/ac.js component:create ac-mi-componente
```

Una vez publicado, como dependencia o global:

```bash
pnpm add -D @ac-base/cli   # o: npm i -g @ac-base/cli
ac component:create ac-mi-componente
```

Todos los comandos usan la forma `<tipo>:<accion>` (no subcomandos con espacio). `ac help` (o `ac -h`, `ac --help`, `ac` a secas) lista todos los comandos propios, las tareas habituales y los scripts del `package.json` del directorio actual.

### Scaffolding

- **`ac component:create <nombre> [--no-e2e]`** — genera un componente completo (`src/`, `test/`, `test_e2e/`, `demo/`, `locales.json`, `index.js`, `package.json`, `README.md`) en el directorio actual. `<nombre>` debe tener el prefijo `ac-` y ser kebab-case (ej. `ac-mi-componente`); de ahí se derivan la clase (`MiComponente`), el archivo (`mi-componente.js`), el paquete npm (`@ac-components/ac-mi-componente`), etc.
  - Para agregar un componente al catálogo de `ac-lit`: `cd packages/components && ac component:create ac-mi-componente`.
- **`ac app:create <nombre>`** — scaffolding de un proyecto `ac-lit` nuevo. **Pendiente de implementar.**

### Ayuda

- **`ac help`** — lista todos los comandos disponibles.

Los comandos propios (`component:create`, `app:create`) se declaran en `src/commands/registry.js`; Commander y `ac help` leen de ese único registro. Tienen prioridad sobre un script de `package.json` con el mismo nombre. La sintaxis anterior (`ac component create`) ya no existe y sugiere la forma nueva.

### Tareas (passthrough genérico)

Cualquier otro comando es un passthrough directo a `pnpm run <nombre>` en el directorio actual:

```bash
ac component:serve           # = pnpm run component:serve — levanta el demo con Vite en http://localhost:5173
ac component:build           # = pnpm run component:build
ac component:preview         # = pnpm run component:preview
ac component:test            # = pnpm run component:test
ac component:test:e2e        # = pnpm run component:test:e2e
ac component:test:e2e:a11y   # = pnpm run component:test:e2e:a11y
ac lint                      # = pnpm run lint (donde exista ese script)
```

El CLI no mantiene una lista de scripts conocidos — cualquier script que exista en el `package.json` del directorio actual queda disponible automáticamente (`ac help` lista los del directorio actual).

Los scripts de un paquete con estructura de componente (`src/`+`demo/`) usan el prefijo `component:` — ver "Scripts de paquete (`component:*`)" en [`docs/CONVENTIONS.md`](../docs/CONVENTIONS.md) para el juego completo. Cuando `ac app:create` esté implementado, los proyectos de tipo **app** usarán el prefijo `app:` (`app:serve`, etc.) — son comandos separados a propósito, porque sirven cosas distintas (un componente aislado con su demo vs. una aplicación completa).

## Templates

`templates/component/` contiene los archivos reales del componente generado, con placeholders `__token__` (`__tag__`, `__class_name__`, `__file_base__`, `__styles_export__`, `__package_name__`) reemplazados por `src/scaffold/render-template.js` (reemplazo de texto simple, sin motor de templates).

> `templates/` está en `.prettierignore` del repo: un placeholder `__token__` suelto en prosa Markdown (fuera de backticks) es indistinguible de énfasis (`__bold__`) y Prettier lo reescribe a `**bold**`, corrompiéndolo. Dentro de code spans/fences no hay problema — ahí Prettier no reformatea.

## Desarrollo

```bash
pnpm --filter @ac-base/cli test
```

Tests con el test runner nativo de Node (`node --test`), sin dependencias de testing nuevas. `test/bin.test.js` invoca el binario real (`bin/ac.js`) como subproceso — no solo las funciones internas — para cubrir el parseo de comandos de Commander.
