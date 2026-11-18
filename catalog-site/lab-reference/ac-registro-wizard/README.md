# `@ac-components/ac-registro-wizard`

Componente `ac-registro-wizard` generado con `aclit component:create`.

## Instalación

```bash
pnpm add @ac-components/ac-registro-wizard
```

```js
import '@ac-components/ac-registro-wizard';
```

```html
<ac-registro-wizard>Hola</ac-registro-wizard>
```

## Propiedades

| Propiedad | Atributo  | Tipo   | Default     | Descripción                                                                                           |
| --------- | --------- | ------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| `text`    | `text`    | String | `''`        | Si se define, se usa como **clave de traducción** (`this.t(text)`) en vez del `<slot>`.               |
| `ambient` | `ambient` | String | `'default'` | Heredado de `ComponentMixin`. Agrega los ambients que necesites en `src/registro-wizard.styles.scss`. |

> Este componente es un punto de partida genérico — edita propiedades, render y estilos según lo que necesites. Revisa `docs/CONVENTIONS.md` para las convenciones de naming/eventos/CSS del ecosistema.

## i18n

`locales.json` incluye la clave `registro-wizard-label` (`es-PE`, `en-EN`, `pt-BR`). Pásala vía `text`:

```html
<ac-registro-wizard text="registro-wizard-label"></ac-registro-wizard>
```

## Desarrollo

```bash
aclit component:serve           # o: pnpm --filter @ac-components/ac-registro-wizard component:serve    — demo en http://localhost:5173
aclit component:lint
aclit component:test
aclit component:build
aclit component:test:e2e        # funcional (WebdriverIO + Cucumber)
aclit component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/registro-wizard.styles.js` se genera a partir de `src/registro-wizard.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
