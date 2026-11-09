# `@ac-components/ac-select-basic`

Lista desplegable accesible: un `<select>` nativo con sus opciones en un solo componente. Las opciones se pasan por la propiedad `options` o como hijos `<option>`. En Chromium la lista desplegable tiene estilo moderno (`appearance: base-select`); en el resto de navegadores queda el `<select>` nativo estilizado.

## Instalación

```bash
pnpm add @ac-components/ac-select-basic
```

```js
import '@ac-components/ac-select-basic';
```

```html
<!-- Por propiedad -->
<ac-select-basic
  label="Plan"
  placeholder="Elige un plan"
  options='[{"value":"monthly","label":"Mensual"},{"value":"annual","label":"Anual"}]'
></ac-select-basic>

<!-- Por slot -->
<ac-select-basic label="País">
  <option value="pe">Perú</option>
  <option value="co" selected>Colombia</option>
</ac-select-basic>
```

## Propiedades

| Propiedad     | Atributo      | Tipo    | Default     | Descripción                                                                                                                                |
| ------------- | ------------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`     | `options`     | Array   | `[]`        | Lista de `{ value, label, disabled? }` o de strings (el string es valor y texto). Como atributo, JSON. Gana sobre los `<option>` por slot. |
| `value`       | `value`       | String  | `''`        | Valor seleccionado.                                                                                                                        |
| `label`       | `label`       | String  | `''`        | Etiqueta visible (pasa por `this.t()`).                                                                                                    |
| `a11yLabel`   | `a11y-label`  | String  | `''`        | Nombre accesible cuando no hay etiqueta visible. Se ignora si hay `label`.                                                                 |
| `placeholder` | `placeholder` | String  | `''`        | Texto mostrado mientras no hay valor (opción deshabilitada y oculta de la lista).                                                          |
| `name`        | `name`        | String  | `''`        | Nombre del campo.                                                                                                                          |
| `hint`        | `hint`        | String  | `''`        | Texto de ayuda bajo el campo.                                                                                                              |
| `error`       | `error`       | String  | `''`        | Mensaje de error. Reemplaza a `hint`, marca el campo con `aria-invalid="true"` y se anuncia con `role="alert"`.                            |
| `disabled`    | `disabled`    | Boolean | `false`     | Deshabilita el select.                                                                                                                     |
| `required`    | `required`    | Boolean | `false`     | Obligatorio; muestra un asterisco decorativo junto a la etiqueta.                                                                          |
| `ambient`     | `ambient`     | String  | `'primary'` | Color del foco y de la opción seleccionada: `primary` o `secondary`. Heredado de `ComponentMixin`.                                         |

Las etiquetas de las opciones, `label`, `placeholder`, `hint` y `error` pasan por `this.t()`: una clave de `locales.json` se traduce, cualquier otro texto se muestra tal cual.

El método `focus()` lleva el foco al select interno.

## Eventos

| Evento                   | Cuándo                      | `detail`                           |
| ------------------------ | --------------------------- | ---------------------------------- |
| `ac-select-basic-change` | El usuario elige una opción | `{ value: string, label: string }` |

`bubbles` y `composed`.

## Parts y CSS

| Part     | Descripción                  |
| -------- | ---------------------------- |
| `root`   | Contenedor de todo el campo. |
| `label`  | La etiqueta.                 |
| `select` | El `<select>` nativo.        |
| `hint`   | El texto de ayuda.           |
| `error`  | El mensaje de error.         |

## Accesibilidad

- Select nativo: teclado, lectores de pantalla y selector móvil del sistema.
- La etiqueta está asociada (`for`/`id`); ayuda y error se enlazan con `aria-describedby`.
- El borde cumple 3:1 contra el fondo y el color de foco/error depende del tema (claro/oscuro).
- Un `<select>` dentro de un shadow root **no participa** de un `<form>` nativo: lee `value` del componente o escucha el evento.

## i18n

`locales.json` incluye claves de ejemplo (`select-basic-placeholder`, `select-basic-option-*`, `select-basic-required-error`) en `es-PE`, `en-EN` y `pt-BR`.

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-select-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/select-basic.styles.js` se genera a partir de `src/select-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
