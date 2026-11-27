# @ac-components/ac-container-basic

Superficie neutra de layout para agrupar contenido como secciones, formularios o resúmenes.

## Instalación

```bash
pnpm add @ac-components/ac-container-basic
```

```js
import '@ac-components/ac-container-basic';
```

```html
<ac-container-basic ambient="outlined" padding="lg">
  <h2>Datos de contacto</h2>
  <p>Consulta los datos asociados a tu cuenta.</p>
</ac-container-basic>
```

## Propiedades

| Propiedad | Atributo  | Tipo   | Default     | Descripción                                                                           |
| --------- | --------- | ------ | ----------- | ------------------------------------------------------------------------------------- |
| `ambient` | `ambient` | String | `'surface'` | `surface` (fondo sólido y elevación) u `outlined` (fondo transparente y borde).       |
| `padding` | `padding` | String | `'md'`      | Espaciado interno. `sm` usa `--space-3`, `md` usa `--space-4` y `lg` usa `--space-6`. |

`ambient` se hereda de `@ac-base/ac-component-mixin`, con el mismo vocabulario que `ac-card-basic`. Ambas propiedades se reflejan en sus atributos. Los valores fuera de la lista se renderizan con el estilo por defecto de cada propiedad.

## Slots

| Slot      | Descripción                               |
| --------- | ----------------------------------------- |
| (default) | Contenido arbitrario provisto por la app. |

## Theming

Ambos ambientes usan `--radius-lg` y el color de texto `--color-text` del tema activo. `surface` combina el fondo `--color-surface` con `--elev-1`. `outlined` conserva el fondo de la página y traza el borde con `--color-subtext`. La caja interna se expone como `::part(root)`.

```js
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

Activa la paleta clara con `data-theme="light"` en `<html>`.

## i18n

La aplicación proporciona y traduce el contenido del slot. `locales.json` incluye los textos de los ejemplos de la demo en `es-PE`, `en-EN` y `pt-BR`.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-container-basic component:lint
pnpm --filter @ac-components/ac-container-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-container-basic component:test
pnpm --filter @ac-components/ac-container-basic component:build
pnpm --filter @ac-components/ac-container-basic component:preview
```

> `src/container-basic.styles.js` se genera a partir de `src/container-basic.styles.scss` con `component:build:styles`. Los scripts `component:serve`, `component:build` y `component:test` recompilan los estilos al arrancar. Durante `component:serve`, `component:build:styles:watch` también los recompila cada vez que guardas el `.scss`.
