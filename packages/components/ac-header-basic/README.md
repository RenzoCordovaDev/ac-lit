# @ac-components/ac-header-basic

Encabezado horizontal de página o sección que distribuye el título, el contenido central opcional y las acciones en un `<header>` nativo.

## Instalación

```bash
pnpm add @ac-components/ac-header-basic
```

```js
import '@ac-components/ac-header-basic';
```

```html
<ac-header-basic>
  <h1 slot="start">Pedidos</h1>
  <a slot="end" href="/pedidos/nuevo">Nuevo pedido</a>
</ac-header-basic>
```

## Propiedades

| Propiedad | Atributo  | Tipo    | Default     | Descripción                                                                          |
| --------- | --------- | ------- | ----------- | ------------------------------------------------------------------------------------ |
| `sticky`  | `sticky`  | Boolean | `false`     | Queda pegado al borde superior del contenedor con scroll. Se refleja en el atributo. |
| `divider` | `divider` | Boolean | `true`      | Muestra un borde inferior. Se refleja en el atributo.                                |
| `ambient` | `ambient` | String  | `'surface'` | `surface` \| `transparent`. Propiedad reflejada y heredada de `ComponentMixin`.      |

Para quitar el borde, asigna `header.divider = false` desde JavaScript o enlaza `.divider=${false}` desde Lit.

Con `sticky`, coloca el encabezado y el contenido en el mismo contenedor con scroll. Aplica `scroll-padding-block-start` a ese contenedor con un valor igual o mayor que la altura del encabezado, también cuando cambie de altura al adaptarse al ancho disponible. Así el desplazamiento deja espacio para el contenido que recibe el foco.

## Slots

| Slot                 | Contenido                                                              |
| -------------------- | ---------------------------------------------------------------------- |
| `start`              | Logo, título o ruta de navegación al inicio de la franja.              |
| Default (sin nombre) | Contenido central opcional, como un buscador.                          |
| `end`                | Acciones al final de la franja, incluso si el slot central está vacío. |

Los enlaces y controles colocados en los slots conservan su comportamiento nativo. La aplicación define sus acciones y destinos.

## Theming

`surface` usa `--color-surface` y `--color-text` del tema activo. `transparent` muestra el fondo de la página y adapta el texto al tema. Si lo colocas sobre una imagen, comprueba el contraste del contenido sobre esa imagen. El borde inferior decorativo deriva de `--color-subtext`. Personaliza el `<header>` interno con `::part(header)`.

```js
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

## i18n

El componente no tiene texto propio (todo el contenido llega por slot), así que no define ninguna clave en `locales.json`. La aplicación traduce el contenido y los nombres accesibles que coloca en los slots.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-header-basic component:lint
pnpm --filter @ac-components/ac-header-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-header-basic component:test
pnpm --filter @ac-components/ac-header-basic component:build
pnpm --filter @ac-components/ac-header-basic component:preview
pnpm --filter @ac-components/ac-header-basic component:build:styles
pnpm --filter @ac-components/ac-header-basic component:build:styles:watch
```

> `src/header-basic.styles.js` se genera a partir de `src/header-basic.styles.scss` al ejecutar `component:serve`, `component:build` o `component:test`. Durante `component:serve`, el archivo se recompila cada vez que se guarda el SCSS y Vite recarga el navegador.
