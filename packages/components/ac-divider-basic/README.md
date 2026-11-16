# @ac-components/ac-divider-basic

Línea separadora de contenido, horizontal o vertical, con texto centrado opcional (ej. "o", "Sección 2") — como `ac-badge-basic`, **sin interacción**: no dispara eventos ni es enfocable.

## Instalación

```bash
pnpm add @ac-components/ac-divider-basic
```

```js
import '@ac-components/ac-divider-basic';
```

```html
<ac-divider-basic></ac-divider-basic>
<ac-divider-basic>o</ac-divider-basic>
<ac-divider-basic orientation="vertical"></ac-divider-basic>
```

## Propiedades

| Propiedad     | Atributo      | Tipo   | Default        | Descripción                                                                                                                                                          |
| ------------- | ------------- | ------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation` | `orientation` | String | `'horizontal'` | `'horizontal'` \| `'vertical'`. Un valor que no matchea cae al default (`'horizontal'`), mismo patrón de whitelist por `Set` que `ac-spinner-basic`/`ac-card-basic`. |

Slot por defecto: contenido de texto opcional, centrado sobre la línea. Solo tiene efecto visual en `orientation="horizontal"` — en `vertical` el contenido del slot se ignora en el CSS (no se prohíbe en JS, pero no se muestra ningún label roto).

## Comportamiento

- **Sin contenido en el slot**: una sola línea continua que ocupa todo el ancho (`horizontal`) o alto (`vertical`) del host.
- **Con contenido en el slot** (solo `horizontal`): dos segmentos de línea flanqueando el texto centrado. La detección usa `slotchange` + `assignedNodes({ flatten: true })` (no `assignedElements`, porque el contenido suele ser un nodo de texto plano, no un elemento) guardada en una propiedad interna no reactiva (`_hasLabel`, mismo patrón que `_hasFooter` de `ac-card-basic`) que dispara `requestUpdate()`.
- **Accesibilidad**: el elemento raíz lleva `role="separator"` y `aria-orientation="${orientation}"`.
- **Sin eventos**: no dispara ningún `ac-divider-basic-*`.

## Theming

```js
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
```

- Línea: `background: var(--color-muted, #313335)`, 1px de grosor.
- Label: `font-size: var(--font-size-sm, 0.85rem)`, con `padding: 0 var(--space-3, 0.75rem)`. El color **no** usa `--color-subtext` directo — ese token, usado así (texto suelto sin caja propia), cumple en tema claro pero falla WCAG AA (color-contrast, ~3.9:1) en tema oscuro (confirmado con axe en el E2E de accesibilidad; ver "Dark-mode y colores de fondo sólido" en `docs/CONVENTIONS.md`). En su lugar usa una custom property propia, `--ac-divider-basic-label` (`#9496a0` por defecto, redefinida a `var(--color-subtext, #5f5e58)` bajo `:host-context([data-theme='light'])`), mismo patrón que `--ac-radio-active` de `ac-radio-basic`.

### Limitación conocida: `orientation="vertical"` necesita un alto

En vertical, el host pasa a `display: inline-flex; align-self: stretch` para heredar el alto de un contenedor flex en fila (ver el caso "Vertical" del demo: dos bloques de texto a los costados dentro de un `div` con `display: flex`). Si se usa **fuera** de un contenedor flex, o dentro de uno sin alto resuelto (ningún hermano con alto propio), el divisor vertical puede no mostrarse porque su alto efectivo es `0` — en ese caso, fija un alto explícito en el host o en su contenedor.

## i18n

El componente no tiene texto propio fijo — el label lo define el consumidor vía slot. `locales.json` queda con la estructura base vacía (`es-PE`/`en-EN`/`pt-BR`), sin claves propias.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-divider-basic component:lint
pnpm --filter @ac-components/ac-divider-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-divider-basic component:test
pnpm --filter @ac-components/ac-divider-basic component:build
pnpm --filter @ac-components/ac-divider-basic component:test:e2e        # funcional (WebdriverIO + Cucumber)
pnpm --filter @ac-components/ac-divider-basic component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/divider-basic.styles.js` se genera a partir de `src/divider-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
