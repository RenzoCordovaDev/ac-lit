# @ac-components/ac-badge-basic

Tercer componente del catálogo `@ac-components/*`: una etiqueta/indicador pequeño (estado, contador, categoría), **sin interacción** — a diferencia de `ac-button-basic`/`ac-link-basic`, no dispara eventos ni es enfocable.

## Instalación

```bash
pnpm add @ac-components/ac-badge-basic
```

```js
import '@ac-components/ac-badge-basic';
```

```html
<ac-badge-basic ambient="success">Activo</ac-badge-basic>
```

## Propiedades

| Propiedad | Atributo  | Tipo   | Default     | Descripción                                                                                  |
| --------- | --------- | ------ | ----------- | -------------------------------------------------------------------------------------------- |
| `text`    | `text`    | String | `''`        | Si se define, se usa como **clave de traducción** (`this.t(text)`) en vez del `<slot>`.      |
| `ambient` | `ambient` | String | `'neutral'` | `neutral` \| `success` \| `warning` \| `danger` (heredada de `@ac-base/ac-component-mixin`). |

> A diferencia de `ac-button-basic`/`ac-link-basic` (`ambient` de marca `primary`/`secondary`), aquí los valores de `ambient` son **semánticos de estado** — tiene más sentido para una etiqueta que comunica un estado que para una acción. Mismo nombre de propiedad, distinto vocabulario de valores.

## Theming

Los colores de cada variant son sólidos (fondo + texto), calculados para cumplir contraste WCAG AA (4.5:1) **contra su propio fondo** (no contra la página, a diferencia de `ac-link-basic`): fondos de `--color-success`/`--color-warning`/`--color-danger`/`--color-muted` con fallback al valor por defecto de `@ac-base/ac-core`.

```js
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
```

## i18n

`locales.json` incluye la clave `badge-basic-new` (`es-PE`, `en-EN`, `pt-BR`). Pásala vía `text`:

```html
<ac-badge-basic text="badge-basic-new"></ac-badge-basic>
```

## Desarrollo

```bash
pnpm --filter @ac-components/ac-badge-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-badge-basic test
pnpm --filter @ac-components/ac-badge-basic build
pnpm --filter @ac-components/ac-badge-basic test:e2e        # funcional (WebdriverIO + Cucumber)
pnpm --filter @ac-components/ac-badge-basic test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/badge-basic.styles.js` se genera a partir de `src/badge-basic.styles.scss` (`build:styles`, corre automáticamente antes de `component:serve`/`build`/`test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
