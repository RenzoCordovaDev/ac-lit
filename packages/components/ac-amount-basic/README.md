# `@ac-components/ac-amount-basic`

Formatea y muestra un monto monetario con `Intl.NumberFormat`, en el idioma activo (`this.locale`, heredado de `IntlMixin`/`ComponentMixin`). Internamente renderiza un [`ac-text-basic`](../ac-text-basic/README.md) con el texto ya formateado como contenido (no usa su propiedad `text`, que trataría el valor como clave de traducción).

## Instalación

```bash
pnpm add @ac-components/ac-amount-basic
```

```js
import '@ac-components/ac-amount-basic';
```

```html
<ac-amount-basic amount="1234.5" currency="USD"></ac-amount-basic>
<!-- "USD 1,234.50" (locale "es-PE", el default global) -->

<ac-amount-basic amount="99.9" currency="PEN" ambient="primary" tag="strong"></ac-amount-basic>
<!-- "S/ 99.90" -->
```

## Propiedades

| Propiedad  | Atributo   | Tipo    | Default     | Descripción                                                                                                                                                    |
| ---------- | ---------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `amount`   | `amount`   | Number  | `0`         | Valor numérico a formatear.                                                                                                                                    |
| `currency` | `currency` | String  | `'PEN'`     | Código de moneda ISO 4217 (ej. `'USD'`, `'EUR'`, `'PEN'`). Un código inválido/no soportado por `Intl.NumberFormat` cae a `'PEN'`.                              |
| `size`     | `size`     | String  | `'md'`      | Passthrough al `ac-text-basic` interno: `sm`, `md` o `lg`.                                                                                                     |
| `tag`      | `tag`      | String  | `'span'`    | Passthrough al `ac-text-basic` interno: etiqueta renderizada (`span`, `p`, `div`, `strong`, `em`, `small`, `label` o `h1`–`h6`).                               |
| `ambient`  | `ambient`  | String  | `'default'` | Heredado de `ComponentMixin`, forwardeado al `ac-text-basic` interno: `default` (color de texto del tema) o `primary`.                                         |
| `locale`   | `locale`   | String  | `'es-PE'`   | Heredado de `IntlMixin`/`ComponentMixin`. Locale usado por `Intl.NumberFormat` (`'es-PE'`, `'en-EN'`, `'pt-BR'`). Se cambia globalmente con `setGlobalLocale`. |
| `loading`  | `loading`  | Boolean | `false`     | Heredado de `ComponentMixin`. Muestra el skeleton de carga por defecto.                                                                                        |

## Formateo y fallback de moneda

El texto se calcula con:

```js
new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.currency }).format(
  this.amount,
);
```

Si `currency` no es un código ISO 4217 reconocido, `Intl.NumberFormat` lanza una excepción — `ac-amount-basic` la captura y reintenta con `currency: 'PEN'` como fallback seguro (mismo patrón "whitelist con fallback seguro" que `ALLOWED_TYPES`/`_type` de `ac-input-basic` o `ICON_MAP`/`FALLBACK_ICON` de `ac-icon-basic`):

```html
<ac-amount-basic amount="10" currency="NOPE"></ac-amount-basic>
<!-- currency inválido → se muestra formateado en PEN -->
```

## Ejemplos con distintas monedas

Con el locale global por defecto (`'es-PE'`):

```html
<ac-amount-basic amount="1234.5" currency="PEN"></ac-amount-basic>
<!-- "S/ 1,234.50" -->

<ac-amount-basic amount="1234.5" currency="USD"></ac-amount-basic>
<!-- "USD 1,234.50" -->

<ac-amount-basic amount="1234.5" currency="EUR"></ac-amount-basic>
<!-- "EUR 1,234.50" -->
```

Con `locale="en-EN"`, el mismo `currency="USD"` muestra el símbolo (`"$1,234.50"`) — el locale activo decide si se usa el código ISO o el símbolo de la moneda, no es una elección del componente.

## Parts y CSS

| Part   | Descripción                                                     |
| ------ | --------------------------------------------------------------- |
| `root` | El `ac-text-basic` interno que contiene el texto ya formateado. |

## i18n

Este componente no define ninguna clave propia en `locales.json` — el texto final nunca pasa por `this.t()`, solo por `Intl.NumberFormat`. `locale` controla el formato de número/moneda (separadores, posición del símbolo), no una traducción.

## Desarrollo

```bash
aclit component:lint
aclit component:serve           # o: pnpm --filter @ac-components/ac-amount-basic component:serve    — demo en http://localhost:5173
aclit component:test
aclit component:build
aclit component:test:e2e        # funcional (WebdriverIO + Cucumber)
aclit component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/amount-basic.styles.js` se genera a partir de `src/amount-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
