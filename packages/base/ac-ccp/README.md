# @ac-base/ac-ccp

Channel Communication Pattern (CCP) permite que páginas y componentes de una app construida con `ac-lit` se comuniquen por **canales nombrados**, sin conocerse entre sí. Es un pub/sub con dirección: un endpoint `out` publica y un endpoint `in` recibe, todo coordinado por una instancia de CCP en memoria.

## Instalación

```bash
pnpm add @ac-base/ac-ccp
```

`lit` es una **peer dependency** (`^3.0.0`): debe estar instalada en tu app.

## Conceptos

- **Canal.** Un endpoint se identifica por `name` (un string lógico, por ejemplo `'users.selected'`) y por `direction`: `'out'` publica y `'in'` se suscribe. Un canal `out` publica con `publish()`; un canal `in` recibe con `subscribe()`. Cada endpoint tiene una sola dirección: publicar desde un `in` o suscribirse desde un `out` lanza un error.
- **Coincidencia exacta.** Un mensaje llega solo a los endpoints `in` cuyo `name` coincide exactamente. No hay wildcards: `'users.*'` no coincide con `'users.selected'`.
- **Cardinalidad N:M.** Puede haber varios `out` y varios `in` con el mismo `name`. Cada mensaje se entrega a todos los `in` registrados en ese momento.
- **Retención y replay.** Un `out` con `retain: true` conserva su último mensaje publicado y se lo entrega a cualquier `in` que se suscriba después. Para no recibirlo, suscríbete con `{ replay: false }`. El mensaje retenido se guarda por `name`, no por endpoint.
- **Aislamiento de errores.** Si el callback de un suscriptor lanza un error (o rechaza una promesa), el error se descarta y los demás suscriptores reciben el mensaje igual.

## API

### `createCCP()`

Devuelve una instancia nueva e independiente de CCP (un `CCPManager`). Llámala una sola vez por aplicación y pasa esa instancia a los componentes que la necesiten. Nunca se comparte una instancia global entre aplicaciones distintas: cada app debe crear la suya.

```js
import { createCCP } from '@ac-base/ac-ccp';

export const ccp = createCCP();
```

### `ccp.register({ name, direction, retain, id })`

Registra un endpoint nuevo y devuelve un `Channel`.

| Parámetro   | Tipo            | Default  | Descripción                                       |
| ----------- | --------------- | -------- | ------------------------------------------------- |
| `name`      | `string`        | —        | Nombre lógico del canal. No puede estar vacío.    |
| `direction` | `'in' \| 'out'` | —        | Dirección del endpoint.                           |
| `retain`    | `boolean`       | `false`  | Si un `out` conserva su último mensaje.           |
| `id`        | `string`        | generado | Id personalizado. Debe ser único en la instancia. |

Lanza `invalid-name`, `duplicate-id` o `destroyed` (ver la tabla de errores más abajo).

#### `Channel`

Propiedades de solo lectura que describen el endpoint: `id`, `name`, `direction` y `retain`.

- **`publish(payload, metadata)`** — solo para canales `out`. Devuelve el mensaje publicado, un objeto inmutable con `id`, `channel`, `source`, `payload`, `timestamp` y `metadata`. El `payload` se entrega por referencia, sin clonarlo. Lanza `publish-on-in`, `endpoint-disconnected` o `destroyed`.
- **`subscribe(callback, { replay = true } = {})`** — solo para canales `in`. Devuelve una función que cancela esa suscripción puntual. Si hay un mensaje retenido y `replay` no es `false`, el callback se ejecuta de inmediato, dentro de la propia llamada a `subscribe()`. En ese caso, un error lanzado por el callback no se aísla y se propaga a quien llamó a `subscribe()`. Lanza `subscribe-on-out`, `endpoint-disconnected` o `destroyed`.
- **`disconnect()`** — quita las suscripciones del endpoint y lo elimina del registro. Es idempotente: llamarlo de nuevo no lanza error. Si la instancia de CCP ya fue destruida con `destroy()`, la primera llamada lanza `destroyed`.

### Otros métodos de `CCPManager`

- **`getChannels({ name, direction } = {})`** — devuelve descriptores planos de los endpoints registrados (`id`, `name`, `direction`, `retain`, `createdAt`). Los filtros son opcionales. Son copias: modificarlas no afecta al registro.
- **`unregister(id)`** — quita un endpoint por su id. Es un uso avanzado; normalmente basta con `channel.disconnect()`. Lanza `unknown-endpoint` si el id no existe.
- **`clearRetained(name)`** — borra el mensaje retenido de un `name`. Sin argumento, borra todos.
- **`destroy()`** — libera endpoints, suscripciones y mensajes retenidos. Después de llamarlo, cualquier operación de la instancia lanza `destroyed`.

### Códigos de error

Todos los errores son instancias de `CCPError`, con la propiedad `code` (uno de `CCP_ERROR_CODES`). Puedes distinguirlos sin leer el mensaje:

```js
import { CCPError, CCP_ERROR_CODES } from '@ac-base/ac-ccp';

try {
  channel.publish(data);
} catch (error) {
  if (error instanceof CCPError && error.code === CCP_ERROR_CODES.PUBLISH_ON_IN) {
    // el canal es de entrada; no puede publicar
  }
}
```

| Código (`CCP_ERROR_CODES`) | Valor                   | Cuándo ocurre                                                                                                      |
| -------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `INVALID_NAME`             | `invalid-name`          | `register()` con `name` vacío o que no es string. También `ChannelController` sin `config.ccp`.                    |
| `DUPLICATE_ID`             | `duplicate-id`          | `register()` con un `id` que ya está en uso.                                                                       |
| `UNKNOWN_ENDPOINT`         | `unknown-endpoint`      | `unregister(id)` con un id que no existe.                                                                          |
| `DESTROYED`                | `destroyed`             | Cualquier operación sobre una instancia ya destruida con `destroy()`.                                              |
| `PUBLISH_ON_IN`            | `publish-on-in`         | `publish()` en un canal `in`.                                                                                      |
| `SUBSCRIBE_ON_OUT`         | `subscribe-on-out`      | `subscribe()` en un canal `out`.                                                                                   |
| `ENDPOINT_DISCONNECTED`    | `endpoint-disconnected` | `publish()` o `subscribe()` después de `disconnect()`, o `publish()` en un `ChannelController` sin host conectado. |

El paquete exporta exactamente `createCCP`, `ChannelController`, `CCPError` y `CCP_ERROR_CODES`. Lo demás es interno.

## Integración con Lit (`ChannelController`)

`ChannelController` es un Reactive Controller de Lit. Se engancha a un host (tu componente) y conecta y desconecta el canal con el ciclo de vida de ese host.

Su configuración acepta `ccp`, `name`, `direction`, `retain` (solo `out`), `replay` (solo `in`) y `onMessage` (solo `in`).

Publicar desde un componente (canal `out`):

```js
// ccp.js
import { createCCP } from '@ac-base/ac-ccp';

export const ccp = createCCP();
```

```js
// users-table.js
import { LitElement, html } from 'lit';
import { ChannelController } from '@ac-base/ac-ccp';
import { ccp } from './ccp.js';

export class UsersTable extends LitElement {
  #publisher = new ChannelController(this, {
    ccp,
    name: 'users.selected',
    direction: 'out',
  });

  #users = [
    { id: 'u1', name: 'Ana' },
    { id: 'u2', name: 'Luis' },
  ];

  #select(user) {
    this.#publisher.publish({ id: user.id, name: user.name });
  }

  render() {
    return html`
      <ul>
        ${this.#users.map(user => html`<li @click=${() => this.#select(user)}>${user.name}</li>`)}
      </ul>
    `;
  }
}

customElements.define('users-table', UsersTable);
```

Suscribirse y reaccionar (canal `in`):

```js
// selected-user-badge.js
import { LitElement, html } from 'lit';
import { ChannelController } from '@ac-base/ac-ccp';
import { ccp } from './ccp.js';

export class SelectedUserBadge extends LitElement {
  #selected = null;

  #subscriber = new ChannelController(this, {
    ccp,
    name: 'users.selected',
    direction: 'in',
    onMessage: message => {
      this.#selected = message.payload;
    },
  });

  render() {
    return html`<p>Seleccionado: ${this.#selected ? this.#selected.name : 'ninguno'}</p>`;
  }
}

customElements.define('selected-user-badge', SelectedUserBadge);
```

Reglas que conviene tener presentes:

- **Nunca crea su propia instancia de CCP.** Siempre recibe la suya en `config.ccp`, creada una sola vez por la aplicación con `createCCP()`.
- **El ciclo de vida lo maneja el host.** Se registra en `hostConnected()` y se desconecta por completo en `hostDisconnected()`. Cada conexión pide un endpoint nuevo, así que reconectar (`connect → disconnect → connect`) no duplica suscripciones.
- **`host.requestUpdate()` se llama después de tu callback.** Cuando llega un mensaje, el controller ejecuta `onMessage` y luego pide la actualización del host. No necesitas llamarlo tú.
- **Un `in` sin `onMessage` solo registra el endpoint** y no se suscribe.
- **`publish()` requiere host conectado.** Si el host no está conectado, lanza `endpoint-disconnected`.

## Ejemplo ejecutable

El paquete incluye una demo en `examples/` con tres páginas (home, publisher y subscriber), navegadas por hash (`#home`, `#publisher`, `#subscriber`). Las tres comparten la misma instancia de CCP. Para servirla:

```bash
pnpm --filter @ac-base/ac-ccp run examples:serve
```

## Fuera de alcance

- Comunicación entre pestañas o ventanas (`BroadcastChannel`).
- Red o WebSocket: todo ocurre en memoria, dentro de una misma página.
- Persistencia de mensajes: los mensajes retenidos viven solo en memoria y se pierden al recargar la página.
- Integración con `aclit app:create`: el CLI todavía no tiene ese comando; queda para cuando esté implementado.
