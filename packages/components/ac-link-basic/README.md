# @ac-components/ac-link-basic

Segundo componente del catálogo `@ac-components/*`: un link (`<a>`) básico construido sobre `@ac-base/ac-component-mixin`, con semántica real de navegación (no un botón disfrazado).

## Instalación

```bash
pnpm add @ac-components/ac-link-basic
```

```js
import '@ac-components/ac-link-basic';
```

```html
<ac-link-basic ambient="primary" href="/docs">Ver documentación</ac-link-basic>
```

## Propiedades

| Propiedad  | Atributo   | Tipo    | Default     | Descripción                                                                                               |
| ---------- | ---------- | ------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| `text`     | `text`     | String  | `''`        | Si se define, se usa como **clave de traducción** (`this.t(text)`) en vez del `<slot>`.                   |
| `href`     | `href`     | String  | `''`        | URL destino. Se omite del `<a>` renderizado cuando `disabled` es `true`.                                  |
| `target`   | `target`   | String  | `'_self'`   | `_self` \| `_blank` \| `_parent` \| `_top`. Cualquier otro valor cae a `_self`.                           |
| `ambient`  | `ambient`  | String  | `'primary'` | `primary` \| `primary-alt` \| `secondary` \| `secondary-alt` (heredada de `@ac-base/ac-component-mixin`). |
| `disabled` | `disabled` | Boolean | `false`     | Quita `href`, pone `aria-disabled="true"` y `tabindex="-1"`, y bloquea el click.                          |

## Eventos

- **`ac-link-basic-click`** — `{ bubbles: true, composed: true, detail: true }`. No se dispara si `disabled` es `true` (y la navegación nativa también se previene).

## Seguridad: `target="_blank"`

Cuando `target="_blank"`, el componente agrega automáticamente `rel="noopener noreferrer"` para evitar que la página destino obtenga acceso a `window.opener` del origen que abrió el link (tabnabbing). No hace falta pasarlo a mano.

## Theming

Los colores se leen de custom properties (`--color-primary-500`, `--color-accent-500`, etc.) con fallback al valor por defecto de `@ac-base/ac-core`, elegidos para ser legibles directamente sobre el fondo de la página (a diferencia de `ac-button-basic`, este componente no tiene su propia caja/fondo). Para usar la paleta completa del ecosistema:

```js
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
```

## i18n

`locales.json` incluye la clave `link-basic-learn-more` (`es-PE`, `en-EN`, `pt-BR`). Pásala vía `text`:

```html
<ac-link-basic text="link-basic-learn-more" href="/docs"></ac-link-basic>
```

## Desarrollo

```bash
pnpm --filter @ac-components/ac-link-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-link-basic component:test
pnpm --filter @ac-components/ac-link-basic component:build
pnpm --filter @ac-components/ac-link-basic component:test:e2e        # funcional (WebdriverIO + Cucumber)
pnpm --filter @ac-components/ac-link-basic component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/link-basic.styles.js` se genera a partir de `src/link-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
