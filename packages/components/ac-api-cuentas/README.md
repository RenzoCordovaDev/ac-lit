# `@ac-components/ac-api-cuentas`

`ac-api-cuentas` es un componente **sin UI** que simula el ciclo de vida de
cuentas bancarias. Permite consultar tipos de cuenta, listar cuentas y abrirlas,
cambiar su alias, bloquearlas o cerrarlas. Los saldos y movimientos se simulan
en [`ac-api-operaciones`](../ac-api-operaciones/README.md).

## Instalación

```bash
pnpm add @ac-components/ac-api-cuentas
```

```js
import '@ac-components/ac-api-cuentas';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`, hereda `version`, `timeout` y
`simulateError` de [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md).

## Métodos públicos

| Método                             | Evento éxito                    | Evento error                  |
| ---------------------------------- | ------------------------------- | ----------------------------- |
| `listarTiposCuenta()`              | `ac-api-cuentas-types-success`  | `ac-api-cuentas-types-error`  |
| `listarCuentas(queryParams = {})`  | `ac-api-cuentas-list-success`   | `ac-api-cuentas-list-error`   |
| `abrirCuenta(tipoId, alias)`       | `ac-api-cuentas-open-success`   | `ac-api-cuentas-open-error`   |
| `actualizarAlias(cuentaId, alias)` | `ac-api-cuentas-rename-success` | `ac-api-cuentas-rename-error` |
| `bloquearCuenta(cuentaId, motivo)` | `ac-api-cuentas-block-success`  | `ac-api-cuentas-block-error`  |
| `cerrarCuenta(cuentaId)`           | `ac-api-cuentas-close-success`  | `ac-api-cuentas-close-error`  |

- `abrirCuenta` requiere un tipo existente. Crea una cuenta `activa` con la
  moneda del tipo y la fecha actual en UTC (`YYYY-MM-DD`).
- `actualizarAlias` admite cuentas activas o bloqueadas. Una cuenta cerrada
  genera un error.
- `bloquearCuenta` requiere una cuenta activa y guarda el motivo en
  `motivoBloqueo`. Una cuenta bloqueada o cerrada genera un error.
- `cerrarCuenta` admite cuentas activas o bloqueadas. Las cuentas que se
  cierran siguen disponibles en `listarCuentas` y volver a cerrarlas genera
  un error.

Si una operación recibe un ID de cuenta inexistente, rechaza su promesa y
dispara el evento de error correspondiente. Los demás errores de dominio y
los fallos forzados con `simulateError` siguen ese mismo contrato.

`listarCuentas` admite los filtros `estado` y `tipoId`. `sortBy` selecciona el
campo de orden y `sortDir` acepta `asc` (por defecto) o `desc`. `pagination`
indica el tamaño de página y `page` empieza en `1`. El paginado se aplica
después de filtrar y ordenar.

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-cuentas';

class MisCuentas extends LitElement {
  static properties = { cuenta: { state: true }, error: { state: true } };

  firstUpdated() {
    this._apiCuentas = this.renderRoot.querySelector('#apiCuentas');
  }

  _abrir() {
    this._apiCuentas.abrirCuenta(1, 'Mis metas').catch(() => {
      // El evento ac-api-cuentas-open-error ya se encarga de mostrar el error.
    });
  }

  _handleOpen(event) {
    const { data, error } = event.detail;
    this.cuenta = data;
    this.error = error?.message;
  }

  render() {
    return html`
      <ac-api-cuentas
        id="apiCuentas"
        @ac-api-cuentas-open-success="${this._handleOpen}"
        @ac-api-cuentas-open-error="${this._handleOpen}"
      ></ac-api-cuentas>

      <button @click="${this._abrir}">Abrir cuenta</button>
      <p>${this.error ?? this.cuenta?.alias ?? '—'}</p>
    `;
  }
}

customElements.define('mis-cuentas', MisCuentas);
```

## Métodos privados

`_requireMockAccount`, `_applyQueryParams`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
