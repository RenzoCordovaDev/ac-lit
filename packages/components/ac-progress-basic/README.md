# `@ac-components/ac-progress-basic`

Barra de progreso determinada o indeterminada del catálogo `@ac-components/*`.

## Instalación

```bash
pnpm add @ac-components/ac-progress-basic
```

```js
import '@ac-components/ac-progress-basic';
```

```html
<ac-progress-basic value="50"></ac-progress-basic>
```

## Propiedades

| Propiedad       | Atributo        | Tipo                | Default     | Descripción                                                                                                                                             |
| --------------- | --------------- | ------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`         | `value`         | Number              | `0`         | 0 a 100. Si llega fuera de rango se clampea (`Math.min(100, Math.max(0, value))`) internamente, sin mutar la propiedad pública que pasó el consumidor.  |
| `indeterminate` | `indeterminate` | Boolean (reflejado) | `false`     | Si es `true`, ignora `value` visualmente y muestra una animación de franja deslizante en vez de un relleno fijo.                                        |
| `ambient`       | `ambient`       | String              | `'primary'` | `primary` \| `success` \| `warning` \| `danger` (heredada de `@ac-base/ac-component-mixin`). Whitelist con fallback a `primary` ante un valor inválido. |
| `label`         | `label`         | String              | `''`        | Texto opcional arriba de la barra. Pasa por `this.t()` — acepta tanto una clave de `locales.json` como un literal.                                      |
| `showValue`     | `show-value`    | Boolean             | `false`     | Si es `true` (y no está en `indeterminate`), muestra el porcentaje numérico junto al `label`.                                                           |

> A diferencia de `ac-button-basic`/`ac-link-basic` (`ambient` de marca `primary`/`secondary`) y de `ac-badge-basic`/`ac-notification-basic` (`ambient` puramente semántico de estado), `ac-progress-basic` combina ambos: `primary` sirve para un progreso neutral/de marca, y `success`/`warning`/`danger` para comunicar un estado del proceso en curso.

## Accesibilidad

El elemento con `role="progressbar"` expone siempre `aria-valuemin="0"` y `aria-valuemax="100"`. Cuando **no** está `indeterminate`, expone además `aria-valuenow` con el valor ya clampeado. Cuando **sí** está `indeterminate`, `aria-valuenow` se omite por completo (no se setea como string vacío) — es el comportamiento correcto de WAI-ARIA para progreso indeterminado. Si hay `label`, se usa como `aria-label` del elemento.

## Theming

El track usa `--color-muted` y `--radius-full`. El relleno usa los mismos tokens semánticos fijos que `ac-badge-basic` para `success`/`warning`/`danger` (`--color-success`/`--color-warning`/`--color-danger`, no cambian entre temas), y `--color-primary-700`/`--color-primary-500` para `primary` (mismo criterio de `ac-spinner-basic`/`ac-slider-basic`: redefinido bajo `:host-context([data-theme='light'])`, ya que `primary` no tiene un token fijo propio).

```js
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
```

El estado `indeterminate` anima una franja del 40% del ancho deslizándose de lado a lado; se silencia bajo `prefers-reduced-motion: reduce` (mostrando la franja estática en vez de ocultar la barra, mismo criterio que `ac-spinner-basic`).

## i18n

`label` lo define el consumidor y pasa por `this.t()` (acepta tanto una clave de `locales.json` como un literal). `locales.json` incluye una sola clave propia, `progress-basic-label` (`es-PE`/`en-EN`/`pt-BR`): se usa como **nombre accesible por defecto** (`aria-label`) del `role="progressbar"` cuando no se definió `label` — axe-core exige que todo `progressbar` tenga un nombre accesible (`aria-progressbar-name`), y sin esta clave el componente fallaba esa regla en los casos sin `label`.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-progress-basic component:lint
pnpm --filter @ac-components/ac-progress-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-progress-basic component:test
pnpm --filter @ac-components/ac-progress-basic component:build
pnpm --filter @ac-components/ac-progress-basic component:test:e2e        # funcional (WebdriverIO + Cucumber)
pnpm --filter @ac-components/ac-progress-basic component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/progress-basic.styles.js` se genera a partir de `src/progress-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
