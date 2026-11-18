# `@ac-components/ac-api-operaciones`

`ac-api-operaciones` es un componente **sin UI**: simula el consumo de una API
de operaciones financieras (saldo, historial, compras, transferencias,
depósitos y retiros) sobre un par de cuentas mock. Mismo contrato que
[`ac-api-users`](../ac-api-users/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-operaciones
```

```js
import '@ac-components/ac-api-operaciones';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`: `version`, `timeout`,
`simulateError` (ver [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md)).

## Métodos públicos

| Método                                               | Evento éxito                          | Evento error                        |
| ---------------------------------------------------- | ------------------------------------- | ----------------------------------- |
| `consultarSaldo(cuentaId)`                           | `ac-api-operaciones-balance-success`  | `ac-api-operaciones-balance-error`  |
| `obtenerHistorial(cuentaId, queryParams = {})`       | `ac-api-operaciones-history-success`  | `ac-api-operaciones-history-error`  |
| `comprar(productoId, cantidad = 1)`                  | `ac-api-operaciones-buy-success`      | `ac-api-operaciones-buy-error`      |
| `transferir(cuentaOrigenId, cuentaDestinoId, monto)` | `ac-api-operaciones-transfer-success` | `ac-api-operaciones-transfer-error` |
| `depositar(cuentaId, monto)`                         | `ac-api-operaciones-deposit-success`  | `ac-api-operaciones-deposit-error`  |
| `retirar(cuentaId, monto)`                           | `ac-api-operaciones-withdraw-success` | `ac-api-operaciones-withdraw-error` |

`transferir`/`retirar`/`comprar` disparan su evento de error (en vez de
resolver) cuando el saldo mock es insuficiente — error de dominio, no
`simulateError`.

`queryParams` soportado en `obtenerHistorial`: `tipo` (filtra por tipo de
movimiento), `sortBy`/`sortDir`, `pagination`/`page`.

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-operaciones';

class MiBilletera extends LitElement {
  static properties = { saldo: { state: true } };

  firstUpdated() {
    this._apiOps = this.renderRoot.querySelector('#apiOperaciones');
  }

  _consultar() {
    this._apiOps.consultarSaldo(1);
  }

  _handleBalance(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.saldo = data.saldo;
  }

  render() {
    return html`
      <ac-api-operaciones
        id="apiOperaciones"
        version="0"
        @ac-api-operaciones-balance-success="${this._handleBalance}"
        @ac-api-operaciones-balance-error="${this._handleBalance}"
      ></ac-api-operaciones>

      <button @click="${this._consultar}">Consultar saldo</button>
      <p>Saldo: ${this.saldo ?? '—'}</p>
    `;
  }
}
```

## Métodos privados

`_requireMockAccount`, `_recordMovement`, `_formatAccount`,
`_formatMovement`, `_formatAmount`, `_applyQueryParams`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
