# @ac-components/ac-pagination-basic

Paginación numérica para listas y tablas, con botones de página anterior y siguiente y elipsis para intervalos de páginas.

## Instalación

```bash
pnpm add @ac-components/ac-pagination-basic
```

```js
import '@ac-components/ac-pagination-basic';
```

```html
<ac-pagination-basic page="3" total-pages="12"></ac-pagination-basic>
```

## Propiedades

| Propiedad      | Atributo        | Tipo    | Default     | Descripción                                                                                              |
| -------------- | --------------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| `page`         | `page`          | Number  | `1`         | Página activa, desde `1` hasta `totalPages`. Reflejada.                                                  |
| `totalPages`   | `total-pages`   | Number  | `1`         | Cantidad total de páginas, con un mínimo de `1`. Reflejada.                                              |
| `siblingCount` | `sibling-count` | Number  | `1`         | Cantidad de páginas vecinas visibles a cada lado de la página activa, con un mínimo de `0`.              |
| `disabled`     | `disabled`      | Boolean | `false`     | Deshabilita todos los botones. Reflejada.                                                                |
| `ambient`      | `ambient`       | String  | `'primary'` | `primary` o `secondary`. Define el color de la página activa. Heredada de `@ac-base/ac-component-mixin`. |

Las propiedades numéricas se truncan a enteros y toman su valor por defecto si el valor asignado es inválido o no es finito.

Si el total cabe en `2 × siblingCount + 5` posiciones, se muestran todas las páginas. Para totales mayores se muestran la primera, la última, la activa y sus vecinas. Si el intervalo entre dos números contiene una sola página, se muestra su número. Cada intervalo de dos o más páginas se reemplaza por una elipsis.

La página activa lleva `aria-current="page"`. Las flechas se deshabilitan en el extremo correspondiente. Usa `Tab` para recorrer los botones habilitados y `Enter` o `Espacio` para activarlos.

## Eventos

| Evento                            | Cuándo                                                         | `detail`           |
| --------------------------------- | -------------------------------------------------------------- | ------------------ |
| `ac-pagination-basic-page-change` | El usuario cambia de página al activar una flecha o un número. | `{ page: number }` |

El evento burbujea y atraviesa el Shadow DOM (`bubbles` y `composed`). Se emite solo cuando la interacción cambia `page`. Al cargar el componente o asignar `page` desde código, se actualiza la vista sin emitir el evento.

## Theming

La página activa usa los tokens fijos `--color-primary-700` y `--color-primary-50` en `primary`, y `--color-accent-100` y `--color-neutral` en `secondary`, para el fondo y el texto respectivamente. Los botones sin seleccionar y el indicador de foco se adaptan a los temas claro y oscuro.

```js
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

## i18n

`locales.json` incluye los nombres accesibles de la navegación, las flechas y los números de página en `es-PE`, `en-EN` y `pt-BR`.

```html
<ac-pagination-basic locale="en-EN" total-pages="12"></ac-pagination-basic>
```

## Desarrollo

```bash
pnpm --filter @ac-components/ac-pagination-basic component:lint
pnpm --filter @ac-components/ac-pagination-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-pagination-basic component:test
pnpm --filter @ac-components/ac-pagination-basic component:build
pnpm --filter @ac-components/ac-pagination-basic component:preview
pnpm --filter @ac-components/ac-pagination-basic component:build:styles
pnpm --filter @ac-components/ac-pagination-basic component:build:styles:watch
```

> `component:build:styles` genera `src/pagination-basic.styles.js` a partir de `src/pagination-basic.styles.scss`. Los scripts `component:serve`, `component:build` y `component:test` compilan los estilos automáticamente. Durante `component:serve`, cada guardado del `.scss` recompila el archivo y Vite recarga el navegador.
