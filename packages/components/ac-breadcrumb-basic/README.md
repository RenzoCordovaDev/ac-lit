# @ac-components/ac-breadcrumb-basic

Ruta de navegación con enlaces nativos a los niveles anteriores y una indicación accesible de la página actual.

## Instalación

```bash
pnpm add @ac-components/ac-breadcrumb-basic
```

```js
import '@ac-components/ac-breadcrumb-basic';
```

```html
<ac-breadcrumb-basic
  items='[{"text":"Inicio","href":"/"},{"text":"Catálogo","href":"/catalogo"},{"text":"Audífonos"}]'
></ac-breadcrumb-basic>
```

## Propiedades

| Propiedad | Atributo  | Tipo                      | Default     | Descripción                                                                     |
| --------- | --------- | ------------------------- | ----------- | ------------------------------------------------------------------------------- |
| `items`   | `items`   | Array de objetos o String | `[]`        | Ruta ordenada de objetos `{ text, href? }`. Acepta JSON como cadena o atributo. |
| `ambient` | `ambient` | String                    | `'primary'` | `primary` (verde) \| `secondary` (ámbar). Heredada de `ComponentMixin`.         |

Cada ítem recibe un `text` de tipo String y un `href` opcional de tipo String. Los niveles anteriores con `href` son enlaces y se pueden activar con clic o Enter. Los niveles sin destino se muestran como texto. El último ítem siempre se muestra como texto con `aria-current="page"`, incluso si recibe un `href`. Una ruta vacía se omite del documento.

## Eventos

- **`ac-breadcrumb-basic-navigate`** se emite al activar un enlace con clic o Enter y conserva la navegación nativa. Burbujea y atraviesa los límites del Shadow DOM (`bubbles: true`, `composed: true`). Su `detail` es `{ index, item: { text, href } }`, con el índice basado en cero y los valores originales del ítem.

## Theming

La ruta usa los tokens de `@ac-base/ac-core` y toma el fondo de la página. Los colores de texto y foco se adaptan al tema claro cuando un ancestro tiene `data-theme="light"`.

```js
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

## i18n

`locales.json` incluye `breadcrumb-basic-navigation` para el nombre accesible de la ruta en `es-PE`, `en-EN` y `pt-BR`. El componente traduce el `text` de cada ítem con `this.t()` y muestra el valor literal cuando no encuentra una traducción.

```html
<ac-breadcrumb-basic
  items='[{"text":"breadcrumb-basic-home","href":"/"},{"text":"breadcrumb-basic-catalog","href":"/catalogo"},{"text":"breadcrumb-basic-headphones"}]'
></ac-breadcrumb-basic>
```

## Desarrollo

```bash
pnpm --filter @ac-components/ac-breadcrumb-basic component:lint
pnpm --filter @ac-components/ac-breadcrumb-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-breadcrumb-basic component:test
pnpm --filter @ac-components/ac-breadcrumb-basic component:build
pnpm --filter @ac-components/ac-breadcrumb-basic component:preview
pnpm --filter @ac-components/ac-breadcrumb-basic component:build:styles
pnpm --filter @ac-components/ac-breadcrumb-basic component:build:styles:watch
```

> `src/breadcrumb-basic.styles.js` se genera a partir de `src/breadcrumb-basic.styles.scss` antes de `component:serve`, `component:build` y `component:test`. Durante `component:serve`, el compilador vuelve a generar los estilos cada vez que se guarda el SCSS.
