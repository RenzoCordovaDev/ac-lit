# `@ac-components/ac-tooltip-basic`

Envuelve un elemento "trigger" (pasado por el slot por defecto) y muestra un globo de texto al hacer hover o foco sobre ese trigger.

## Instalación

```bash
pnpm add @ac-components/ac-tooltip-basic
```

```js
import '@ac-components/ac-tooltip-basic';
```

```html
<ac-tooltip-basic text="Guardar los cambios" position="top">
  <button>Guardar</button>
</ac-tooltip-basic>
```

## Propiedades

| Propiedad  | Atributo   | Tipo              | Default | Descripción                                                                                                                     |
| ---------- | ---------- | ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `text`     | `text`     | String            | `''`    | Contenido del globo — pasa por `this.t()` (texto literal o clave de traducción, igual criterio que `text` en `ac-badge-basic`). |
| `position` | `position` | String            | `'top'` | `'top'` \| `'bottom'` \| `'left'` \| `'right'`, whitelist con fallback a `'top'`.                                               |
| `disabled` | `disabled` | Boolean (reflect) | `false` | Si es `true`, el globo nunca se muestra — el trigger sigue funcionando normal, solo no hay tooltip.                             |

## Slots

| Slot        | Descripción                                                          |
| ----------- | -------------------------------------------------------------------- |
| _(default)_ | El elemento trigger (botón, ícono, o cualquier cosa enfocable o no). |

## Comportamiento

- El globo se muestra en `mouseenter`/`focusin` del elemento asignado al slot por defecto (no de cualquier parte del host) y se oculta en `mouseleave`/`focusout`, o al presionar `Escape` mientras está visible.
- Si el slot cambia de contenido (`slotchange`), el componente vuelve a enganchar los listeners sobre los elementos nuevos y limpia los de los anteriores.
- Sin eventos propios — no emite nada custom.

## Accesibilidad

- El globo tiene `role="tooltip"` y un `id` único por instancia (generado en el constructor con un contador de módulo).
- Cada elemento asignado al slot recibe `aria-describedby` apuntando a ese `id`. El globo existe siempre en el DOM (solo oculto por CSS — `visibility`/`opacity`, nunca `display: none`), así que `aria-describedby` queda seteado todo el tiempo, apunte o no a contenido visible en ese momento — misma convención que `aria-describedby` para hint/error en `ac-input-basic`/`ac-select-basic`.

## Límite conocido: recorte por `overflow: hidden` de un ancestro

A diferencia de `ac-modal-basic`/`ac-toast-basic`/`ac-transition-container` (que usan `<dialog>`/`popover` — capa superior nativa que se escapa de cualquier `overflow` ancestro), `ac-tooltip-basic` es un `position: absolute` normal dentro del propio stacking context del host. Esto es intencional (no hace falta una capa superior para un globo de texto chico), pero tiene una consecuencia: si un ancestro en el árbol real (no el shadow DOM del propio componente, cualquier contenedor de la página que lo use) tiene `overflow: hidden` (o `auto`/`scroll`) y el globo queda posicionado fuera de ese límite, el navegador lo recorta visualmente — el globo puede verse cortado o no verse en absoluto, aunque `_visible` sea `true` y el DOM esté correcto.

Es una limitación conocida y aceptada para esta primera versión: no se resuelve con JS de posicionamiento avanzado (medir el ancestro, reposicionar dinámicamente, flotar fuera del flujo normal, etc.) — si el caso de uso lo requiere, hay que evitar poner el trigger dentro de un contenedor con `overflow` recortado, o esperar una versión futura que lo resuelva explícitamente.

## Theming

Fondo sólido con texto fijo — mismo criterio que `ac-badge-basic`/`ac-toast-basic` (no cambia entre temas, ver "Dark-mode y colores de fondo sólido" en `docs/CONVENTIONS.md`):

```js
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
```

## Parts y CSS

| Part     | Descripción        |
| -------- | ------------------ |
| `bubble` | El globo de texto. |

## i18n

`locales.json` parte vacío (`es-PE`/`en-EN`/`pt-BR`) — `text` no tiene ningún default propio, el consumidor siempre lo define, así que no hay ninguna clave propia del componente que traducir.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-tooltip-basic component:lint
pnpm --filter @ac-components/ac-tooltip-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-tooltip-basic component:test
pnpm --filter @ac-components/ac-tooltip-basic component:build
pnpm --filter @ac-components/ac-tooltip-basic component:test:e2e        # funcional (WebdriverIO + Cucumber)
pnpm --filter @ac-components/ac-tooltip-basic component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/tooltip-basic.styles.js` se genera a partir de `src/tooltip-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
