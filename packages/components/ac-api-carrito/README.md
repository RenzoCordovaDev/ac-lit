# `@ac-components/ac-api-carrito`

`ac-api-carrito` es un componente **sin UI**: simula el consumo de una API de
carrito de compras. A diferencia de `ac-api-users`, el "mock" acá es el
propio estado del carrito (vacío al montar la instancia), no un dataset fijo.
Mismo contrato que [`ac-api-users`](../ac-api-users/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-carrito
```

```js
import '@ac-components/ac-api-carrito';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`: `version`, `timeout`,
`simulateError` (ver [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md)).

## Métodos públicos

| Método                                     | Evento éxito                             | Evento error                           |
| ------------------------------------------ | ---------------------------------------- | -------------------------------------- |
| `agregarItem(item)`                        | `ac-api-carrito-add-success`             | `ac-api-carrito-add-error`             |
| `quitarItem(productoId)`                   | `ac-api-carrito-remove-success`          | `ac-api-carrito-remove-error`          |
| `listarItems(queryParams = {})`            | `ac-api-carrito-list-success`            | `ac-api-carrito-list-error`            |
| `actualizarCantidad(productoId, cantidad)` | `ac-api-carrito-update-quantity-success` | `ac-api-carrito-update-quantity-error` |
| `vaciarCarrito()`                          | `ac-api-carrito-clear-success`           | `ac-api-carrito-clear-error`           |
| `obtenerResumen()`                         | `ac-api-carrito-summary-success`         | `ac-api-carrito-summary-error`         |

`item` es `{ productoId, nombre, precio, cantidad }`. Agregar un `productoId`
que ya está en el carrito suma la cantidad en vez de duplicar la fila.
`obtenerResumen()` devuelve `{ items, subtotal, impuestos, total }` (IGV 18%).

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-carrito';

class MiCarrito extends LitElement {
  static properties = { items: { state: true } };

  constructor() {
    super();
    this.items = [];
  }

  firstUpdated() {
    this._apiCarrito = this.renderRoot.querySelector('#apiCarrito');
  }

  _agregar() {
    this._apiCarrito.agregarItem({ productoId: 1, nombre: 'Laptop', precio: 100, cantidad: 1 });
  }

  _handleAdd(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.items = data;
  }

  render() {
    return html`
      <ac-api-carrito
        id="apiCarrito"
        version="0"
        @ac-api-carrito-add-success="${this._handleAdd}"
        @ac-api-carrito-add-error="${this._handleAdd}"
      ></ac-api-carrito>

      <button @click="${this._agregar}">Agregar al carrito</button>
    `;
  }
}
```

## Métodos privados

`_requireMockItem`, `_formatItem`, `_formatSummary`, `_formatAmount`,
`_applyQueryParams`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
