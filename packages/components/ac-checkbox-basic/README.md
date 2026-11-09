# `@ac-components/ac-checkbox-basic`

Casilla de verificación accesible: usa un `<input type="checkbox">` nativo (teclado, foco y lectores de pantalla) con un control visual propio. Soporta estado marcado, **indeterminado** y deshabilitado.

## Instalación

```bash
pnpm add @ac-components/ac-checkbox-basic
```

```js
import '@ac-components/ac-checkbox-basic';
```

```html
<ac-checkbox-basic name="terms" value="accepted">Acepto los términos</ac-checkbox-basic>
<ac-checkbox-basic text="checkbox-basic-accept-terms" checked></ac-checkbox-basic>
```

## Propiedades

| Propiedad       | Atributo        | Tipo    | Default     | Descripción                                                                             |
| --------------- | --------------- | ------- | ----------- | --------------------------------------------------------------------------------------- |
| `text`          | `text`          | String  | `''`        | Si se define, se usa como **clave de traducción** (`this.t(text)`) en vez del `<slot>`. |
| `name`          | `name`          | String  | `''`        | Nombre del campo.                                                                       |
| `value`         | `value`         | String  | `''`        | Valor del campo; viaja en el detalle del evento.                                        |
| `checked`       | `checked`       | Boolean | `false`     | Estado marcado (reflejado como atributo).                                               |
| `indeterminate` | `indeterminate` | Boolean | `false`     | Muestra un guion en vez del check. Se limpia solo cuando el usuario hace click.         |
| `disabled`      | `disabled`      | Boolean | `false`     | Deshabilita la casilla.                                                                 |
| `ambient`       | `ambient`       | String  | `'primary'` | `primary` o `secondary`. Heredado de `ComponentMixin`.                                  |

## Eventos

| Evento                     | Cuándo                                 | `detail`                              |
| -------------------------- | -------------------------------------- | ------------------------------------- |
| `ac-checkbox-basic-change` | El usuario marca o desmarca la casilla | `{ checked: boolean, value: string }` |

`bubbles` y `composed`: se escucha desde fuera del shadow root. No se dispara si la casilla está deshabilitada.

## Parts y CSS

| Part      | Descripción                          |
| --------- | ------------------------------------ |
| `root`    | El `<label>` que envuelve todo.      |
| `input`   | El `<input type="checkbox">` nativo. |
| `control` | El cuadro visual (check / guion).    |
| `label`   | El contenedor del texto.             |

## Accesibilidad

El input nativo queda superpuesto (no oculto con `display:none`), así que conserva foco, teclado (Espacio) y semántica. El borde del control cumple 3:1 contra el fondo en ambos temas, y el estado marcado usa fondos sólidos con texto fijo (ver `docs/CONVENTIONS.md`).

> Un `<input>` dentro de un shadow root **no participa** de un `<form>` nativo: lee `checked`/`value` del componente o escucha el evento.

## i18n

`locales.json` incluye la clave `checkbox-basic-accept-terms` (`es-PE`, `en-EN`, `pt-BR`).

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-checkbox-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/checkbox-basic.styles.js` se genera a partir de `src/checkbox-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
