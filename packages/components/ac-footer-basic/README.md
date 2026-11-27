# @ac-components/ac-footer-basic

Pie de página nativo con columnas adaptables y una franja inferior opcional para información legal.

## Instalación

```bash
pnpm add @ac-components/ac-footer-basic
```

```js
import '@ac-components/ac-footer-basic';
```

```html
<ac-footer-basic>
  <div>
    <h2>Recursos</h2>
    <ul>
      <li><a href="/guias">Guías</a></li>
      <li><a href="/ejemplos">Ejemplos</a></li>
    </ul>
  </div>
  <div>
    <h2>Soporte</h2>
    <ul>
      <li><a href="/contacto">Contacto</a></li>
    </ul>
  </div>
  <div slot="bottom">
    <small>© Mi sitio · <a href="/privacidad">Privacidad</a></small>
  </div>
</ac-footer-basic>
```

## Propiedades

| Propiedad | Atributo  | Tipo   | Default     | Descripción                                                                                                            |
| --------- | --------- | ------ | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| `ambient` | `ambient` | String | `'surface'` | `surface` (fondo neutro sólido) \| `plain` (fondo transparente). Heredada de `ComponentMixin` y reflejada al atributo. |

## Slots

| Slot     | Descripción                                                                                                                       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Default  | Contenido principal. Cada bloque hijo directo ocupa una columna. En anchos reducidos, las columnas se apilan en orden de lectura. |
| `bottom` | Franja opcional para copyright o enlaces legales. Un divisor sutil separa la franja del contenido principal.                      |

Coloca el componente después del contenido principal de la página para que el `<footer>` nativo actúe como landmark de información del sitio.

## Theming

`surface` usa el fondo fijo `--color-neutral` y un color de texto claro en ambos temas. En `plain`, el texto se adapta al tema activo sobre el fondo de la página. Los CSS parts `root`, `main` y `bottom` permiten personalizar el footer y sus dos zonas mediante `::part()`.

```js
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

Haz que los enlaces del ejemplo hereden el color de texto del footer en ambos ambientes.

```css
ac-footer-basic a {
  color: inherit;
}
```

## i18n

`locales.json` incluye `footer-basic-site-information` (`es-PE`, `en-EN`, `pt-BR`) para el nombre accesible del `<footer>`. La aplicación traduce el contenido que coloca en los slots.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-footer-basic component:lint
pnpm --filter @ac-components/ac-footer-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-footer-basic component:test
pnpm --filter @ac-components/ac-footer-basic component:build
pnpm --filter @ac-components/ac-footer-basic component:preview
pnpm --filter @ac-components/ac-footer-basic component:build:styles
pnpm --filter @ac-components/ac-footer-basic component:build:styles:watch
```

> `component:build:styles` genera el archivo ignorado por Git `src/footer-basic.styles.js` a partir de `src/footer-basic.styles.scss`. `component:serve`, `component:build` y `component:test` compilan los estilos automáticamente. Durante `component:serve`, el watcher recompila cada cambio de SCSS y Vite recarga la demo.
