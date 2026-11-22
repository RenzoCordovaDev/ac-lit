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
<ac-input-basic label="Monto" type="amount" name="amount"></ac-input-basic>
<ac-input-basic label="Fecha" type="date" name="birth-date"></ac-input-basic>
```

## Propiedades

| Propiedad     | Atributo      | Tipo    | Default     | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------- | ------------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`       | `label`       | String  | `''`        | Etiqueta visible. Se pasa por `this.t()`: si es una clave de `locales.json` se traduce, si no se muestra tal cual.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `a11yLabel`   | `a11y-label`  | String  | `''`        | Nombre accesible cuando **no** hay etiqueta visible (ej. un buscador). Se ignora si hay `label`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `value`       | `value`       | String  | `''`        | Valor del campo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `type`        | `type`        | String  | `'text'`    | Controla el `type` **nativo** del `<input>`: `text`, `email`, `password`, `search`, `tel`, `url` o `number`; cualquier otro valor cae a `text` (lista blanca) — `password`, `search`, `tel` y `url` siguen funcionando exactamente igual que antes, sin ícono. Además, de forma puramente visual y sobre el mismo valor crudo de `type` (capa separada de la lista blanca anterior), `email` y `number` muestran un ícono a la izquierda y un placeholder sugerido automático, y `amount`/`date` hacen lo mismo aunque no sean tipos nativos válidos (el `<input>` real sigue cayendo a `text` para esos dos). Ver "Tipos semánticos (ícono + placeholder)" abajo. |
| `name`        | `name`        | String  | `''`        | Nombre del campo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `placeholder` | `placeholder` | String  | `''`        | Texto de ejemplo (también pasa por `this.t()`). Si no se define y `type` tiene un placeholder sugerido (ver abajo), se usa ese; `placeholder` del consumidor siempre tiene prioridad.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `hint`        | `hint`        | String  | `''`        | Texto de ayuda bajo el campo (también pasa por `this.t()`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `error`       | `error`       | String  | `''`        | Mensaje de error. Reemplaza a `hint`, marca el campo con `aria-invalid="true"` y se anuncia con `role="alert"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `disabled`    | `disabled`    | Boolean | `false`     | Deshabilita el campo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `readonly`    | `readonly`    | Boolean | `false`     | Campo de solo lectura (borde punteado).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `required`    | `required`    | Boolean | `false`     | Campo obligatorio; muestra un asterisco decorativo junto a la etiqueta.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `ambient`     | `ambient`     | String  | `'primary'` | Color del foco: `primary` o `secondary`. Heredado de `ComponentMixin`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

El método `focus()` lleva el foco al campo interno.

## Eventos

| Evento                  | Cuándo                                             | `detail`            |
| ----------------------- | -------------------------------------------------- | ------------------- |
| `ac-input-basic-input`  | En cada cambio mientras el usuario escribe         | `{ value: string }` |
| `ac-input-basic-change` | Al confirmar el cambio (al perder el foco / Enter) | `{ value: string }` |

`bubbles` y `composed`.

## Tipos semánticos (ícono + placeholder)

Además de controlar el `type` nativo del `<input>`, `type` ahora decide también un ícono (`@ac-components/ac-icon-basic`, part `type-icon`) a la izquierda del campo y un placeholder sugerido (clave de `locales.json`, usado solo si el consumidor no definió su propio `placeholder`):

| `type`   | Ícono      | Placeholder sugerido (`es-PE`) | `type` nativo del `<input>`                  |
| -------- | ---------- | ------------------------------ | -------------------------------------------- |
| `amount` | `currency` | `0.00`                         | `text` (no es un tipo nativo válido)         |
| `date`   | `calendar` | `DD/MM/AAAA`                   | `text` (no es un tipo nativo válido)         |
| `number` | `hash`     | `0`                            | `number` (comportamiento nativo sin cambios) |
| `email`  | `email`    | `nombre@dominio.com`           | `email` (comportamiento nativo sin cambios)  |

`password`, `search`, `tel` y `url` no tienen ícono ni placeholder sugerido — siguen funcionando exactamente igual que antes, con su comportamiento nativo intacto. Sin ícono (incluido `text`, el default), el campo se ve exactamente igual que antes de este cambio.

## Parts y CSS

| Part        | Descripción                                                              |
| ----------- | ------------------------------------------------------------------------ |
| `root`      | Contenedor de todo el campo.                                             |
| `label`     | La etiqueta.                                                             |
| `type-icon` | El ícono a la izquierda, solo con los `type` que lo tienen (ver arriba). |
| `input`     | El `<input>` nativo.                                                     |
| `hint`      | El texto de ayuda.                                                       |
| `error`     | El mensaje de error.                                                     |

## Accesibilidad

- La etiqueta está asociada al campo (`for`/`id`); la ayuda y el error se enlazan con `aria-describedby`.
- El color del foco y del mensaje de error depende del tema (claro/oscuro) para cumplir contraste WCAG AA en ambos; el borde del campo cumple 3:1.
- Un `<input>` dentro de un shadow root **no participa** de un `<form>` nativo: lee `value` del componente o escucha los eventos.

## i18n

`locales.json` incluye claves de ejemplo (`input-basic-email-label`, `-placeholder`, `-hint`, `-error`) y los 4 placeholders sugeridos por tipo semántico (`input-basic-placeholder-amount`, `-date`, `-number`, `-email`) en `es-PE`, `en-EN` y `pt-BR`.

## Desarrollo

```bash
aclit component:lint
aclit component:serve           # o: pnpm --filter @ac-components/ac-input-basic component:serve    — demo en http://localhost:5173
aclit component:test
aclit component:build
aclit component:test:e2e        # funcional (WebdriverIO + Cucumber)
aclit component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/input-basic.styles.js` se genera a partir de `src/input-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
