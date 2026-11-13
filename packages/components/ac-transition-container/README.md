# `@ac-components/ac-transition-container`

Contenedor de pantalla completa construido sobre `<dialog>` nativo (foco atrapado, `Escape`, capa superior y fondo inerte sin trabajo extra), pensado para navegación tipo "entrar a una sub-pantalla" (ej. un sub-menú de ajustes) — no como un diálogo de confirmación. Entra deslizando de derecha a izquierda hasta cubrir toda la pantalla y sale deslizando de vuelta hacia la derecha. Tiene cabecera con título, flecha de volver e ícono de menú (hamburguesa) — ambos íconos son visibles por defecto, como característica propia del componente, y cada uno se puede ocultar individualmente.

## Instalación

```bash
pnpm add @ac-components/ac-transition-container
```

```js
import '@ac-components/ac-transition-container';
```

```html
<ac-transition-container
  id="security-settings-emergency-zone-pe-transition-main-menu"
  ?visible="${this._isVisibleMainMenu}"
  header-text="security-settings-emergency-zone-pe-title-header"
  header-type="first-level-sequential"
  @transition-container-header-back-icon-click="${this._handleBackClick}"
>
  <div>contenido</div>
</ac-transition-container>

<script type="module">
  const container = document.getElementById(
    'security-settings-emergency-zone-pe-transition-main-menu',
  );
  container.show(); // o: container.visible = true

  container.addEventListener('ac-transition-container-header-back-icon-click', () => {
    // la decisión de cerrar (o navegar a otra pantalla) es tuya
    container.hide();
  });
</script>
```

> La flecha de volver y el ícono de menú son siempre visibles por defecto (`hideBackIcon`/`hideMenuIcon` para ocultarlos individualmente); `header-type` no afecta su visibilidad.

## Propiedades

| Propiedad      | Atributo         | Tipo     | Default                 | Descripción                                                                                                                                                                                                                                                                                 |
| -------------- | ---------------- | -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `visible`      | `visible`        | Boolean  | `false`                 | Contenedor visible (reflejado como atributo). Al pasar a `false` se anima la salida y luego se cierra el `<dialog>`.                                                                                                                                                                        |
| `headerText`   | `header-text`    | String   | `''`                    | Título. Pasa por `this.t()`, así que acepta tanto una clave de `locales.json` como un literal. Sin `header-text` se muestra un título por defecto traducido (`transition-container-title`).                                                                                                 |
| `headerType`   | `header-type`    | String   | `'first-level-initial'` | **Lista blanca**: `'first-level-initial'` o `'first-level-sequential'` (cualquier otro valor cae a `'first-level-initial'`). Reservada para uso futuro — **no** controla la flecha de volver ni el ícono de menú, que son siempre visibles por defecto (ver `hideBackIcon`/`hideMenuIcon`). |
| `hideBackIcon` | `hide-back-icon` | Boolean  | `false`                 | Oculta la flecha de volver del lado izquierdo de la cabecera (ej. en la pantalla "raíz" de una navegación, que no tiene a dónde volver).                                                                                                                                                    |
| `hideMenuIcon` | `hide-menu-icon` | Boolean  | `false`                 | Oculta el ícono de menú (hamburguesa) del lado derecho de la cabecera.                                                                                                                                                                                                                      |
| `persistent`   | `persistent`     | Boolean  | `false`                 | Si es `false`, `Escape` cierra el contenedor. Si es `true`, `Escape` no hace nada — solo se cierra con la flecha de volver (si la demo la cablea) o desde el código.                                                                                                                        |
| `contained`    | `contained`      | Boolean  | `false`                 | En vez del viewport real, se dibuja sobre el área que mide `getBoundary()` — pensado para que `ac-demo-content` lo simule dentro del marco de dispositivo.                                                                                                                                  |
| `ambient`      | `ambient`        | String   | `'primary'`             | Heredado de `ComponentMixin`.                                                                                                                                                                                                                                                               |
| `getBoundary`  | —                | Function | `null`                  | Función que **devuelve el elemento** a medir cuando `contained` está activo (nunca un rect cacheado).                                                                                                                                                                                       |

Métodos: `show()` abre y `hide()` cierra (con animación).

Este componente **no implementa click en backdrop**: el panel ocupa el 100% del `<dialog>` (pantalla completa), así que nunca hay un click "fuera" distinguible del propio contenido.

## Slots

| Slot         | Descripción                                                                                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _(default)_  | Contenido del cuerpo. Hace scroll propio si no entra; la cabecera queda fija.                                                                                                                               |
| `header-end` | Lado derecho de la cabecera, **antes** del ícono de menú (ej. para agregar un ícono de ayuda propio). El menú (hamburguesa) ya lo implementa el componente — ver `hideMenuIcon` más abajo si no hace falta. |

## Eventos

Todos `bubbles` y `composed`.

| Evento                                           | Cuándo                                                                                               | `detail`                                    |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `ac-transition-container-open`                   | El contenedor se vuelve visible (no se dispara por el estado inicial `visible` del HTML).            | `true`                                      |
| `ac-transition-container-close`                  | El contenedor empieza a cerrarse.                                                                    | `{ reason: 'escape' \| 'api' \| 'native' }` |
| `ac-transition-container-header-back-icon-click` | Click en la flecha de volver de la cabecera (visible por defecto salvo `hide-back-icon`).            | `true`                                      |
| `ac-transition-container-header-menu-icon-click` | Click en el ícono de menú (hamburguesa) de la cabecera (visible por defecto salvo `hide-menu-icon`). | `true`                                      |

Ni la flecha de volver ni el ícono de menú cierran el contenedor por sí solos — disparan su evento y quien lo consume decide (cerrar con `hide()`, abrir un menú lateral, navegar a otra pantalla, etc.), igual que los botones del pie de `ac-modal-basic` no lo cierran por sí solos.

## Parts y CSS

| Part     | Descripción                               |
| -------- | ----------------------------------------- |
| `dialog` | El `<dialog>` nativo.                     |
| `header` | La cabecera.                              |
| `title`  | El título (`<h2>`).                       |
| `back`   | El botón de la flecha de volver.          |
| `menu`   | El botón del ícono de menú (hamburguesa). |
| `body`   | El cuerpo con el `<slot>` por defecto.    |

## Animación

Entrada (`slide-in`, 300 ms, de derecha a izquierda) y salida (`slide-out`, 240 ms, de izquierda a derecha) con `@keyframes`, más fundido del fondo. El componente espera a `animationend` para cerrar el `<dialog>` (con un tope de 600 ms por si el evento no llega). Con `prefers-reduced-motion: reduce` no hay animación y el cierre es inmediato. Si se reabre durante la salida, la salida se cancela.

## Accesibilidad

- `<dialog>` modal: el resto de la página queda inerte, `Escape` cierra (salvo `persistent`), y el foco vuelve al elemento que lo abrió.
- El `<dialog>` se nombra con su título (`aria-labelledby`) y el cuerpo es una `region` enfocable (puede hacer scroll).
- Los botones de la flecha de volver y del menú (visibles por defecto) llevan `aria-label` traducido (`transition-container-back`/`transition-container-menu`); los SVG son `aria-hidden`.
- Foco y bordes cumplen contraste en ambos temas (claro/oscuro).

## i18n

`locales.json` incluye `transition-container-title`, `transition-container-back` y `transition-container-menu` (`es-PE`, `en-EN`, `pt-BR`).

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-transition-container component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/transition-container.styles.js` se genera a partir de `src/transition-container.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
