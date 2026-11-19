# @ac-base/cli

CLI de `ac-lit` — comando `aclit`. Implementado con [Commander.js](https://github.com/tj/commander.js), sin wizard interactivo ni resolución de rutas/config: siempre opera sobre el directorio desde el que lo ejecutas.

## Uso

Dentro de este monorepo (sin instalar nada):

```bash
node cli/bin/aclit.js component:create ac-mi-componente
```

Una vez publicado, como dependencia o global:

```bash
pnpm add -D @ac-base/cli   # o: npm i -g @ac-base/cli
aclit component:create ac-mi-componente
```

Todos los comandos usan la forma `<tipo>:<accion>` (no subcomandos con espacio). `aclit help` (o `aclit -h`, `aclit --help`, `aclit` a secas) lista todos los comandos propios, las tareas habituales y los scripts del `package.json` del directorio actual.

### Scaffolding

- **`aclit component:create <nombre> [--no-e2e]`** — genera un componente completo (`src/`, `test/`, `test_e2e/`, `demo/`, `locales.json`, `index.js`, `package.json`, `README.md`) en el directorio actual. `<nombre>` debe tener el prefijo `ac-` y ser kebab-case (ej. `ac-mi-componente`); de ahí se derivan la clase (`MiComponente`), el archivo (`mi-componente.js`), el paquete npm (`@ac-components/ac-mi-componente`), etc.
  - Para agregar un componente al catálogo de `ac-lit`: `cd packages/components && aclit component:create ac-mi-componente`.
- **`aclit app:create <nombre>`** — genera un proyecto de app nuevo (`index.html`, `src/app.js`, `src/pages/`, `package.json`, `README.md`) en el directorio actual. A diferencia de `component:create`, `<nombre>` no exige prefijo `ac-` ni scope de npm (ej. `mi-app`) — es el proyecto propio de quien lo genera, nunca un paquete publicable (`package.json` sale con `"private": true`). El template trae 3 páginas navegadas por hash con `@ac-base/ac-ccp` ya integrado entre ellas.

### Ayuda

- **`aclit help`** — lista todos los comandos disponibles.

Los comandos propios (`component:create`, `app:create`) se declaran en `src/commands/registry.js`; Commander y `aclit help` leen de ese único registro. Tienen prioridad sobre un script de `package.json` con el mismo nombre. La sintaxis anterior (`aclit component create`) ya no existe y sugiere la forma nueva.

### Tareas (passthrough genérico)

Cualquier otro comando es un passthrough directo a `pnpm run <nombre>` en el directorio actual:

```bash
aclit component:serve           # = pnpm run component:serve — levanta el demo con Vite en http://localhost:5173
aclit component:build           # = pnpm run component:build
aclit component:lint            # = pnpm run component:lint — corre ESLint sobre el paquete actual
aclit component:preview         # = pnpm run component:preview
aclit component:test            # = pnpm run component:test
aclit component:test:e2e        # = pnpm run component:test:e2e
aclit component:test:e2e:a11y   # = pnpm run component:test:e2e:a11y
aclit build                     # = pnpm run build (donde exista ese script)
```

El CLI no mantiene una lista de scripts conocidos — cualquier script que exista en el `package.json` del directorio actual queda disponible automáticamente (`aclit help` lista los del directorio actual).

Los scripts de un paquete con estructura de componente (`src/`+`demo/`) usan el prefijo `component:` — ver "Scripts de paquete (`component:*`)" en [`docs/CONVENTIONS.md`](../docs/CONVENTIONS.md) para el juego completo. Un proyecto generado con `app:create` usa en cambio el prefijo `app:` (`app:lint`/`app:serve`/`app:build`/`app:preview`) — son comandos separados a propósito, porque sirven cosas distintas (un componente aislado con su demo vs. una aplicación completa): un juego más chico, sin build de estilos ni suite e2e de fábrica.

## Templates

`templates/component/` contiene los archivos reales del componente generado, con placeholders `__token__` (`__tag__`, `__class_name__`, `__file_base__`, `__styles_export__`, `__package_name__`) reemplazados por `src/scaffold/render-template.js` (reemplazo de texto simple, sin motor de templates). `templates/app/` usa el mismo mecanismo con solo 2 tokens (`__package_name__`, `__title__`), más chico porque no hay ninguna clase de Custom Element "principal" que publicar.

> `templates/` está en `.prettierignore` del repo: un placeholder `__token__` suelto en prosa Markdown (fuera de backticks) es indistinguible de énfasis (`__bold__`) y Prettier lo reescribe a `**bold**`, corrompiéndolo. Dentro de code spans/fences no hay problema — ahí Prettier no reformatea.

## Desarrollo

```bash
pnpm --filter @ac-base/cli test
```

Tests con el test runner nativo de Node (`node --test`), sin dependencias de testing nuevas. `test/bin.test.js` invoca el binario real (`bin/aclit.js`) como subproceso — no solo las funciones internas — para cubrir el parseo de comandos de Commander.
