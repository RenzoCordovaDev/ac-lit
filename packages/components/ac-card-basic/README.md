# `@ac-components/ac-card-basic`

Contenedor de contenido genérico (superficie con padding, borde/elevación según `ambient`) para agrupar contenido dentro de una pantalla. Es puramente estructural/presentacional — sin eventos, sin estado abierto/cerrado.

## Instalación

```bash
pnpm add @ac-components/ac-card-basic
```

```js
import '@ac-components/ac-card-basic';
```

```html
<ac-card-basic header-text="Resumen de la cuenta">
  <p>El saldo disponible es de $1,250.00.</p>
  <button slot="footer">Ver detalle</button>
</ac-card-basic>
```

## Propiedades

| Propiedad    | Atributo      | Tipo   | Default     | Descripción                                                                                                                                       |
| ------------ | ------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `headerText` | `header-text` | String | `''`        | Título opcional. Pasa por `this.t()` (acepta clave de `locales.json` o literal). Sin esta propiedad, no se renderiza ningún header.               |
| `ambient`    | `ambient`     | String | `'surface'` | **Lista blanca**: `'surface'` (fondo sólido + elevación) o `'outlined'` (fondo transparente, solo borde). Cualquier otro valor cae a `'surface'`. |

## Slots

| Slot      | Descripción                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| (default) | Cuerpo del contenido.                                                                                             |
| `footer`  | Acciones/botones opcionales. Si no se le asigna contenido, el contenedor del pie ni se muestra (sin hueco vacío). |

Sin eventos — es un contenedor puramente estructural.

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-card-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/card-basic.styles.js` se genera a partir de `src/card-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
