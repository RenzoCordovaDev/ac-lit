# @ac-components/ac-radio-basic

Radio button básico construido sobre `@ac-base/ac-component-mixin`, con un `<input type="radio">` real por dentro (no una simulación con `role="radio"`).

## Instalación

```bash
pnpm add @ac-components/ac-radio-basic
```

```js
import '@ac-components/ac-radio-basic';
```

```html
<ac-radio-basic name="plan" value="monthly" checked>Mensual</ac-radio-basic>
<ac-radio-basic name="plan" value="annual">Anual</ac-radio-basic>
```

## Propiedades

| Propiedad  | Atributo   | Tipo    | Default | Descripción                                                                             |
| ---------- | ---------- | ------- | ------- | --------------------------------------------------------------------------------------- |
| `text`     | `text`     | String  | `''`    | Si se define, se usa como **clave de traducción** (`this.t(text)`) en vez del `<slot>`. |
| `name`     | `name`     | String  | `''`    | Nombre del grupo — radios con el mismo `name` se excluyen mutuamente.                   |
| `value`    | `value`    | String  | `''`    | Valor asociado a esta opción.                                                           |
| `checked`  | `checked`  | Boolean | `false` | Si está marcado.                                                                        |
| `disabled` | `disabled` | Boolean | `false` | Deshabilita el input nativo y bloquea `ac-radio-basic-change`.                          |

## Eventos

- **`ac-radio-basic-change`** — `{ bubbles: true, composed: true, detail: { checked, value } }`. Se dispara al marcar (click/teclado) el radio. No se dispara si `disabled` es `true`.

## Agrupación entre instancias (`name`)

Un `<input type="radio">` nativo solo agrupa con otros radios del **mismo shadow root**. Como cada `ac-radio-basic` vive en su propio shadow root, el agrupado nativo por `name` **no funciona** entre instancias distintas — confirmado en Firefox, Chromium y Safari actuales (ninguno agrupa radios a través de shadow boundaries).

Por eso el componente mantiene un registro propio en memoria (por `name`) y, al marcarse un radio, desmarca manualmente a los demás del mismo grupo — sin esto, varios `ac-radio-basic` con el mismo `name` se comportarían como checkboxes independientes.

> **Fuera de alcance**: navegación con flechas entre radios del mismo grupo (el patrón ARIA `radiogroup` completo). Tab/click/Enter/Espacio funcionan de forma nativa en cada radio individual; mover la selección con flechas de teclado no está implementado — es una pieza más grande (coordinación de foco entre instancias) que excede lo que un componente "basic" necesita.

## Theming

- `--color-subtext` (borde sin marcar) y `--color-primary-500` (borde + punto cuando está marcado), con fallback al valor por defecto de `@ac-base/ac-core`.

```js
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
```

## i18n

`locales.json` incluye la clave `radio-basic-option` (`es-PE`, `en-EN`, `pt-BR`). Pásala vía `text`:

```html
<ac-radio-basic text="radio-basic-option"></ac-radio-basic>
```

## Desarrollo

```bash
pnpm --filter @ac-components/ac-radio-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-radio-basic component:test
pnpm --filter @ac-components/ac-radio-basic component:build
pnpm --filter @ac-components/ac-radio-basic component:test:e2e        # funcional (WebdriverIO + Cucumber)
pnpm --filter @ac-components/ac-radio-basic component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/radio-basic.styles.js` se genera a partir de `src/radio-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
