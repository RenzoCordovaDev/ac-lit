# `@ac-components/ac-input-basic`

Campo de texto accesible con etiqueta, texto de ayuda y mensaje de error. Usa un `<input>` nativo dentro del shadow root.

## Instalación

```bash
pnpm add @ac-components/ac-input-basic
```

```js
import '@ac-components/ac-input-basic';
```

```html
<ac-input-basic label="Nombre" name="name" hint="Como aparece en tu documento."></ac-input-basic>
<ac-input-basic label="Correo" type="email" error="Ingresa un correo válido."></ac-input-basic>
<ac-input-basic a11y-label="Buscar" type="search" placeholder="Buscar..."></ac-input-basic>
```

## Propiedades

| Propiedad     | Atributo      | Tipo    | Default     | Descripción                                                                                                        |
| ------------- | ------------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `label`       | `label`       | String  | `''`        | Etiqueta visible. Se pasa por `this.t()`: si es una clave de `locales.json` se traduce, si no se muestra tal cual. |
| `a11yLabel`   | `a11y-label`  | String  | `''`        | Nombre accesible cuando **no** hay etiqueta visible (ej. un buscador). Se ignora si hay `label`.                   |
| `value`       | `value`       | String  | `''`        | Valor del campo.                                                                                                   |
| `type`        | `type`        | String  | `'text'`    | `text`, `email`, `password`, `search`, `tel`, `url` o `number`. Cualquier otro valor cae a `text` (lista blanca).  |
| `name`        | `name`        | String  | `''`        | Nombre del campo.                                                                                                  |
| `placeholder` | `placeholder` | String  | `''`        | Texto de ejemplo (también pasa por `this.t()`).                                                                    |
| `hint`        | `hint`        | String  | `''`        | Texto de ayuda bajo el campo (también pasa por `this.t()`).                                                        |
| `error`       | `error`       | String  | `''`        | Mensaje de error. Reemplaza a `hint`, marca el campo con `aria-invalid="true"` y se anuncia con `role="alert"`.    |
| `disabled`    | `disabled`    | Boolean | `false`     | Deshabilita el campo.                                                                                              |
| `readonly`    | `readonly`    | Boolean | `false`     | Campo de solo lectura (borde punteado).                                                                            |
| `required`    | `required`    | Boolean | `false`     | Campo obligatorio; muestra un asterisco decorativo junto a la etiqueta.                                            |
| `ambient`     | `ambient`     | String  | `'primary'` | Color del foco: `primary` o `secondary`. Heredado de `ComponentMixin`.                                             |

El método `focus()` lleva el foco al campo interno.

## Eventos

| Evento                  | Cuándo                                             | `detail`            |
| ----------------------- | -------------------------------------------------- | ------------------- |
| `ac-input-basic-input`  | En cada cambio mientras el usuario escribe         | `{ value: string }` |
| `ac-input-basic-change` | Al confirmar el cambio (al perder el foco / Enter) | `{ value: string }` |

`bubbles` y `composed`.

## Parts y CSS

| Part    | Descripción                  |
| ------- | ---------------------------- |
| `root`  | Contenedor de todo el campo. |
| `label` | La etiqueta.                 |
| `input` | El `<input>` nativo.         |
| `hint`  | El texto de ayuda.           |
| `error` | El mensaje de error.         |

## Accesibilidad

- La etiqueta está asociada al campo (`for`/`id`); la ayuda y el error se enlazan con `aria-describedby`.
- El color del foco y del mensaje de error depende del tema (claro/oscuro) para cumplir contraste WCAG AA en ambos; el borde del campo cumple 3:1.
- Un `<input>` dentro de un shadow root **no participa** de un `<form>` nativo: lee `value` del componente o escucha los eventos.

## i18n

`locales.json` incluye claves de ejemplo (`input-basic-email-label`, `-placeholder`, `-hint`, `-error`) en `es-PE`, `en-EN` y `pt-BR`.

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-input-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/input-basic.styles.js` se genera a partir de `src/input-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
