# @ac-components/ac-button-basic

Primer componente del catálogo `@ac-components/*`: un botón básico construido sobre `@ac-base/ac-component-mixin`.

## Instalación

```bash
pnpm add @ac-components/ac-button-basic
```

```js
import '@ac-components/ac-button-basic';
```

```html
<ac-button-basic variant="primary">Enviar</ac-button-basic>
```

## Propiedades

| Propiedad   | Atributo     | Tipo    | Default     | Descripción                                                                             |
| ----------- | ------------ | ------- | ----------- | --------------------------------------------------------------------------------------- |
| `text`      | `text`       | String  | `''`        | Si se define, se usa como **clave de traducción** (`this.t(text)`) en vez del `<slot>`. |
| `variant`   | `variant`    | String  | `'primary'` | `primary` \| `primary-alt` \| `secondary` \| `secondary-alt`                            |
| `disabled`  | `disabled`   | Boolean | `false`     | Deshabilita el botón nativo y bloquea `ac-button-basic-click`.                          |
| `fullWidth` | `full-width` | Boolean | `false`     | Ocupa el 100% del contenedor.                                                           |
| `loading`   | `loading`    | Boolean | `false`     | Muestra un skeleton animado en vez del contenido y deshabilita el click.                |

## Eventos

- **`ac-button-basic-click`** — `{ bubbles: true, composed: true, detail: true }`. No se dispara si `disabled` o `loading` son `true`.

## Theming

Los colores se leen de custom properties (`--color-primary-700`, `--color-accent-500`, etc.) con fallback al valor por defecto de `@ac-base/ac-core`, así que el componente se ve bien aunque el host no importe ningún token. Para usar la paleta completa del ecosistema:

```js
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
```

## i18n

`locales.json` incluye la clave `button-basic-submit` (`es-PE`, `en-EN`, `pt-BR`). Pásala vía `text`:

```html
<ac-button-basic text="button-basic-submit"></ac-button-basic>
```

## Desarrollo

```bash
pnpm --filter @ac-components/ac-button-basic dev    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-button-basic test
pnpm --filter @ac-components/ac-button-basic build
```

> `src/button-basic.styles.js` se genera a partir de `src/button-basic.styles.scss` (`build:styles`, corre automáticamente antes de `dev`/`build`/`test`) y no se versiona en git.
