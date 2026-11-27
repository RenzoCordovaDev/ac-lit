# `@ac-components/ac-api-prestamos`

`ac-api-prestamos` es un componente **sin UI**: simula el consumo de una API de
préstamos (productos, simulación de cuotas, solicitudes, listado, pago de
cuotas y cronograma) sobre un catálogo y unos préstamos mock. Mismo contrato que
[`ac-api-operaciones`](../ac-api-operaciones/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-prestamos
```

```js
import '@ac-components/ac-api-prestamos';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`: `version`, `timeout`,
`simulateError` (ver [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md)).

## Métodos públicos

| Método                                             | Evento éxito                        | Evento error                      |
| -------------------------------------------------- | ----------------------------------- | --------------------------------- |
| `listarProductos(queryParams = {})`                | `ac-api-prestamos-products-success` | `ac-api-prestamos-products-error` |
| `simularPrestamo(productoId, monto, plazoMeses)`   | `ac-api-prestamos-simulate-success` | `ac-api-prestamos-simulate-error` |
| `solicitarPrestamo(productoId, monto, plazoMeses)` | `ac-api-prestamos-request-success`  | `ac-api-prestamos-request-error`  |
| `listarPrestamos(queryParams = {})`                | `ac-api-prestamos-list-success`     | `ac-api-prestamos-list-error`     |
| `pagarCuota(prestamoId)`                           | `ac-api-prestamos-pay-success`      | `ac-api-prestamos-pay-error`      |
| `obtenerCronograma(prestamoId)`                    | `ac-api-prestamos-schedule-success` | `ac-api-prestamos-schedule-error` |

`simularPrestamo` y `solicitarPrestamo` disparan su evento de error (en vez de
resolver) cuando el producto no existe, o el monto o el plazo superan el máximo
del producto — error de dominio, no `simulateError`.

La cuota estimada usa interés simple sobre `tasaAnual`:
`interesTotal = monto * (tasaAnual/100) * (plazoMeses/12)` y
`cuotaMonto = (monto + interesTotal) / plazoMeses`.

`queryParams` soportado en `listarPrestamos`: `estado`, `productoId`,
`sortBy`/`sortDir`, `pagination`/`page`. En `listarProductos`: `sortBy`/`sortDir`,
`pagination`/`page`.

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-prestamos';

class MiCredito extends LitElement {
  static properties = { cuota: { state: true } };

  firstUpdated() {
    this._apiPrestamos = this.renderRoot.querySelector('#apiPrestamos');
  }

  _simular() {
    this._apiPrestamos.simularPrestamo(1, 10000, 12);
  }

  _handleSimulate(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.cuota = data.cuotaMonto;
  }

  render() {
    return html`
      <ac-api-prestamos
        id="apiPrestamos"
        version="0"
        @ac-api-prestamos-simulate-success="${this._handleSimulate}"
        @ac-api-prestamos-simulate-error="${this._handleSimulate}"
      ></ac-api-prestamos>

      <button @click="${this._simular}">Simular préstamo</button>
      <p>Cuota estimada: ${this.cuota ?? '—'}</p>
    `;
  }
}
```

## Métodos privados

`_requireProduct`, `_requireLoan`, `_validateRequest`, `_buildQuote`,
`_addMonths`, `_round2`, `_applyQueryParams`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
