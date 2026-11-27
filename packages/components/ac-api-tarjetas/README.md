# `@ac-components/ac-api-tarjetas`

`ac-api-tarjetas` es un componente **sin UI** que simula la gestión de tarjetas
de débito y crédito sobre un par de cuentas mock. Sigue el mismo contrato que
[`ac-api-operaciones`](../ac-api-operaciones/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-tarjetas
```

```js
import '@ac-components/ac-api-tarjetas';
```

## Propiedades

Las propiedades `version`, `timeout` y `simulateError` se heredan de
[`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md).

## Métodos públicos

| Método                                       | Evento éxito                          | Evento error                        |
| -------------------------------------------- | ------------------------------------- | ----------------------------------- |
| `listarTarjetas(queryParams = {})`           | `ac-api-tarjetas-list-success`        | `ac-api-tarjetas-list-error`        |
| `solicitarTarjeta(cuentaId, tipo)`           | `ac-api-tarjetas-request-success`     | `ac-api-tarjetas-request-error`     |
| `bloquearTarjeta(tarjetaId, motivo)`         | `ac-api-tarjetas-block-success`       | `ac-api-tarjetas-block-error`       |
| `desbloquearTarjeta(tarjetaId)`              | `ac-api-tarjetas-unblock-success`     | `ac-api-tarjetas-unblock-error`     |
| `cambiarPin(tarjetaId, pinActual, pinNuevo)` | `ac-api-tarjetas-pin-success`         | `ac-api-tarjetas-pin-error`         |
| `consultarLineaDisponible(tarjetaId)`        | `ac-api-tarjetas-credit-line-success` | `ac-api-tarjetas-credit-line-error` |

- `listarTarjetas` devuelve las tarjetas de la instancia. `queryParams` admite
  los filtros `estado` (`activa` o `bloqueada`) y `tipo` (`debito` o `credito`),
  `sortBy`/`sortDir` para ordenar (`asc` por defecto o `desc`) y
  `pagination`/`page` para indicar tamaño de página y número de página (desde `1`).
- `solicitarTarjeta` requiere un tipo `debito` o `credito` (cualquier otro valor
  dispara error). La cuenta no se valida contra otro componente. Devuelve una
  tarjeta activa Visa con cuatro dígitos generados. Una tarjeta
  de crédito nueva tiene una línea de `5000` disponible en su totalidad.
- `bloquearTarjeta` requiere una tarjeta activa y `desbloquearTarjeta` requiere
  una bloqueada. Ambos devuelven la tarjeta actualizada. El `motivo` del bloqueo
  se incluye en los parámetros del evento.
- `cambiarPin` valida el PIN simulado fijo `'1234'` y devuelve
  `{ tarjetaId, estado: 'actualizado' }`. El PIN de validación es fijo en todas
  las llamadas. Los eventos de PIN incluyen solo `tarjetaId` en `params`.
- `consultarLineaDisponible` devuelve `{ tarjetaId, lineaCredito, disponible }`
  para una tarjeta de crédito. Una tarjeta de débito genera un error de dominio.

Si la cuenta o tarjeta solicitada no existe, o se incumple alguna regla de
dominio, la promesa rechaza y el método dispara su evento de error.

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-tarjetas';

class MisTarjetas extends LitElement {
  static properties = { disponible: { state: true } };

  firstUpdated() {
    this._apiTarjetas = this.renderRoot.querySelector('#apiTarjetas');
  }

  async _consultar() {
    try {
      await this._apiTarjetas.consultarLineaDisponible(2);
    } catch {
      // El evento de error ya se procesa en _handleCreditLine.
    }
  }

  _handleCreditLine(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.disponible = data.disponible;
  }

  render() {
    return html`
      <ac-api-tarjetas
        id="apiTarjetas"
        version="v1"
        @ac-api-tarjetas-credit-line-success="${this._handleCreditLine}"
        @ac-api-tarjetas-credit-line-error="${this._handleCreditLine}"
      ></ac-api-tarjetas>

      <button @click="${this._consultar}">Consultar línea disponible</button>
      <p>Disponible: ${this.disponible ?? '—'}</p>
    `;
  }
}
```

## Métodos privados

`_requireMockCard`, `_applyQueryParams`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
