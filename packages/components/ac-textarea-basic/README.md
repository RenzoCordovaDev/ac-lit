# `@ac-components/ac-textarea-basic`

Campo de texto multilínea con etiqueta, ayuda/error y soporte i18n — mismo patrón que `ac-input-basic`, para texto largo (comentarios, descripciones).

## Instalación

```bash
pnpm add @ac-components/ac-textarea-basic
```

```js
import '@ac-components/ac-textarea-basic';
```

```html
<ac-textarea-basic
  label="Comentario"
  name="comment"
  placeholder="Contanos qué pasó"
  hint="Máximo 500 caracteres."
  rows="6"
></ac-textarea-basic>
```

## Propiedades

| Propiedad     | Atributo      | Tipo    | Default     | Descripción                                                                                                                      |
| ------------- | ------------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `label`       | `label`       | String  | `''`        | Etiqueta visible. Pasa por `this.t()`, así que acepta tanto una clave de `locales.json` como un literal.                         |
| `a11yLabel`   | `a11y-label`  | String  | `''`        | `aria-label` para cuando no hay `label` visible. Se ignora si `label` está presente.                                             |
| `value`       | `value`       | String  | `''`        | Valor del campo.                                                                                                                 |
| `name`        | `name`        | String  | `''`        | Atributo `name` del `<textarea>` interno.                                                                                        |
| `placeholder` | `placeholder` | String  | `''`        | Texto de ayuda dentro del campo vacío. Pasa por `this.t()`.                                                                      |
| `hint`        | `hint`        | String  | `''`        | Mensaje de ayuda debajo del campo. Pasa por `this.t()`. Se reemplaza por `error` si ambos están presentes.                       |
| `error`       | `error`       | String  | `''`        | Mensaje de error debajo del campo (`role="alert"`, marca `aria-invalid="true"`). Pasa por `this.t()`.                            |
| `rows`        | `rows`        | Number  | `4`         | Alto visible del campo, en líneas — pasa directo al atributo `rows` del `<textarea>`.                                            |
| `disabled`    | `disabled`    | Boolean | `false`     | Deshabilita el campo (reflejado).                                                                                                |
| `readonly`    | `readonly`    | Boolean | `false`     | Solo lectura (reflejado).                                                                                                        |
| `required`    | `required`    | Boolean | `false`     | Marca el campo como obligatorio (reflejado) — agrega un `*` visual junto a la etiqueta (`aria-hidden`, no se anuncia dos veces). |
| `ambient`     | `ambient`     | String  | `'primary'` | Heredado de `ComponentMixin`. `'primary'`/`'secondary'` cambian el color de foco.                                                |

Método: `focus(options?)` — lleva el foco al `<textarea>` interno.

## Eventos

| Evento                     | Cuándo                                           | `detail`            |
| -------------------------- | ------------------------------------------------ | ------------------- |
| `ac-textarea-basic-input`  | En cada tecla (evento `input` nativo).           | `{ value: string }` |
| `ac-textarea-basic-change` | Al perder el foco con cambios (`change` nativo). | `{ value: string }` |

Ambos `bubbles: true, composed: true`.

## i18n

`label`, `placeholder`, `hint` y `error` pasan por `this.t()` — aceptan tanto un literal como una clave de `locales.json`:

```html
<ac-textarea-basic
  label="textarea-basic-comment-label"
  placeholder="textarea-basic-comment-placeholder"
  hint="textarea-basic-comment-hint"
></ac-textarea-basic>
```

## Desarrollo

```bash
aclit component:lint
aclit component:serve           # o: pnpm --filter @ac-components/ac-textarea-basic component:serve    — demo en http://localhost:5173
aclit component:test
aclit component:build
aclit component:test:e2e        # funcional (WebdriverIO + Cucumber)
aclit component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/textarea-basic.styles.js` se genera a partir de `src/textarea-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
