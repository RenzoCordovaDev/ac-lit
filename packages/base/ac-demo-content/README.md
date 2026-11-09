# @ac-base/ac-demo-content

Contenedor centralizado para las demos de los componentes de `ac-lit`. En vez de que cada componente reimplemente su propio selector de caso/idioma/tema/tamaño/panel de eventos a mano (como hicieron `ac-button-basic`, `ac-link-basic`, etc.), todas las demos usan este contenedor — así, cuando la demo evoluciona, se cambia en un solo lugar.

## Uso

```html
<ac-demo-content
  name="ac-mi-componente"
  tech="Lit v3"
  package-name="@ac-components/ac-mi-componente"
  docs-href="https://github.com/RenzoCordovaDev/ac-lit/blob/main/packages/components/ac-mi-componente/README.md"
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

| Atributo       | Tipo                  | Descripción                                                                                                                                                                                                                                                                                                         |
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`         | string                | Nombre del componente, mostrado como título (sin `<>`) — reemplaza el `<h1>` manual que antes vivía en `demo/index.html`.                                                                                                                                                                                           |
| `tech`         | string                | Tecnología base, mostrada como badge junto al nombre (ej. `"Lit v3"`).                                                                                                                                                                                                                                              |
| `package-name` | string                | Nombre del paquete npm — muestra los snippets `pnpm add`/`npm i`; al hacer click en cualquiera, se copia al portapapeles.                                                                                                                                                                                           |
| `docs-href`    | string (URL)          | Link "Documentación" — debe ser una URL completa (ej. al `README.md` del componente en GitHub), no una ruta local: el dev server de Vite no sirve archivos fuera de `demo/`.                                                                                                                                        |
| `language`     | string, coma-separado | **Exactamente 2 locales** (ej. `"es-PE, en-EN"`) — el framework solo ofrece español o inglés. Se renderiza como control segmentado ES/EN (no un select, no un switch deslizante). Con 0, 1 o 3+ valores no se renderiza nada. Usa `setGlobalLocale` — cero wiring extra.                                            |
| `ambients`     | string, coma-separado | Valores de `ambient` a ofrecer. Al cambiar, setea `.ambient` en los elementos del caso activo que tengan esa propiedad.                                                                                                                                                                                             |
| `events`       | string, coma-separado | Nombres de eventos a escuchar en `document`. Si hay al menos uno, se muestra un ícono de campana con contador — al hacer click abre un **panel lateral** (pegado al borde derecho) con la configuración (qué eventos escucha) y cada evento disparado, con sus campos etiquetados (`Evento:`, `Hora:`, `Payload:`). |
| `dark-mode`    | boolean               | Muestra el switch de tema (2 iconos: sol/luna, dentro de un control segmentado). El demo arranca en **modo claro** por defecto; togglea `data-theme` en `<html>` — requiere que el host importe la paleta `light` de `@ac-base/ac-core` además de la oscura.                                                        |

Siempre presentes, sin atributo que los active:

- **Switcher de caso** — `<select>` con estilo moderno (en Chromium también se estiliza la lista desplegable vía `appearance: base-select`; en otros navegadores queda el `<select>` nativo), muestra solo el `header` de cada `<ac-demo-case>`. Va **solo en la primera fila** del toolbar, a todo el ancho, porque los `header` pueden ser largos (hacen wrap, no se truncan); el resto de controles van en una segunda fila. Se muestra incluso con un solo caso.
- **Switcher de tamaño de dispositivo** — 3 presets fijos con ancho **y alto** fijos: Móvil (375×667, por defecto), Tablet (768×1024) y Desktop (1280×800). Cada uno envuelve el `<slot>` en un marco visual (`.ac-demo-content__device-frame`) que simula el bisel del dispositivo. El alto es fijo a propósito — si el contenido no entra, **scrollea adentro del viewport simulado** en vez de estirar el marco, para que la demo se vea como el dispositivo real se vería. El marco usa `max-width`: para que Desktop alcance sus 1280 px, el contenedor de la página (`.demo-root` en `demo/demo-base.css`, `max-width: 1440px`) tiene que ser lo bastante ancho; en pantallas más angostas el marco se encoge.
- **Switch Visual/Código** — "Visual" (por defecto) renderiza el caso activo de verdad, dentro del marco de dispositivo. "Código" muestra el HTML fuente de ese caso (`ac-demo-case.source`, el contenido crudo de su `href`) con aspecto de **editor de código**: barra de título con el nombre del archivo, líneas numeradas y resaltado de sintaxis HTML, sin marco de dispositivo. La paleta del editor es fija (oscura en ambos temas).
- **Snippets de instalación copiables** — con `package-name`, cada comando (`pnpm add …`, `npm i …`) es un botón: al hacer click se copia al portapapeles, el botón muestra un check unos instantes y se anuncia "Copiado al portapapeles" a lectores de pantalla.

## Eventos

| Evento                 | Cuándo                                     | `detail`           |
| ---------------------- | ------------------------------------------ | ------------------ |
| `ac-demo-content-copy` | El usuario copió un comando de instalación | `{ text: string }` |

Es `bubbles` y `composed`. Solo se dispara si el copiado tuvo éxito.

Todos los controles de 2+ opciones (idioma, tema, tamaño de dispositivo, vista) comparten el mismo patrón visual: un contenedor con borde redondeado, opciones separadas por un divisor vertical, y la opción activa resaltada — nunca un switch deslizante ni texto plano de estado ("Modo claro"/"Modo oscuro").

## `<ac-demo-case>`

| Atributo      | Descripción                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `header`      | Texto mostrado en el switcher de casos.                                                                          |
| `descripcion` | Descripción corta del caso (no se renderiza todavía — reservado para un tooltip/subtítulo futuro).               |
| `href`        | Ruta al archivo HTML con el contenido del caso. Se carga (fetch) la primera vez que el caso se activa, no antes. |

Deliberadamente **no usa Shadow DOM**: el HTML de `href` participa del CSS global de la página (clases como `.row` de `demo-base.css`), y evita tener que atravesar dos shadow roots anidados para que `ac-demo-content` pueda manipular los componentes reales de adentro (ej. cambiar su `ambient`). El contenido de `href` se asume de confianza — lo escribe quien desarrolla el componente, igual que el propio `demo/index.html` — no se sanitiza.

`.source` expone el HTML crudo ya cargado (string) — lo usa el switch Visual/Código de `ac-demo-content` para mostrar el HTML fuente del caso activo.

## `ambient`: requiere que el componente lo use de verdad

`ambients` solo tiene efecto visual si el componente dentro del caso activo **usa realmente** la propiedad `ambient` (heredada de `@ac-base/ac-component-mixin`) en su styling — no basta con que la tenga disponible sin usarla. Ver `docs/CONVENTIONS.md`.

## Desarrollo

```bash
pnpm --filter @ac-base/ac-demo-content component:serve    # demo en http://localhost:5173 (usa un botón de prueba propio, ver demo/sample-button.js)
pnpm --filter @ac-base/ac-demo-content component:test
pnpm --filter @ac-base/ac-demo-content component:build
pnpm --filter @ac-base/ac-demo-content component:test:e2e
pnpm --filter @ac-base/ac-demo-content component:test:e2e:a11y
```

> `src/demo-content.styles.js` se genera a partir de `src/demo-content.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
