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
│   │   └── ac-intl-mixin/
│   └── components/               # catálogo de componentes publicables
│       ├── ac-button-basic/      # @ac-components/ac-button-basic
│       ├── ac-link-basic/
│       └── ac-helper-demo/       # contenedor de demos (dev-only)
├── docs/
├── pnpm-workspace.yaml
└── package.json
```

Cada componente vive en su propio paquete dentro de `packages/components/` y contiene `src/`, `demo/`, `test/`, `locales.json`, `index.js`, `package.json` y `README.md`.

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

## Paquetes base

- **`@ac-base/ac-core`** — design tokens, utilidades DOM, helpers. Exports: `./tokens`, `./utils`.
- **`@ac-base/ac-component-mixin`** — mixin base: propiedades comunes (`ambient`, `mode`, `loading`), sanitización HTML (DOMPurify), skeleton de carga, `scopedElementsFromClasses()`. Integra los dos mixins siguientes.
- **`@ac-base/ac-scoped-elements-mixin`** — aislamiento de custom elements para evitar colisiones de tag names.
- **`@ac-base/ac-intl-mixin`** — API `t(key, params)`, `setLocale(locale)`, `loadTranslations(data)` sobre `locales.json`.

## CLI (`ac`)

Comandos previstos (ver [`docs/CLI.md`](./CLI.md) cuando se implemente):

- `ac init <nombre-proyecto>` — scaffolding de un proyecto nuevo.
- `ac generate component <nombre>` (alias `ac g c`) — genera un componente completo (`src/`, `demo/`, `test/`, `locales.json`, `index.js`, `package.json`).
- `ac add <componentes...>` — instala componentes del catálogo vía npm.
- `ac list` — lista el catálogo de componentes disponible.
- `ac serve` / `ac dev` — levanta el servidor de desarrollo local (Vite) para el componente/proyecto actual.

## Testing

- `@open-wc/testing` + `@web/test-runner`, un archivo `*.test.js` por componente en `test/`.
- Los tests corren en navegador real (no jsdom), acorde a que se testean Custom Elements/Shadow DOM.

## Lint y formato

- ESLint (flat config, `eslint.config.js`) + Prettier, mismas reglas en todo el monorepo.
- `pre-commit` corre `lint-staged` solo sobre archivos en stage.
