# `@ac-components/ac-api-productos`

`ac-api-productos` es un componente **sin UI**: simula el consumo de una API
de productos. Se declara en el `render()` de otro componente y se usa
invocando sus métodos públicos y/o escuchando sus eventos — mismo contrato que
[`ac-api-users`](../ac-api-users/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-productos
```

```js
import '@ac-components/ac-api-productos';
```

## Propiedades

| Propiedad       | Atributo         | Tipo    | Default | Descripción                                                                    |
| --------------- | ---------------- | ------- | ------- | ------------------------------------------------------------------------------ |
| `version`       | `version`        | String  | `'v1'`  | Versión del mock/servicio simulado.                                            |
| `timeout`       | `timeout`        | Number  | `3000`  | Latencia simulada (ms) de cada método.                                         |
| `simulateError` | `simulate-error` | Boolean | `false` | Si está en `true`, todo método siguiente rechaza y dispara su evento `-error`. |

## Métodos públicos

| Método                                     | Evento éxito                           | Evento error                         |
| ------------------------------------------ | -------------------------------------- | ------------------------------------ |
| `obtenerProducto(id, queryParams = {})`    | `ac-api-productos-get-product-success` | `ac-api-productos-get-product-error` |
| `listarProductos(queryParams = {})`        | `ac-api-productos-list-success`        | `ac-api-productos-list-error`        |
| `buscarProductos(texto, queryParams = {})` | `ac-api-productos-search-success`      | `ac-api-productos-search-error`      |
| `obtenerDetalleProducto(id)`               | `ac-api-productos-get-detail-success`  | `ac-api-productos-get-detail-error`  |
| `registrarProducto(objetoProducto)`        | `ac-api-productos-register-success`    | `ac-api-productos-register-error`    |
| `actualizarProducto(id, cambios)`          | `ac-api-productos-update-success`      | `ac-api-productos-update-error`      |
| `eliminarProducto(id)`                     | `ac-api-productos-delete-success`      | `ac-api-productos-delete-error`      |

`queryParams` soportado en `listarProductos`/`buscarProductos`: `pagination`,
`page`, `sortBy`/`sortDir`, `fields` (proyección), `category` (filtra por
`categoria`) y `status` (`'active'|'inactive'`, filtra por `activo`).

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-productos';

class MiCatalogo extends LitElement {
  static properties = { productos: { state: true } };

  constructor() {
    super();
    this.productos = [];
  }

  firstUpdated() {
    this._apiProductos = this.renderRoot.querySelector('#apiProductos');
  }

  _cargarProductos() {
    this._apiProductos.listarProductos({ category: 'electronica' });
  }

  _handleList(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.productos = data;
  }

  render() {
    return html`
      <ac-api-productos
        id="apiProductos"
        version="0"
        @ac-api-productos-list-success="${this._handleList}"
        @ac-api-productos-list-error="${this._handleList}"
      ></ac-api-productos>

      <button @click="${this._cargarProductos}">Cargar productos</button>
      <ul>
        ${this.productos.map(p => html`<li>${p.nombre} — S/ ${p.precio}</li>`)}
      </ul>
    `;
  }
}
```

## Métodos privados

`_formatProduct`, `_formatProductDetail`, `_formatProductPrice`,
`_formatProductSpecs`, `_applyQueryParams`, `_applyFieldsParam`,
`_requireMockProduct`. El manejo de latencia/error simulado/disparo de
eventos lo da `@ac-base/ac-api-mixin`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
