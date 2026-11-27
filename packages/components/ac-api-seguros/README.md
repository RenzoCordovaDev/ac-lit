# `@ac-components/ac-api-seguros`

`ac-api-seguros` es un componente **sin UI**: simula el consumo de una API de
seguros (catálogo de productos, cotizaciones, contratación y cancelación de
pólizas) sobre un catálogo y una póliza mock. Mismo contrato que
[`ac-api-operaciones`](../ac-api-operaciones/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-seguros
```

```js
import '@ac-components/ac-api-seguros';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`: `version`, `timeout`,
`simulateError` (ver [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md)).

## Métodos públicos

| Método                               | Evento éxito                       | Evento error                     |
| ------------------------------------ | ---------------------------------- | -------------------------------- |
| `listarProductos(queryParams = {})`  | `ac-api-seguros-products-success`  | `ac-api-seguros-products-error`  |
| `cotizar(productoId, datos)`         | `ac-api-seguros-quote-success`     | `ac-api-seguros-quote-error`     |
| `contratarSeguro(productoId, datos)` | `ac-api-seguros-subscribe-success` | `ac-api-seguros-subscribe-error` |
| `listarPolizas(queryParams = {})`    | `ac-api-seguros-policies-success`  | `ac-api-seguros-policies-error`  |
| `cancelarPoliza(polizaId, motivo)`   | `ac-api-seguros-cancel-success`    | `ac-api-seguros-cancel-error`    |

`cotizar` estima la prima mensual del producto multiplicada por
`datos.factorRiesgo` (por defecto 1). `contratarSeguro` crea una póliza
`vigente` con número `POL-00XX` y vigencia de un año desde hoy.

`cotizar`, `contratarSeguro` y `cancelarPoliza` disparan su evento de error
(en vez de resolver) cuando el producto o la póliza no existen, o cuando la
póliza ya está cancelada — error de dominio, no `simulateError`.

`queryParams` soportado: en `listarProductos`, `tipo`; en `listarPolizas`,
`estado` y `productoId`. Ambos aceptan `sortBy`/`sortDir` y `pagination`/`page`.

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-seguros';

class MiCotizador extends LitElement {
  static properties = { prima: { state: true } };

  firstUpdated() {
    this._apiSeguros = this.renderRoot.querySelector('#apiSeguros');
  }

  _cotizar() {
    this._apiSeguros.cotizar(2, { factorRiesgo: 1.2 });
  }

  _handleQuote(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.prima = data.primaEstimada;
  }

  render() {
    return html`
      <ac-api-seguros
        id="apiSeguros"
        version="0"
        @ac-api-seguros-quote-success="${this._handleQuote}"
        @ac-api-seguros-quote-error="${this._handleQuote}"
      ></ac-api-seguros>

      <button @click="${this._cotizar}">Cotizar seguro vehicular</button>
      <p>Prima estimada: ${this.prima ?? '—'}</p>
    `;
  }
}
```

## Métodos privados

`_requireMockProduct`, `_requireMockPolicy`, `_applyQueryParams`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
