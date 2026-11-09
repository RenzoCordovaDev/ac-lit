# `@ac-components/ac-slider-basic`

Control deslizante moderno: un `<input type="range">` nativo (teclado, foco y lectores de pantalla) con pista rellena y pulgar propios.

## Instalación

```bash
pnpm add @ac-components/ac-slider-basic
```

```js
import '@ac-components/ac-slider-basic';
```

```html
<ac-slider-basic label="Volumen" value="40" show-value suffix="%"></ac-slider-basic>
<ac-slider-basic
  label="Temperatura"
  min="16"
  max="30"
  step="2"
  value="22"
  show-value
  suffix="°C"
></ac-slider-basic>
<ac-slider-basic a11y-label="Zoom" value="25"></ac-slider-basic>
```

## Propiedades

| Propiedad   | Atributo     | Tipo    | Default     | Descripción                                                                          |
| ----------- | ------------ | ------- | ----------- | ------------------------------------------------------------------------------------ |
| `value`     | `value`      | Number  | `0`         | Valor actual. Se ajusta al rango `[min, max]`; un valor no numérico cae a `min`.     |
| `min`       | `min`        | Number  | `0`         | Valor mínimo.                                                                        |
| `max`       | `max`        | Number  | `100`       | Valor máximo (si no es mayor que `min`, se usa `min + 1`).                           |
| `step`      | `step`       | Number  | `1`         | Incremento.                                                                          |
| `label`     | `label`      | String  | `''`        | Etiqueta visible (pasa por `this.t()`).                                              |
| `a11yLabel` | `a11y-label` | String  | `''`        | Nombre accesible cuando no hay etiqueta visible. Se ignora si hay `label`.           |
| `showValue` | `show-value` | Boolean | `false`     | Muestra el valor actual junto a la etiqueta.                                         |
| `suffix`    | `suffix`     | String  | `''`        | Texto tras el valor (`%`, `°C`…); también se expone en `aria-valuetext`.             |
| `hint`      | `hint`       | String  | `''`        | Texto de ayuda bajo el control.                                                      |
| `name`      | `name`       | String  | `''`        | Nombre del campo.                                                                    |
| `disabled`  | `disabled`   | Boolean | `false`     | Deshabilita el control.                                                              |
| `ambient`   | `ambient`    | String  | `'primary'` | Color del relleno y del foco: `primary` o `secondary`. Heredado de `ComponentMixin`. |

El método `focus()` lleva el foco al control interno.

## Eventos

| Evento                   | Cuándo                                        | `detail`            |
| ------------------------ | --------------------------------------------- | ------------------- |
| `ac-slider-basic-input`  | Mientras el usuario arrastra o usa el teclado | `{ value: number }` |
| `ac-slider-basic-change` | Al soltar o confirmar el nuevo valor          | `{ value: number }` |

`bubbles` y `composed`. El valor es siempre numérico.

## Parts y CSS

| Part    | Descripción                       |
| ------- | --------------------------------- |
| `root`  | Contenedor de todo el control.    |
| `label` | La etiqueta.                      |
| `value` | El valor mostrado (`show-value`). |
| `input` | El `<input type="range">` nativo. |
| `hint`  | El texto de ayuda.                |

## Accesibilidad

- Control nativo: flechas, `Home`/`End`, `PageUp`/`PageDown` y rol `slider` con `aria-valuenow/min/max` sin trabajo extra.
- El valor mostrado es decorativo (`aria-hidden`); lo que se anuncia es el del control (con `aria-valuetext` si hay `suffix`).
- La pista vacía cumple 3:1 contra el fondo, el pulgar tiene borde sólido y el foco depende del tema (claro/oscuro).
- Un `<input>` dentro de un shadow root **no participa** de un `<form>` nativo: lee `value` del componente o escucha los eventos.

## i18n

`locales.json` incluye `slider-basic-volume` y `slider-basic-brightness` (`es-PE`, `en-EN`, `pt-BR`) como ejemplo para `label`.

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-slider-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/slider-basic.styles.js` se genera a partir de `src/slider-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
