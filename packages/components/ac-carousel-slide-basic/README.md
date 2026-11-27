# @ac-components/ac-carousel-slide-basic

Diapositiva de contenido arbitrario para `ac-carousel-basic`, que también se puede mostrar de forma autónoma.

## Instalación

```bash
pnpm add @ac-components/ac-carousel-slide-basic
```

```js
import '@ac-components/ac-carousel-slide-basic';
```

```html
<ac-carousel-slide-basic active>
  <h2>Recojo en tienda</h2>
  <p>Presenta el comprobante de tu pedido.</p>
</ac-carousel-slide-basic>
```

## Propiedades

| Propiedad | Atributo  | Tipo    | Default     | Descripción                                                                                                                  |
| --------- | --------- | ------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `active`  | `active`  | Boolean | `false`     | Muestra la diapositiva y permite enfocar su contenido. Se refleja como atributo.                                             |
| `index`   | —         | Number  | `0`         | Posición desde cero para el nombre accesible. El carrusel la asigna como propiedad JS.                                       |
| `total`   | —         | Number  | `1`         | Cantidad total de diapositivas para el nombre accesible. El carrusel la asigna como propiedad JS.                            |
| `ambient` | `ambient` | String  | `'primary'` | `primary` para un borde esmeralda o `secondary` para un borde ámbar. Heredada de `ComponentMixin` y reflejada como atributo. |

## Slots

El slot por defecto recibe imágenes, texto u otros elementos. La diapositiva inactiva queda fuera del flujo, de la navegación por teclado y del árbol de accesibilidad.

## Theming

El borde usa tonos de los tokens esmeralda o ámbar adaptados al tema. El contenido del slot hereda el color de la página. El `part="root"` permite estilizar el contenedor.

```js
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

## i18n

`locales.json` incluye `carousel-slide-basic-position` para `es-PE`, `en-EN` y `pt-BR`. El nombre accesible «Diapositiva 1 de 1» se construye automáticamente con `index` y `total`. El atributo `locale` selecciona el idioma de la instancia.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-carousel-slide-basic component:lint
pnpm --filter @ac-components/ac-carousel-slide-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-carousel-slide-basic component:test
pnpm --filter @ac-components/ac-carousel-slide-basic component:build
pnpm --filter @ac-components/ac-carousel-slide-basic component:preview
pnpm --filter @ac-components/ac-carousel-slide-basic component:build:styles
pnpm --filter @ac-components/ac-carousel-slide-basic component:build:styles:watch
```

> `src/carousel-slide-basic.styles.js` se genera a partir de `src/carousel-slide-basic.styles.scss` antes de `component:serve`, `component:build` y `component:test`. Durante `component:serve`, Vite recarga el demo al guardar cambios de estilos.
