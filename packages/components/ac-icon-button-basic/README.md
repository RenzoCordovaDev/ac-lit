# `@ac-components/ac-icon-button-basic`

Botón solo-ícono, accesible, pensado para toolbars y acciones compactas (cerrar, buscar, abrir un menú, avanzar/retroceder) — a diferencia de `ac-button-basic`, nunca muestra texto visible, solo un ícono.

Envuelve internamente un `<ac-icon-basic>` real: **`@ac-components/ac-icon-basic` es una dependencia de runtime, no opcional** (`workspace:^` en `dependencies`, no en `devDependencies`) — este componente no reimplementa ningún SVG propio, delega todo el set de íconos y su whitelist/fallback a `ac-icon-basic`.

## Instalación

```bash
pnpm add @ac-components/ac-icon-button-basic
```

```js
import '@ac-components/ac-icon-button-basic';
```

```html
<ac-icon-button-basic name="close" a11y-label="Cerrar"></ac-icon-button-basic>
```

## Propiedades

| Propiedad   | Atributo     | Tipo    | Default     | Descripción                                                                                                                                                   |
| ----------- | ------------ | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`      | `name`       | String  | `''`        | Nombre del ícono — se pasa directo a `<ac-icon-basic>` interno. Mismo whitelist/fallback que ese componente (ver su README para la lista completa).           |
| `a11yLabel` | `a11y-label` | String  | `''`        | Etiqueta accesible del botón. Si no se define, el `aria-label` cae al propio `name` (ver "Accesibilidad" abajo) — pero **siempre debería pasarse explícito**. |
| `ambient`   | `ambient`    | String  | `'primary'` | `primary` \| `secondary` \| `danger`, con whitelist y fallback a `'primary'` si no matchea.                                                                   |
| `size`      | `size`       | String  | `'md'`      | `sm` \| `md` \| `lg`, con whitelist y fallback a `'md'`. Se propaga también al `<ac-icon-basic>` interno, para que el ícono escale junto con el botón.        |
| `disabled`  | `disabled`   | Boolean | `false`     | Deshabilita el `<button>` nativo interno.                                                                                                                     |

Sin `slot`, sin eventos custom: es un `<button type="button">` nativo — su `click` nativo ya burbujea (`composed: true` por defecto en los eventos nativos), igual criterio que `ac-button-basic` (que tampoco emite un evento propio).

## Accesibilidad

Un botón solo-ícono sin texto visible **no tiene ningún nombre accesible propio** salvo el que le dé `aria-label` — a diferencia de un botón con texto (`ac-button-basic`), acá no hay slot ni `text` de los que WCAG 4.1.2 pueda derivar un nombre. Por eso `a11y-label` es **casi obligatorio en la práctica**, aunque tenga un fallback: si no se define, el `aria-label` usa el propio `name` (ej. `"close"`), lo que evita que el botón quede completamente roto para un lector de pantalla, pero sigue siendo un nombre técnico en inglés, no una descripción de la acción para el usuario final (ej. `"Cerrar"` dice más que `"close"`). El README deja esto explícito porque el fallback existe **para que el componente nunca quede sin nombre accesible**, no como forma recomendada de usarlo.

## Theming

Colores por `ambient`: `primary` y `secondary` usan los mismos tokens que `ac-button-basic` (`--color-primary-700`/`--color-primary-50`, `--color-accent-500`/`--color-accent-900`); `danger` usa `--color-danger` con texto negro (mismo criterio ya validado en `ac-badge-basic`). El radio de borde escala junto con `size` (`--radius-sm` en `sm`, `--radius-md` en `md`, `--radius-lg` en `lg`) — nunca `--radius-full`, reservado en el catálogo para controles de estado binario/toggle (ver "Emerald Pro" en `docs/CONVENTIONS.md`).

```js
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
```

## i18n

El componente no tiene ningún texto propio fijo (ni siquiera en estado deshabilitado) — `locales.json` no declara ninguna clave.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-icon-button-basic component:lint
pnpm --filter @ac-components/ac-icon-button-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-icon-button-basic component:test
pnpm --filter @ac-components/ac-icon-button-basic component:build
pnpm --filter @ac-components/ac-icon-button-basic component:test:e2e        # funcional (WebdriverIO + Cucumber)
pnpm --filter @ac-components/ac-icon-button-basic component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/icon-button-basic.styles.js` se genera a partir de `src/icon-button-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
