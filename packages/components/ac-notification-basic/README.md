# `@ac-components/ac-notification-basic`

Ítem de una lista/feed de notificaciones: ícono (según el tipo) + mensaje + botón de cerrar, con color semántico. A diferencia de `ac-toast-basic` (notificación flotante, transitoria, se cierra sola) este componente es contenido persistente y visible desde que se monta, pensado para mostrar varias instancias apiladas a la vez — igual que un correo o una notificación del sistema que se queda en una bandeja hasta que alguien la cierra.

**El componente nunca se cierra ni se remueve a sí mismo.** El botón de cerrar solo emite un evento — quien lo consume decide (por ejemplo, sacándolo del array que arma la lista, o quitando el nodo del DOM como hace la demo de este paquete).

## Instalación

```bash
pnpm add @ac-components/ac-notification-basic
```

```js
import '@ac-components/ac-notification-basic';
```

```html
<ac-notification-basic ambient="success" message="Cambios guardados"></ac-notification-basic>

<script type="module">
  document
    .querySelector('ac-notification-basic')
    .addEventListener('ac-notification-basic-dismiss-click', event => event.target.remove());
</script>
```

## Propiedades

| Propiedad | Atributo  | Tipo   | Default     | Descripción                                                                                                                          |
| --------- | --------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `message` | `message` | String | `''`        | Mensaje (pasa por `this.t()`: una clave de `locales.json` se traduce, cualquier otro texto se muestra tal cual).                     |
| `ambient` | `ambient` | String | `'neutral'` | `neutral` / `success` / `warning` / `danger` — cualquier otro valor cae a `neutral`. Controla el color de fondo y el ícono mostrado. |

Heredadas de `ComponentMixin`: `mode`, `loading`, `loadingA11yLabel`, `mediaRangeConfig` (sin uso particular en este componente más allá del comportamiento por defecto del mixin).

## Eventos

Todos `bubbles` y `composed`.

| Evento                                | Cuándo se dispara            | `detail` |
| ------------------------------------- | ---------------------------- | -------- |
| `ac-notification-basic-dismiss-click` | Click en el botón de cerrar. | `true`   |

## Accesibilidad

El ícono de cada `ambient` es decorativo (`aria-hidden="true"`) — el color por sí solo nunca es la única señal de significado: el mensaje de texto siempre está presente. No lleva `role="status"`/`role="alert"` ni región viva: a diferencia de un toast transitorio, este componente es contenido persistente, visible desde que se monta, como cualquier otro texto de la página — no necesita anunciarse a sí mismo.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-notification-basic run component:lint   # lint
pnpm --filter @ac-components/ac-notification-basic run component:serve   # demo en http://localhost:5173
pnpm --filter @ac-components/ac-notification-basic run component:test   # unit
```
