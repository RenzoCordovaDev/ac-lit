# `@ac-components/ac-date-basic`

Formatea y muestra una fecha. Recibe un `value` parseable con `new Date()` (ISO 8601) y lo muestra con `Intl.DateTimeFormat` (fecha corta o larga, según el idioma activo) o, si se define `format`, con un reemplazo de tokens simple y manual (`DD`/`MM`/`YYYY`).

## Instalación

```bash
pnpm add @ac-components/ac-date-basic
```

```js
import '@ac-components/ac-date-basic';
```

```html
<!-- Fecha corta (default) -->
<ac-date-basic value="2026-11-22"></ac-date-basic>

<!-- Fecha larga -->
<ac-date-basic value="2026-11-22" type="long"></ac-date-basic>

<!-- Formato personalizado: tiene prioridad sobre `type` -->
<ac-date-basic value="2026-11-22" format="DD/MM/YYYY"></ac-date-basic>
```

## Propiedades

| Propiedad | Atributo  | Tipo   | Default   | Descripción                                                                                                                        |
| --------- | --------- | ------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `value`   | `value`   | String | `''`      | Fecha de entrada, parseable con `new Date(this.value)` (ISO 8601, ej. `'2026-11-22'`).                                             |
| `type`    | `type`    | String | `'short'` | `'short'` (fecha corta) o `'long'` (fecha larga). Cualquier otro valor cae a `'short'` (lista blanca).                             |
| `format`  | `format`  | String | `''`      | Patrón de formato personalizado, opcional. Si está definido (no vacío), tiene prioridad sobre `type`. Ver "Formato personalizado". |
| `size`    | `size`    | String | `'md'`    | Se reenvía al `ac-text-basic` interno (`sm`, `md` o `lg`).                                                                         |
| `tag`     | `tag`     | String | `'span'`  | Se reenvía al `ac-text-basic` interno (etiqueta renderizada).                                                                      |
| `ambient` | `ambient` | String | `'light'` | Heredado de `ComponentMixin`, se reenvía al `ac-text-basic` interno.                                                               |
| `locale`  | `locale`  | String | `'es-PE'` | Heredado de `IntlMixin` (parte de `ComponentMixin`). Usado por `Intl.DateTimeFormat` cuando `format` no está seteado.              |

## Formateo sin `format` (`Intl.DateTimeFormat`)

Sin `format`, la fecha se formatea con `Intl.DateTimeFormat(this.locale, { dateStyle: this._type })` — un formateo **locale-aware** real: el resultado depende del idioma activo (`es-PE`, `en-EN`, `pt-BR`), no es un patrón fijo.

## Formato personalizado (`format`)

El monorepo no tiene ninguna librería de fechas (no hay `date-fns`/`dayjs`), así que `format` es un **reemplazo de tokens simple y manual**, no un formateo locale-aware como `Intl.DateTimeFormat` — no lo confundas con algo más potente. Soporta estos tokens, sustituidos con los getters nativos **UTC** de `Date` (ver nota de zona horaria abajo):

| Token  | Significado                |
| ------ | -------------------------- |
| `YYYY` | Año, 4 dígitos             |
| `MM`   | Mes, 2 dígitos (`01`–`12`) |
| `DD`   | Día, 2 dígitos (`01`–`31`) |

```html
<ac-date-basic value="2026-11-22" format="DD/MM/YYYY"></ac-date-basic>
<!-- Muestra: 22/11/2026 -->
```

**Nota de zona horaria**: `new Date('2026-11-22')` (fecha sin hora) se interpreta como medianoche UTC. `format` lee la fecha con los getters **UTC** de `Date` (`getUTCFullYear`/`getUTCMonth`/`getUTCDate`), no los locales, para que el token coincida siempre con la fecha literal del `value` recibido, sin importar la zona horaria del navegador — con los getters locales, un `value` de solo fecha se desplazaría un día hacia atrás en cualquier zona horaria con offset negativo (ej. América).

## `value` inválido

Si `value` no parsea a una fecha válida (`isNaN(date.getTime())`), el componente muestra el `value` crudo tal cual, sin intentar formatear — un fallback seguro para no perder información silenciosamente.

## Implementación interna: `ac-text-basic`

`ac-date-basic` renderiza internamente `<ac-text-basic part="root">` y le pasa el texto ya formateado como contenido del **slot por defecto** (luz, no shadow) — nunca por la propiedad `text` de `ac-text-basic`, que trata ese valor como clave de traducción. `ac-text-basic` se registra como dependencia real de runtime vía `ScopedElementsMixin` (heredado de `ComponentMixin`), mismo patrón que usa `ac-icon-button-basic` para consumir `ac-icon-basic`.

## Parts y CSS

| Part   | Descripción                                       |
| ------ | ------------------------------------------------- |
| `root` | El `ac-text-basic` interno que contiene el texto. |

## Desarrollo

```bash
aclit component:lint
aclit component:serve           # o: pnpm --filter @ac-components/ac-date-basic component:serve    — demo en http://localhost:5173
aclit component:test
aclit component:build
aclit component:test:e2e        # funcional (WebdriverIO + Cucumber)
aclit component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/date-basic.styles.js` se genera a partir de `src/date-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
