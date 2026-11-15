# `@ac-components/ac-spinner-basic`

Indicador de carga indeterminado. Puramente visual/de estado — sin eventos, sin slots.

## Instalación

```bash
pnpm add @ac-components/ac-spinner-basic
```

```js
import '@ac-components/ac-spinner-basic';
```

```html
<ac-spinner-basic size="md" ambient="primary"></ac-spinner-basic>
```

## Propiedades

| Propiedad   | Atributo     | Tipo   | Default                   | Descripción                                                                                                                                        |
| ----------- | ------------ | ------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`      | `size`       | String | `'md'`                    | **Lista blanca**: `'sm'`, `'md'` o `'lg'`. Cualquier otro valor cae a `'md'`.                                                                      |
| `a11yLabel` | `a11y-label` | String | `'spinner-basic-loading'` | Texto anunciado a lectores de pantalla (oculto visualmente). Pasa por `this.t()` — acepta una clave de `locales.json` o un literal.                |
| `ambient`   | `ambient`    | String | `'primary'`               | Heredado de `ComponentMixin`: `'primary'` o `'secondary'` — color del arco activo. Mismo criterio de color que `ac-input-basic`/`ac-select-basic`. |

Sin eventos, sin slots — el `role="status"` del elemento raíz y el texto de `a11yLabel` (visualmente oculto) son lo único que comunica el componente a lectores de pantalla.

> Respeta `prefers-reduced-motion`: con esa preferencia activa, el spinner deja de girar (sigue comunicando "cargando" por `role="status"` + el texto oculto).

## Desarrollo

```bash
aclit component:lint
aclit component:serve           # o: pnpm --filter @ac-components/ac-spinner-basic component:serve    — demo en http://localhost:5173
aclit component:test
aclit component:build
aclit component:test:e2e        # funcional (WebdriverIO + Cucumber)
aclit component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/spinner-basic.styles.js` se genera a partir de `src/spinner-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
