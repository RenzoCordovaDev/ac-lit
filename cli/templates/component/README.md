# `__package_name__`

Componente `__tag__` generado con `ac component create`.

## Instalación

```bash
pnpm add __package_name__
```

```js
import '__package_name__';
```

```html
<__tag__>Hola</__tag__>
```

## Propiedades

| Propiedad | Atributo  | Tipo   | Default     | Descripción                                                                             |
| --------- | --------- | ------ | ----------- | --------------------------------------------------------------------------------------- |
| `text`    | `text`    | String | `''`        | Si se define, se usa como **clave de traducción** (`this.t(text)`) en vez del `<slot>`. |
| `ambient` | `ambient` | String | `'default'` | Heredado de `ComponentMixin`. Agrega los ambients que necesites en `src/__file_base__.styles.scss`. |

> Este componente es un punto de partida genérico — edita propiedades, render y estilos según lo que necesites. Revisa `docs/CONVENTIONS.md` para las convenciones de naming/eventos/CSS del ecosistema.

## i18n

`locales.json` incluye la clave `__file_base__-label` (`es-PE`, `en-EN`, `pt-BR`). Pásala vía `text`:

```html
<__tag__ text="__file_base__-label"></__tag__>
```

## Desarrollo

```bash
ac component:serve    # o: pnpm --filter __package_name__ component:serve    — demo en http://localhost:5173
ac test
ac build
ac test:e2e        # funcional (WebdriverIO + Cucumber)
ac test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/__file_base__.styles.js` se genera a partir de `src/__file_base__.styles.scss` (`build:styles`, corre automáticamente antes de `component:serve`/`build`/`test`) y no se versiona en git.
