# `@ac-components/ac-api-pedidos`

`ac-api-pedidos` es un componente **sin UI**: simula el consumo de una API de
pedidos (crear, consultar, listar, seguimiento y cancelación). Mismo contrato
que [`ac-api-users`](../ac-api-users/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-pedidos
```

```js
import '@ac-components/ac-api-pedidos';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`: `version`, `timeout`,
`simulateError` (ver [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md)).

## Métodos públicos

| Método                            | Evento éxito                        | Evento error                      |
| --------------------------------- | ----------------------------------- | --------------------------------- |
| `crearPedido(carrito)`            | `ac-api-pedidos-create-success`     | `ac-api-pedidos-create-error`     |
| `obtenerPedido(id)`               | `ac-api-pedidos-get-success`        | `ac-api-pedidos-get-error`        |
| `listarPedidos(queryParams = {})` | `ac-api-pedidos-list-success`       | `ac-api-pedidos-list-error`       |
| `obtenerEstadoPedido(id)`         | `ac-api-pedidos-get-status-success` | `ac-api-pedidos-get-status-error` |
| `cancelarPedido(id)`              | `ac-api-pedidos-cancel-success`     | `ac-api-pedidos-cancel-error`     |

`carrito` es un arreglo de `{ productoId, cantidad, precioUnitario }`.
`cancelarPedido` dispara su evento de error (en vez de resolver) si el pedido
ya está `entregado` — error de dominio, no `simulateError`.

`queryParams` soportado en `listarPedidos`: `status` (filtra por `estado`),
`sortBy`/`sortDir`, `pagination`/`page`, `fields` (proyección).

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-pedidos';

class MisPedidos extends LitElement {
  static properties = { pedidos: { state: true } };

  firstUpdated() {
    this._apiPedidos = this.renderRoot.querySelector('#apiPedidos');
  }

  _cargar() {
    this._apiPedidos.listarPedidos();
  }

  _handleList(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.pedidos = data;
  }

  render() {
    return html`
      <ac-api-pedidos
        id="apiPedidos"
        version="0"
        @ac-api-pedidos-list-success="${this._handleList}"
        @ac-api-pedidos-list-error="${this._handleList}"
      ></ac-api-pedidos>

      <button @click="${this._cargar}">Cargar pedidos</button>
    `;
  }
}
```

## Métodos privados

`_requireMockOrder`, `_calculateTotal`, `_formatOrder`,
`_formatOrderStatus`, `_applyQueryParams`, `_applyFieldsParam`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
