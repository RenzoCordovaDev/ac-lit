# `@ac-components/ac-text-basic`

Texto que traduce su contenido con `this.t()`. Pasas una **clave** (o un literal) en `text` y el componente muestra su equivalente en el idioma activo; si no existe traducción, muestra el propio literal.

## Instalación

```bash
pnpm add @ac-components/ac-text-basic
```

```js
import '@ac-components/ac-text-basic';
```

```html
<ac-text-basic text="bienvenida"></ac-text-basic>
<ac-text-basic tag="h2" size="lg">Contenido por slot (sin traducir)</ac-text-basic>
```

## Propiedades

| Propiedad      | Atributo       | Tipo   | Default     | Descripción                                                                                                                                            |
| -------------- | -------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `text`         | `text`         | String | `''`        | Clave de traducción (o literal). Si se define, se traduce con `this.t()`; si no, se muestra el `<slot>`.                                               |
| `params`       | `params`       | Object | `{}`        | Valores para los marcadores `{nombre}` de la traducción. Como atributo, JSON: `params='{"name":"Ana"}'`.                                               |
| `translations` | `translations` | Object | `{}`        | Traducciones solo para esta instancia, con la forma de `locales.json` (`{ 'es-PE': { clave: 'texto' } }`). Tiene prioridad sobre las de la aplicación. |
| `tag`          | `tag`          | String | `'span'`    | Etiqueta renderizada: `span`, `p`, `div`, `strong`, `em`, `small`, `label` o `h1`–`h6`. Cualquier otro valor cae a `span` (lista blanca).              |
| `size`         | `size`         | String | `'md'`      | `sm`, `md` o `lg`.                                                                                                                                     |
| `ambient`      | `ambient`      | String | `'default'` | `default` (color de texto del tema) o `primary`. Heredado de `ComponentMixin`.                                                                         |

## Traducciones de la aplicación

El `locales.json` del componente solo trae sus propias claves de ejemplo. Para las claves de tu aplicación, regístralas una vez (misma forma que `locales.json`); las instancias ya montadas se actualizan solas:

```js
import { addTextTranslations } from '@ac-components/ac-text-basic';

addTextTranslations({
  'es-PE': { bienvenida: 'Bienvenido', saludo: 'Hola, {name}' },
  'en-EN': { bienvenida: 'Welcome', saludo: 'Hello, {name}' },
});
```

Orden de resolución de una clave: propiedad `translations` de la instancia → `addTextTranslations` → `locales.json` del componente → la propia clave.

El idioma activo se cambia con `setGlobalLocale` de `@ac-base/ac-intl-mixin`.

## Parts y CSS

| Part   | Descripción                        |
| ------ | ---------------------------------- |
| `root` | La etiqueta que contiene el texto. |

## i18n

`locales.json` incluye la clave `text-basic-label` (`es-PE`, `en-EN`, `pt-BR`) como ejemplo.

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-text-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/text-basic.styles.js` se genera a partir de `src/text-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
