# @ac-components/ac-rating-basic

Control de calificación por estrellas enteras con modo interactivo y de solo lectura.

## Instalación

```bash
pnpm add @ac-components/ac-rating-basic
```

```js
import '@ac-components/ac-rating-basic';
```

```html
<ac-rating-basic name="calificacion" value="3"></ac-rating-basic>
<ac-rating-basic readonly value="4"></ac-rating-basic>
```

## Propiedades

| Propiedad  | Atributo   | Tipo    | Default     | Descripción                                                                                               |
| ---------- | ---------- | ------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| `value`    | `value`    | Number  | `0`         | Calificación entera entre `0` y `max`. Se refleja en el atributo.                                         |
| `max`      | `max`      | Number  | `5`         | Cantidad de estrellas, como mínimo `1`. Se refleja en el atributo.                                        |
| `readonly` | `readonly` | Boolean | `false`     | Muestra el valor como una imagen accesible. Se refleja en el atributo.                                    |
| `name`     | `name`     | String  | `''`        | Identificador del campo para que lo use el consumidor.                                                    |
| `ambient`  | `ambient`  | String  | `'primary'` | Color de las estrellas llenas, `primary` (esmeralda) o `secondary` (ámbar). Heredado de `ComponentMixin`. |

La versión básica representa únicamente estrellas completas. Los valores decimales se truncan y `value` se ajusta al rango. Si el campo forma parte de un formulario HTML, incorpora su `value` en los datos del formulario desde el código consumidor.

En el modo interactivo, pasar el puntero por una estrella previsualiza ese valor hasta salir del control. El clic, `Espacio` o `Enter` confirman la estrella. Las flechas derecha y arriba suman uno y las flechas izquierda y abajo restan uno, respetando los límites. `Home` lleva a `0` y `End` a `max`. `Tab` entra por la estrella seleccionada o por la primera si el valor es `0`.

## Eventos

| Evento                   | Cuándo                                                      | `detail`            |
| ------------------------ | ----------------------------------------------------------- | ------------------- |
| `ac-rating-basic-change` | El usuario cambia la calificación con un clic o el teclado. | `{ value: number }` |

El evento burbujea y atraviesa los límites del Shadow DOM (`bubbles` y `composed`).

## Theming

El contorno de las estrellas vacías usa `--color-subtext`. Para las estrellas llenas y el anillo de foco, `primary` usa `--color-primary-500` en tema oscuro y `--color-primary-700` en tema claro. `secondary` usa `--color-accent-500` en tema oscuro y `--color-accent-700` (con respaldo `#b45309`) en tema claro.

```js
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

Activa el tema claro con `data-theme="light"` en `<html>`. Los CSS parts `root` y `star` permiten personalizar el contenedor y cada estrella.

## i18n

`locales.json` incluye los nombres accesibles del grupo (`rating-basic-group-label`), de cada estrella (`rating-basic-star-label` y `rating-basic-stars-label`) y el resumen de solo lectura (`rating-basic-readonly-label`) en `es-PE`, `en-EN` y `pt-BR`.

```html
<ac-rating-basic readonly value="4" locale="en-EN"></ac-rating-basic>
```

## Desarrollo

```bash
pnpm --filter @ac-components/ac-rating-basic component:lint
pnpm --filter @ac-components/ac-rating-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-rating-basic component:test
pnpm --filter @ac-components/ac-rating-basic component:build
pnpm --filter @ac-components/ac-rating-basic component:preview
pnpm --filter @ac-components/ac-rating-basic component:build:styles
pnpm --filter @ac-components/ac-rating-basic component:build:styles:watch
```

> `src/rating-basic.styles.js` se genera a partir de `src/rating-basic.styles.scss`. `component:serve`, `component:build` y `component:test` lo compilan automáticamente. Durante `component:serve`, cada guardado del SCSS recompila los estilos y Vite recarga el navegador.
