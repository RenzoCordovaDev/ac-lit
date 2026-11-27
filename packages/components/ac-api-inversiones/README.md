# `@ac-components/ac-api-inversiones`

`ac-api-inversiones` es un componente **sin UI**: simula el consumo de una API
de inversiones (depósitos a plazo y fondos mutuos) sobre un catálogo y un
conjunto de inversiones mock. Mismo contrato que
[`ac-api-operaciones`](../ac-api-operaciones/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-inversiones
```

```js
import '@ac-components/ac-api-inversiones';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`: `version`, `timeout`,
`simulateError` (ver [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md)).

## Métodos públicos

| Método                                              | Evento éxito                           | Evento error                         |
| --------------------------------------------------- | -------------------------------------- | ------------------------------------ |
| `listarProductos(queryParams = {})`                 | `ac-api-inversiones-products-success`  | `ac-api-inversiones-products-error`  |
| `simularRentabilidad(productoId, monto, plazoDias)` | `ac-api-inversiones-simulate-success`  | `ac-api-inversiones-simulate-error`  |
| `suscribirInversion(productoId, monto)`             | `ac-api-inversiones-subscribe-success` | `ac-api-inversiones-subscribe-error` |
| `listarInversiones(queryParams = {})`               | `ac-api-inversiones-list-success`      | `ac-api-inversiones-list-error`      |
| `rescatarInversion(inversionId)`                    | `ac-api-inversiones-redeem-success`    | `ac-api-inversiones-redeem-error`    |

`simularRentabilidad`, `suscribirInversion` disparan su evento de error (en vez
de resolver) cuando el producto no existe o el monto es menor a su `montoMinimo`.
`rescatarInversion` falla si la inversión no existe o ya está `rescatada`. Son
errores de dominio, no `simulateError`.

La rentabilidad se calcula de forma proporcional al plazo:
`rentabilidad = monto * (tasaAnual / 100) * (plazoDias / 365)`.

En `suscribirInversion`, `fechaInicio` es hoy y `fechaVencimiento` es hoy más el
`plazoDias` del producto; si el producto no tiene plazo (`plazoDias: 0`), queda en
`null`.

En `rescatarInversion`, la rentabilidad usa los días transcurridos desde
`fechaInicio` hasta hoy, con la tasa del producto asociado.

`queryParams` soportado en `listarProductos`: `tipo`. En `listarInversiones`:
`estado`, `productoId`. En ambos: `sortBy`/`sortDir`, `pagination`/`page`.

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-inversiones';

class MiInversor extends LitElement {
  static properties = { rentabilidad: { state: true } };

  firstUpdated() {
    this._apiInv = this.renderRoot.querySelector('#apiInversiones');
  }

  _simular() {
    this._apiInv.simularRentabilidad(1, 1000, 90);
  }

  _handleSimulate(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.rentabilidad = data.rentabilidad;
  }

  render() {
    return html`
      <ac-api-inversiones
        id="apiInversiones"
        version="0"
        @ac-api-inversiones-simulate-success="${this._handleSimulate}"
        @ac-api-inversiones-simulate-error="${this._handleSimulate}"
      ></ac-api-inversiones>

      <button @click="${this._simular}">Simular</button>
      <p>Rentabilidad: ${this.rentabilidad ?? '—'}</p>
    `;
  }
}
```

## Métodos privados

`_requireProduct`, `_requireInvestment`, `_validateMonto`,
`_calcularRentabilidad`, `_round`, `_addDays`, `_toDateString`,
`_parseDateString`, `_applyQueryParams`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
