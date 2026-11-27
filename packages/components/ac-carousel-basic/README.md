# @ac-components/ac-carousel-basic

Carrusel de diapositivas con navegación mediante flechas, paginación, teclado y gestos táctiles, y reproducción automática opcional.

## Instalación

```bash
pnpm add @ac-components/ac-carousel-basic
```

```js
import '@ac-components/ac-carousel-basic';
```

```html
<ac-carousel-basic active-index="1">
  <ac-carousel-slide-basic>Centro histórico de Cusco</ac-carousel-slide-basic>
  <ac-carousel-slide-basic>Valle Sagrado</ac-carousel-slide-basic>
  <ac-carousel-slide-basic>Machupicchu</ac-carousel-slide-basic>
</ac-carousel-basic>
```

La importación registra tanto el carrusel como `ac-carousel-slide-basic`.

## Propiedades

| Propiedad     | Atributo       | Tipo   | Default     | Descripción                                                                                                                      |
| ------------- | -------------- | ------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `activeIndex` | `active-index` | Number | `0`         | Índice de la diapositiva activa, desde cero. Se refleja como atributo y, cuando hay diapositivas, se ajusta al rango disponible. |
| `autoplay`    | `autoplay`     | Number | `0`         | Intervalo en milisegundos entre avances automáticos. Con `0`, la reproducción automática está desactivada.                       |
| `ambient`     | `ambient`      | String | `'primary'` | `primary` o `secondary`. Define el color de los controles. Heredada de `ComponentMixin`.                                         |

Las flechas anterior y siguiente vuelven al otro extremo al llegar al inicio o al final. Usa `←` y `→` con el foco dentro del carrusel, o desliza horizontalmente sobre la diapositiva en una pantalla táctil. Cada punto permite ir a una diapositiva y el punto activo lleva `aria-current`.

Cuando `autoplay` está habilitado, el botón de reproducción permite pausarla y reanudarla. La reproducción también se pausa temporalmente mientras el puntero esté encima o el foco esté dentro del carrusel.

## Eventos

| Evento                     | Cuándo                                                                                         | `detail`            |
| -------------------------- | ---------------------------------------------------------------------------------------------- | ------------------- |
| `ac-carousel-basic-change` | Las flechas, los puntos, el teclado, un gesto táctil o la reproducción cambian la diapositiva. | `{ index: number }` |

El evento tiene `bubbles: true` y `composed: true`. La selección inicial, las asignaciones de `activeIndex` o `active-index` desde código y la selección del punto que ya está activo son silenciosas.

## Slots

El slot por defecto recibe elementos `<ac-carousel-slide-basic>` como hijos directos. El carrusel sincroniza las propiedades `active`, `index` y `total` de cada diapositiva al seleccionar otra o al agregar, quitar o reordenar hijos. El contenido de cada diapositiva puede incluir texto, imágenes o controles.

## Theming

`primary` usa el acento esmeralda y `secondary` el ámbar. Para personalizar la presentación, usa los CSS parts `root`, `viewport`, `controls`, `previous`, `next`, `pagination`, `dot` y `rotation`.

```js
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

Activa el tema claro con `data-theme="light"` en el documento.

## i18n

`locales.json` define el nombre accesible de la región y las etiquetas de las flechas, los puntos y el control de reproducción en `es-PE`, `en-EN` y `pt-BR`. El nombre accesible de cada diapositiva se genera en `ac-carousel-slide-basic` a partir de su posición y el total.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-carousel-slide-basic component:build:styles
pnpm --filter @ac-components/ac-carousel-basic component:lint
pnpm --filter @ac-components/ac-carousel-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-carousel-basic component:test
pnpm --filter @ac-components/ac-carousel-basic component:build
pnpm --filter @ac-components/ac-carousel-basic component:preview
pnpm --filter @ac-components/ac-carousel-basic component:build:styles
pnpm --filter @ac-components/ac-carousel-basic component:build:styles:watch
```

> En un checkout nuevo, ejecuta primero el comando de estilos de `ac-carousel-slide-basic` para generar los estilos del paquete hijo. `src/carousel-basic.styles.js` se genera a partir de `src/carousel-basic.styles.scss` con `component:build:styles`, que se ejecuta automáticamente al usar `component:serve`, `component:build` o `component:test`. Durante `component:serve`, Vite recarga la demo al recompilar los estilos del carrusel.
