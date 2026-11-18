# `@ac-components/ac-api-pagos`

`ac-api-pagos` es un componente **sin UI**: simula el consumo de una API de
métodos de pago (listar, agregar, eliminar, marcar predeterminado, procesar
un pago). Mismo contrato que [`ac-api-users`](../ac-api-users/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-pagos
```

```js
import '@ac-components/ac-api-pagos';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`: `version`, `timeout`,
`simulateError` (ver [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md)).

## Métodos públicos

| Método                                | Evento éxito                        | Evento error                      |
| ------------------------------------- | ----------------------------------- | --------------------------------- |
| `listarMetodosPago(queryParams = {})` | `ac-api-pagos-list-success`         | `ac-api-pagos-list-error`         |
| `agregarMetodoPago(objetoMetodo)`     | `ac-api-pagos-add-success`          | `ac-api-pagos-add-error`          |
| `eliminarMetodoPago(id)`              | `ac-api-pagos-delete-success`       | `ac-api-pagos-delete-error`       |
| `marcarMetodoPredeterminado(id)`      | `ac-api-pagos-mark-default-success` | `ac-api-pagos-mark-default-error` |
| `procesarPago(monto, metodoId)`       | `ac-api-pagos-process-success`      | `ac-api-pagos-process-error`      |

`objetoMetodo` es `{ marca, numero }` — el número de tarjeta **nunca** se
devuelve completo: la respuesta trae `ultimosDigitos` (los últimos 4). Un
`monto <= 0` o un `metodoId` inexistente hacen que `procesarPago` dispare su
evento de error.

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-pagos';

class MisMetodosPago extends LitElement {
  static properties = { metodos: { state: true } };

  firstUpdated() {
    this._apiPagos = this.renderRoot.querySelector('#apiPagos');
  }

  _cargar() {
    this._apiPagos.listarMetodosPago();
  }

  _handleList(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.metodos = data;
  }

  render() {
    return html`
      <ac-api-pagos
        id="apiPagos"
        version="0"
        @ac-api-pagos-list-success="${this._handleList}"
        @ac-api-pagos-list-error="${this._handleList}"
      ></ac-api-pagos>

      <button @click="${this._cargar}">Cargar métodos de pago</button>
    `;
  }
}
```

## Métodos privados

`_requireMockMethod`, `_formatMethod`, `_maskCardNumber`, `_applyQueryParams`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
