# @ac-base/ac-demo-content

Contenedor centralizado para las demos de los componentes de `ac-lit`. En vez de que cada componente reimplemente su propio selector de caso/idioma/tema/tamaño/panel de eventos a mano (como hicieron `ac-button-basic`, `ac-link-basic`, etc.), todas las demos usan este contenedor — así, cuando la demo evoluciona, se cambia en un solo lugar.

## Uso

```html
<ac-demo-content
  language="es-PE, en-EN"
  ambients="primary, primary-alt, secondary, secondary-alt"
  events="ac-mi-componente-click"
  dark-mode
>
  <ac-demo-case header="Básico" descripcion="Uso por defecto" href="case-basic.html"></ac-demo-case>
  <ac-demo-case
    header="Estados"
    descripcion="Disabled/loading"
    href="case-states.html"
  ></ac-demo-case>
</ac-demo-content>
```

```js
import '@ac-base/ac-demo-content';
```

> **Los archivos `href` de cada `ac-demo-case` deben vivir en `demo/public/`**, no directo en `demo/` — Vite solo copia `public/` tal cual al build (`vite build`); cualquier otro archivo que no esté referenciado desde `index.html` se queda afuera de `dist/` y el `fetch()` en producción (`vite preview`) da 404.

## `<ac-demo-content>`

| Atributo    | Tipo                  | Descripción                                                                                                                                                                                                                                                  |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `language`  | string, coma-separado | **Exactamente 2 locales** (ej. `"es-PE, en-EN"`) — el framework solo ofrece español o inglés. Se renderiza como un switch ES/EN, no un select. Con 0, 1 o 3+ valores no se renderiza nada. Usa `setGlobalLocale` — cero wiring extra.                        |
| `ambients`  | string, coma-separado | Valores de `ambient` a ofrecer. Al cambiar, setea `.ambient` en los elementos del caso activo que tengan esa propiedad.                                                                                                                                      |
| `events`    | string, coma-separado | Nombres de eventos a escuchar en `document`. Si hay al menos uno, se muestra un ícono de campana en la toolbar — al hacer click abre un modal con cada evento disparado (nombre, hora, datos enviados) y la configuración (qué eventos se están escuchando). |
| `dark-mode` | boolean               | Muestra el toggle de tema. El demo arranca en **modo claro** por defecto; togglea `data-theme` en `<html>` — requiere que el host importe la paleta `light` de `@ac-base/ac-core` además de la oscura.                                                       |

El switcher de **tamaño de dispositivo** siempre está presente (no es configurable): 3 presets fijos — Móvil (375px, por defecto), Tablet (768px) y Desktop (1280px) — cada uno envuelve el `<slot>` en un marco visual (`.ac-demo-content__device-frame`) que simula el bisel del dispositivo correspondiente. Si hay más de un `<ac-demo-case>`, también se muestra el switcher de caso.

## `<ac-demo-case>`

| Atributo      | Descripción                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `header`      | Texto mostrado en el switcher de casos.                                                                          |
| `descripcion` | Descripción corta del caso (no se renderiza todavía — reservado para un tooltip/subtítulo futuro).               |
| `href`        | Ruta al archivo HTML con el contenido del caso. Se carga (fetch) la primera vez que el caso se activa, no antes. |

Deliberadamente **no usa Shadow DOM**: el HTML de `href` participa del CSS global de la página (clases como `.row` de `demo-base.css`), y evita tener que atravesar dos shadow roots anidados para que `ac-demo-content` pueda manipular los componentes reales de adentro (ej. cambiar su `ambient`). El contenido de `href` se asume de confianza — lo escribe quien desarrolla el componente, igual que el propio `demo/index.html` — no se sanitiza.

## `ambient`: requiere que el componente lo use de verdad

`ambients` solo tiene efecto visual si el componente dentro del caso activo **usa realmente** la propiedad `ambient` (heredada de `@ac-base/ac-component-mixin`) en su styling — no basta con que la tenga disponible sin usarla. Ver `docs/CONVENTIONS.md`.

## Desarrollo

```bash
pnpm --filter @ac-base/ac-demo-content dev    # demo en http://localhost:5173 (usa un botón de prueba propio, ver demo/sample-button.js)
pnpm --filter @ac-base/ac-demo-content test
pnpm --filter @ac-base/ac-demo-content build
pnpm --filter @ac-base/ac-demo-content test:e2e
pnpm --filter @ac-base/ac-demo-content test:e2e:a11y
```
