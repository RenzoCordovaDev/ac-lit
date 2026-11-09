# `@ac-components/ac-modal-basic`

Modal accesible construido sobre `<dialog>` nativo (foco atrapado, `Escape`, capa superior y fondo inerte sin trabajo extra). Entra desde abajo hacia arriba y sale de arriba hacia abajo. Tiene cabecera con título y botón de cerrar, cuerpo con `<slot>` y un pie opcional con hasta 2 botones y 1 enlace configurados por propiedades (reutiliza `ac-button-basic` y `ac-link-basic`).

## Instalación

```bash
pnpm add @ac-components/ac-modal-basic
```

```js
import '@ac-components/ac-modal-basic';
```

```html
<ac-modal-basic
  id="confirmar"
  header="Confirmar acción"
  size="half"
  primary-text="Aceptar"
  secondary-text="Cancelar"
  link-text="Saber más"
  link-href="/condiciones"
>
  <p>Cualquier contenido: texto, formularios u otros componentes.</p>
</ac-modal-basic>

<script type="module">
  const modal = document.getElementById('confirmar');
  modal.show(); // o: modal.open = true

  modal.addEventListener('ac-modal-basic-primary-click', () => {
    // ...hacer algo y cerrar
    modal.hide();
  });
</script>
```

## Propiedades

| Propiedad           | Atributo             | Tipo    | Default     | Descripción                                                                                                            |
| ------------------- | -------------------- | ------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| `open`              | `open`               | Boolean | `false`     | Modal abierto (reflejado como atributo). Al pasar a `false` se anima la salida y luego se cierra el `<dialog>`.        |
| `header`            | `header`             | String  | `''`        | Título. Pasa por `this.t()`. Sin `header` se muestra un título por defecto traducido (`modal-basic-title`).            |
| `size`              | `size`               | String  | `'offset'`  | `offset` deja un hueco arriba (por defecto), `half` ocupa hasta la mitad de la pantalla y `full` cubre toda la altura. |
| `persistent`        | `persistent`         | Boolean | `false`     | No se cierra con `Escape` ni al pulsar fuera; solo con su botón de cerrar o desde el código.                           |
| `hideClose`         | `hide-close`         | Boolean | `false`     | Oculta el botón de cerrar de la cabecera.                                                                              |
| `primaryText`       | `primary-text`       | String  | `''`        | Texto del botón principal (pasa por `this.t()`). Sin texto, el botón no se muestra.                                    |
| `primaryDisabled`   | `primary-disabled`   | Boolean | `false`     | Deshabilita el botón principal.                                                                                        |
| `secondaryText`     | `secondary-text`     | String  | `''`        | Texto del botón secundario.                                                                                            |
| `secondaryDisabled` | `secondary-disabled` | Boolean | `false`     | Deshabilita el botón secundario.                                                                                       |
| `linkText`          | `link-text`          | String  | `''`        | Texto del enlace del pie.                                                                                              |
| `linkHref`          | `link-href`          | String  | `''`        | Destino del enlace.                                                                                                    |
| `ambient`           | `ambient`            | String  | `'primary'` | Ambient del botón principal (`primary` o `secondary`). Heredado de `ComponentMixin`.                                   |

El pie solo se muestra si hay al menos un texto de botón o de enlace. Métodos: `show()` abre y `hide()` cierra (con animación).

Los botones **no** cierran el modal por sí solos: disparan su evento y tú decides (validar, enviar, cerrar con `hide()`).

### Tamaño y posición

Un `<dialog>` modal vive en la capa superior del navegador, así que `size` se mide contra la **pantalla** (viewport). Variables CSS:

| Variable                     | Default | Descripción                                   |
| ---------------------------- | ------- | --------------------------------------------- |
| `--ac-modal-basic-offset`    | `3rem`  | Hueco superior del tamaño `offset`.           |
| `--ac-modal-basic-max-width` | `48rem` | Ancho máximo de la hoja en `offset` y `half`. |

## Slots

| Slot        | Descripción                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| _(default)_ | Contenido del cuerpo. El cuerpo hace scroll si no entra; cabecera y pie quedan fijos. |

## Eventos

Todos `bubbles` y `composed`.

| Evento                           | Cuándo                                                                  | `detail`                                                                    |
| -------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `ac-modal-basic-open`            | El modal se abre (no se dispara por el estado inicial `open` del HTML). | `true`                                                                      |
| `ac-modal-basic-close`           | El modal empieza a cerrarse.                                            | `{ reason: 'close-button' \| 'escape' \| 'backdrop' \| 'api' \| 'native' }` |
| `ac-modal-basic-close-click`     | Click en el botón de cerrar de la cabecera.                             | `true`                                                                      |
| `ac-modal-basic-primary-click`   | Click en el botón principal.                                            | `true`                                                                      |
| `ac-modal-basic-secondary-click` | Click en el botón secundario.                                           | `true`                                                                      |
| `ac-modal-basic-link-click`      | Click en el enlace del pie.                                             | `{ href: string }`                                                          |

Los eventos internos de los botones y del enlace (`ac-button-basic-click`, `ac-link-basic-click`) no salen del modal: la API pública son los eventos de arriba.

## Parts y CSS

| Part        | Descripción                |
| ----------- | -------------------------- |
| `dialog`    | El `<dialog>` nativo.      |
| `header`    | La cabecera.               |
| `title`     | El título (`<h2>`).        |
| `close`     | El botón de cerrar.        |
| `body`      | El cuerpo con el `<slot>`. |
| `footer`    | El pie.                    |
| `primary`   | El botón principal.        |
| `secondary` | El botón secundario.       |
| `link`      | El enlace.                 |

## Animación

Entrada (`slide-up`, 300 ms) y salida (`slide-down`, 240 ms) con `@keyframes`, más fundido del fondo. El componente espera a `animationend` para cerrar el `<dialog>` (con un tope de 600 ms por si el evento no llega). Con `prefers-reduced-motion: reduce` no hay animación y el cierre es inmediato. Si se reabre durante la salida, la salida se cancela.

## Accesibilidad

- `<dialog>` modal: el resto de la página queda inerte, `Escape` cierra, y el foco vuelve al elemento que lo abrió.
- El `<dialog>` se nombra con su título (`aria-labelledby`) y el cuerpo es una `region` enfocable (puede hacer scroll).
- Foco y bordes cumplen contraste en ambos temas (claro/oscuro).

## i18n

`locales.json` incluye `modal-basic-title`, `modal-basic-close`, `modal-basic-accept`, `modal-basic-cancel` y `modal-basic-learn-more` (`es-PE`, `en-EN`, `pt-BR`).

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-modal-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/modal-basic.styles.js` se genera a partir de `src/modal-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
