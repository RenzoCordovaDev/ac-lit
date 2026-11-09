# `@ac-components/ac-switch-basic`

Interruptor on/off accesible: un `<input type="checkbox" role="switch">` nativo (teclado, foco y lectores de pantalla) con pista y pulgar propios.

## Instalación

```bash
pnpm add @ac-components/ac-switch-basic
```

```js
import '@ac-components/ac-switch-basic';
```

```html
<ac-switch-basic name="wifi" value="on">Wi-Fi</ac-switch-basic>
<ac-switch-basic text="switch-basic-notifications" checked></ac-switch-basic>
```

## Propiedades

| Propiedad  | Atributo   | Tipo    | Default     | Descripción                                                                             |
| ---------- | ---------- | ------- | ----------- | --------------------------------------------------------------------------------------- |
| `text`     | `text`     | String  | `''`        | Si se define, se usa como **clave de traducción** (`this.t(text)`) en vez del `<slot>`. |
| `name`     | `name`     | String  | `''`        | Nombre del campo.                                                                       |
| `value`    | `value`    | String  | `''`        | Valor del campo; viaja en el detalle del evento.                                        |
| `checked`  | `checked`  | Boolean | `false`     | Interruptor encendido (reflejado como atributo).                                        |
| `disabled` | `disabled` | Boolean | `false`     | Deshabilita el interruptor.                                                             |
| `ambient`  | `ambient`  | String  | `'primary'` | `primary` o `secondary`. Heredado de `ComponentMixin`.                                  |

## Eventos

| Evento                   | Cuándo                                     | `detail`                              |
| ------------------------ | ------------------------------------------ | ------------------------------------- |
| `ac-switch-basic-change` | El usuario enciende o apaga el interruptor | `{ checked: boolean, value: string }` |

`bubbles` y `composed`. No se dispara si el interruptor está deshabilitado.

## Parts y CSS

| Part    | Descripción                        |
| ------- | ---------------------------------- |
| `root`  | El `<label>` que envuelve todo.    |
| `input` | El `<input role="switch">` nativo. |
| `track` | La pista.                          |
| `thumb` | El pulgar que se desplaza.         |
| `label` | El contenedor del texto.           |

## Accesibilidad

El input nativo queda superpuesto (no oculto con `display:none`), así que conserva foco, teclado (Espacio) y el rol `switch`. El borde de la pista cumple 3:1 contra el fondo en ambos temas; encendido usa fondos sólidos con pulgar de color fijo. La transición se desactiva con `prefers-reduced-motion`.

> Un `<input>` dentro de un shadow root **no participa** de un `<form>` nativo: lee `checked`/`value` del componente o escucha el evento.

## i18n

`locales.json` incluye la clave `switch-basic-notifications` (`es-PE`, `en-EN`, `pt-BR`).

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-switch-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/switch-basic.styles.js` se genera a partir de `src/switch-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
