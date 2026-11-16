# @ac-components/ac-icon-basic

Componente fundacional del lote de 5 componentes básicos nuevos: renderiza **un** ícono de un set propio y pequeño del catálogo, por nombre — sin slots, sin eventos. Lo consume `ac-icon-button-basic` como dependencia interna, así que su API pública (`name`/`size`/`a11y-label`) se mantiene estable.

## Instalación

```bash
pnpm add @ac-components/ac-icon-basic
```

```js
import '@ac-components/ac-icon-basic';
```

```html
<ac-icon-basic name="check"></ac-icon-basic>
```

## Propiedades

| Propiedad   | Atributo     | Tipo   | Default | Descripción                                                                                                                                                            |
| ----------- | ------------ | ------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`      | `name`       | String | `''`    | Nombre del ícono (ver whitelist abajo). Un `name` que no matchea ninguno cae a un fallback genérico (un círculo simple) — nunca rompe.                                 |
| `size`      | `size`       | String | `'md'`  | `sm` (16px) \| `md` (20px) \| `lg` (24px), con validación por whitelist y fallback a `'md'` si no matchea — mismo patrón que `ac-spinner-basic`.                       |
| `a11yLabel` | `a11y-label` | String | `''`    | Si se define (texto o clave de traducción, pasa por `this.t()`), el ícono deja de ser decorativo: `role="img"` + `aria-label`. Vacío (default) ⇒ `aria-hidden="true"`. |

Sin eventos. Sin `ambient` — el color del ícono es siempre `currentColor`, heredado del elemento padre (mismo criterio que los íconos inline de `ac-notification-basic`).

## Set de íconos

Whitelist fija de esta primera versión (`viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`):

`check`, `close`, `info`, `success`, `warning`, `danger`, `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `search`, `menu`, `arrow-left`, `arrow-right`.

> `info`/`success`/`warning`/`danger` son deliberadamente idénticos a los paths ya usados en `ICON_MAP` de `ac-notification-basic` — misma identidad visual, no una reinterpretación.

Un `name` fuera de esta lista (incluido `''`) renderiza el fallback: un círculo simple (`<circle cx="12" cy="12" r="9"/>`), nunca un ícono vacío o roto.

## i18n

No tiene ningún texto propio fijo — todo es visual, y `a11yLabel` es un valor que define el consumidor (texto literal o clave de traducción de su propia app). `locales.json` no declara ninguna clave propia.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-icon-basic component:lint
pnpm --filter @ac-components/ac-icon-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-icon-basic component:test
pnpm --filter @ac-components/ac-icon-basic component:build
pnpm --filter @ac-components/ac-icon-basic component:test:e2e        # funcional (WebdriverIO + Cucumber)
pnpm --filter @ac-components/ac-icon-basic component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/icon-basic.styles.js` se genera a partir de `src/icon-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
