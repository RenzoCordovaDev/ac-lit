# `@ac-components/ac-api-notificaciones`

`ac-api-notificaciones` es un componente **sin UI**: simula el consumo de una
API de notificaciones (enviar, listar, leer, marcar como leída, eliminar).
Mismo contrato que [`ac-api-users`](../ac-api-users/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-notificaciones
```

```js
import '@ac-components/ac-api-notificaciones';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`: `version`, `timeout`,
`simulateError` (ver [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md)).

## Métodos públicos

| Método                                   | Evento éxito                              | Evento error                            |
| ---------------------------------------- | ----------------------------------------- | --------------------------------------- |
| `enviarNotificacion(objetoNotificacion)` | `ac-api-notificaciones-send-success`      | `ac-api-notificaciones-send-error`      |
| `listarNotificaciones(queryParams = {})` | `ac-api-notificaciones-list-success`      | `ac-api-notificaciones-list-error`      |
| `obtenerNotificacion(id)`                | `ac-api-notificaciones-get-success`       | `ac-api-notificaciones-get-error`       |
| `marcarLeida(id)`                        | `ac-api-notificaciones-mark-read-success` | `ac-api-notificaciones-mark-read-error` |
| `eliminarNotificacion(id)`               | `ac-api-notificaciones-delete-success`    | `ac-api-notificaciones-delete-error`    |

`queryParams` soportado en `listarNotificaciones`: `tipo`, `leida`
(`true`/`false`) o `status` (`'read'|'unread'`), `sortBy`/`sortDir` (default:
`fecha` descendente), `pagination`/`page`, `fields` (proyección).

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-notificaciones';

class MisNotificaciones extends LitElement {
  static properties = { notificaciones: { state: true } };

  firstUpdated() {
    this._apiNotificaciones = this.renderRoot.querySelector('#apiNotificaciones');
  }

  _cargar() {
    this._apiNotificaciones.listarNotificaciones({ leida: false });
  }

  _handleList(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.notificaciones = data;
  }

  render() {
    return html`
      <ac-api-notificaciones
        id="apiNotificaciones"
        version="0"
        @ac-api-notificaciones-list-success="${this._handleList}"
        @ac-api-notificaciones-list-error="${this._handleList}"
      ></ac-api-notificaciones>

      <button @click="${this._cargar}">Ver no leídas</button>
    `;
  }
}
```

## Métodos privados

`_requireMockNotification`, `_formatNotification`, `_applyQueryParams`,
`_applyFieldsParam`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
