# `@ac-components/ac-toast-basic`

Notificación temporal (toast). Se dibuja en la **capa superior** del navegador (`popover`), así que queda por encima de cualquier contenido sin depender de `z-index`. Se cierra sola tras un tiempo (se pausa si el puntero está encima o el foco dentro), admite una acción opcional y varios toasts en la misma posición se apilan sin taparse.

## Instalación

```bash
pnpm add @ac-components/ac-toast-basic
```

```js
import '@ac-components/ac-toast-basic';
```

```html
<ac-toast-basic id="guardado" ambient="success" message="Cambios guardados"></ac-toast-basic>

<script type="module">
  document.getElementById('guardado').show();
</script>
```

```html
<!-- Con acción, sin cierre automático y arriba -->
<ac-toast-basic
  duration="0"
  position="top"
  message="Archivo eliminado"
  action-text="Deshacer"
></ac-toast-basic>
```

## Propiedades

| Propiedad    | Atributo      | Tipo    | Default     | Descripción                                                                                                                                        |
| ------------ | ------------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`       | `open`        | Boolean | `false`     | Toast visible (reflejado como atributo). Al pasar a `false` se anima la salida y luego se oculta.                                                  |
| `message`    | `message`     | String  | `''`        | Mensaje (pasa por `this.t()`: una clave de `locales.json` se traduce, cualquier otro texto se muestra tal cual). Sin `message` se usa el `<slot>`. |
| `duration`   | `duration`    | Number  | `4000`      | Milisegundos hasta el cierre automático. `0` = no se cierra solo.                                                                                  |
| `position`   | `position`    | String  | `'bottom'`  | `bottom` o `top`. Cualquier otro valor cae a `bottom`.                                                                                             |
| `ambient`    | `ambient`     | String  | `'neutral'` | `neutral`, `success`, `warning` o `danger` (fondos sólidos con texto fijo, igual que `ac-badge-basic`). Otro valor cae a `neutral`.                |
| `hideClose`  | `hide-close`  | Boolean | `false`     | Oculta el botón de cerrar.                                                                                                                         |
| `actionText` | `action-text` | String  | `''`        | Texto del botón de acción (pasa por `this.t()`). Sin texto, no se muestra.                                                                         |

Métodos: `show()` lo muestra y `hide()` lo cierra (con animación).

La acción **no** cierra el toast por sí sola: dispara su evento y decides tú (por ejemplo, deshacer y llamar a `hide()`).

## Eventos

Todos `bubbles` y `composed`.

| Evento                        | Cuándo                                                                     | `detail`                                           |
| ----------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| `ac-toast-basic-show`         | El toast se muestra (no se dispara por el estado inicial `open` del HTML). | `true`                                             |
| `ac-toast-basic-close`        | El toast empieza a cerrarse.                                               | `{ reason: 'timeout' \| 'close-button' \| 'api' }` |
| `ac-toast-basic-close-click`  | Click en el botón de cerrar.                                               | `true`                                             |
| `ac-toast-basic-action-click` | Click en el botón de acción.                                               | `true`                                             |

## Slots

| Slot        | Descripción                                       |
| ----------- | ------------------------------------------------- |
| _(default)_ | Contenido del mensaje cuando no se usa `message`. |

## Parts y CSS

| Part      | Descripción                |
| --------- | -------------------------- |
| `root`    | El contenedor (`popover`). |
| `message` | El mensaje.                |
| `action`  | El botón de acción.        |
| `close`   | El botón de cerrar.        |

Variable CSS: `--ac-toast-basic-max-width` (ancho máximo, por defecto `32rem`).

## Apilado

Cada instancia vive en su propio shadow root, así que el navegador no sabe qué otros toasts hay abiertos. Un registro en memoria por posición (el mismo patrón que `ac-radio-basic`, ver `docs/CONVENTIONS.md`) recuerda el orden de apertura y desplaza a cada toast según la altura de los anteriores; si uno se cierra, los siguientes se reacomodan. `top` y `bottom` apilan por separado.

## Accesibilidad

- El mensaje se anuncia desde una **región viva siempre presente** (`role="status"`, o `role="alert"` para `danger`); un elemento que aparece ya con su texto no se anuncia de forma fiable. El texto visible está `aria-hidden` para no leerse dos veces.
- El cierre automático se **pausa** mientras el puntero está encima o el foco dentro del toast (WCAG 2.2.1: el usuario necesita tiempo para leer y actuar). Usa `duration="0"` para mensajes que requieren acción.
- Los botones son accesibles por teclado y los colores de fondo y texto son fijos (no cambian entre temas) con contraste calculado por variante.
- La animación se desactiva con `prefers-reduced-motion`.

## i18n

`locales.json` incluye `toast-basic-close`, `toast-basic-saved` y `toast-basic-undo` (`es-PE`, `en-EN`, `pt-BR`).

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-toast-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/toast-basic.styles.js` se genera a partir de `src/toast-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
