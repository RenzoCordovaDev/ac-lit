# @ac-components/ac-search-input-basic

Campo de búsqueda nativo con lupa, botón para limpiar y búsqueda tras una pausa al escribir o al pulsar Enter.

## Instalación

```bash
pnpm add @ac-components/ac-search-input-basic
```

```js
import '@ac-components/ac-search-input-basic';
```

```html
<ac-search-input-basic
  label="Buscar productos"
  name="q"
  placeholder="Ej. zapatillas"
></ac-search-input-basic>
```

## Propiedades

| Propiedad     | Atributo      | Tipo    | Default     | Descripción                                                                                       |
| ------------- | ------------- | ------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `value`       | `value`       | String  | `''`        | Texto actual del campo de búsqueda.                                                               |
| `placeholder` | `placeholder` | String  | `''`        | Texto de ejemplo, traducible mediante `this.t()` si se usa una clave.                             |
| `disabled`    | `disabled`    | Boolean | `false`     | Deshabilita el campo y el botón de limpiar.                                                       |
| `name`        | `name`        | String  | `''`        | Nombre del `<input>` interno.                                                                     |
| `debounce`    | `debounce`    | Number  | `300`       | Tiempo de espera en milisegundos desde el último cambio del usuario.                              |
| `label`       | `label`       | String  | `''`        | Etiqueta visible y traducible, asociada al campo.                                                 |
| `a11yLabel`   | `a11y-label`  | String  | `''`        | Nombre accesible traducible cuando se omite `label`. Por defecto usa la traducción de «Buscar».   |
| `ambient`     | `ambient`     | String  | `'primary'` | Color del foco (`primary` o `secondary`). Heredada de `ComponentMixin` y reflejada como atributo. |

El método `focus(options)` lleva el foco al campo interno. Para integrar el buscador en un formulario externo, lee `value` o escucha sus eventos.

## Eventos

| Evento                         | Cuándo                                             | `detail`            |
| ------------------------------ | -------------------------------------------------- | ------------------- |
| `ac-search-input-basic-input`  | Con cada cambio del usuario o al limpiar.          | `{ value: string }` |
| `ac-search-input-basic-search` | Al transcurrir `debounce`, pulsar Enter o limpiar. | `{ value: string }` |
| `ac-search-input-basic-clear`  | Al activar el botón de limpiar.                    | `{}`                |

Los tres eventos tienen `bubbles: true` y `composed: true`. Enter cancela la búsqueda pendiente y ejecuta la búsqueda de inmediato. El botón de limpiar vacía el campo, le devuelve el foco y emite `-input` y `-search` con `{ value: '' }`, seguidos de `-clear`. La carga inicial y las asignaciones a `value` desde código solo actualizan el campo.

## Theming

El campo usa los tokens de superficie y texto de la paleta activa. El color del foco se adapta a `ambient` y a `data-theme`. Los CSS parts `root`, `label`, `input` y `clear-button` permiten personalizar el contenedor, la etiqueta, el campo y el botón.

```js
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

## i18n

`locales.json` incluye `search-input-basic-label`, `search-input-basic-placeholder` y `search-input-basic-clear-label` en `es-PE`, `en-EN` y `pt-BR`. Puedes pasar claves o texto literal en `label`, `a11y-label` y `placeholder`. El botón usa automáticamente su nombre accesible traducido.

```html
<ac-search-input-basic
  label="search-input-basic-label"
  placeholder="search-input-basic-placeholder"
></ac-search-input-basic>
```

## Desarrollo

```bash
pnpm --filter @ac-components/ac-search-input-basic component:lint
pnpm --filter @ac-components/ac-search-input-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-search-input-basic component:test
pnpm --filter @ac-components/ac-search-input-basic component:build
pnpm --filter @ac-components/ac-search-input-basic component:preview
pnpm --filter @ac-components/ac-search-input-basic component:build:styles
pnpm --filter @ac-components/ac-search-input-basic component:build:styles:watch
```

> `src/search-input-basic.styles.js` se genera a partir de `src/search-input-basic.styles.scss` al ejecutar `component:serve`, `component:build` o `component:test`. Durante `component:serve`, el compilador vigila los cambios en el SCSS y Vite recarga la demo al guardar.
