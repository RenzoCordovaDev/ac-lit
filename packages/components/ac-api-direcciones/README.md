# `@ac-components/ac-api-direcciones`

`ac-api-direcciones` es un componente **sin UI**: simula el consumo de una API
de direcciones de envío (listar, obtener, agregar, actualizar, eliminar,
marcar predeterminada). Mismo contrato que [`ac-api-users`](../ac-api-users/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-direcciones
```

```js
import '@ac-components/ac-api-direcciones';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`: `version`, `timeout`,
`simulateError` (ver [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md)).

## Métodos públicos

| Método                                | Evento éxito                              | Evento error                            |
| ------------------------------------- | ----------------------------------------- | --------------------------------------- |
| `listarDirecciones(queryParams = {})` | `ac-api-direcciones-list-success`         | `ac-api-direcciones-list-error`         |
| `obtenerDireccion(id)`                | `ac-api-direcciones-get-success`          | `ac-api-direcciones-get-error`          |
| `agregarDireccion(objetoDireccion)`   | `ac-api-direcciones-add-success`          | `ac-api-direcciones-add-error`          |
| `actualizarDireccion(id, cambios)`    | `ac-api-direcciones-update-success`       | `ac-api-direcciones-update-error`       |
| `eliminarDireccion(id)`               | `ac-api-direcciones-delete-success`       | `ac-api-direcciones-delete-error`       |
| `marcarPredeterminada(id)`            | `ac-api-direcciones-mark-default-success` | `ac-api-direcciones-mark-default-error` |

Eliminar la dirección predeterminada promueve automáticamente otra (si queda
alguna). `marcarPredeterminada` garantiza que solo una dirección tenga
`predeterminada: true` a la vez.

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-direcciones';

class MisDirecciones extends LitElement {
  static properties = { direcciones: { state: true } };

  firstUpdated() {
    this._apiDirecciones = this.renderRoot.querySelector('#apiDirecciones');
  }

  _cargar() {
    this._apiDirecciones.listarDirecciones();
  }

  _handleList(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.direcciones = data;
  }

  render() {
    return html`
      <ac-api-direcciones
        id="apiDirecciones"
        version="0"
        @ac-api-direcciones-list-success="${this._handleList}"
        @ac-api-direcciones-list-error="${this._handleList}"
      ></ac-api-direcciones>

      <button @click="${this._cargar}">Cargar direcciones</button>
    `;
  }
}
```

## Métodos privados

`_requireMockAddress`, `_formatAddress`, `_applyQueryParams`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
