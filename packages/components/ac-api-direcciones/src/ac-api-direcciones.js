import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_ADDRESSES = [
  {
    id: 1,
    etiqueta: 'Casa',
    linea1: 'Av. Siempre Viva 123',
    ciudad: 'Lima',
    pais: 'Perú',
    predeterminada: true,
  },
  {
    id: 2,
    etiqueta: 'Oficina',
    linea1: 'Jr. Comercio 456',
    ciudad: 'Lima',
    pais: 'Perú',
    predeterminada: false,
  },
];

/**
 * `ac-api-direcciones` - simulador de API de direcciones de envío, sin UI.
 * Mismo contrato que `ac-api-users`: se declara en el `render()` de otro
 * componente y se invoca a través de sus métodos públicos, cada uno con
 * `Promise` + evento `ac-api-direcciones-<acción>-<resultado>`.
 */
export class ApiDirecciones extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-direcciones';
  }

  constructor() {
    super();
    this._addresses = MOCK_ADDRESSES.map(address => ({ ...address }));
    this._nextId = this._addresses.length + 1;
  }

  /** Lista direcciones, con soporte de `queryParams` (orden, paginado, proyección). */
  listarDirecciones(queryParams = {}) {
    return this._simulateCall(
      'listarDirecciones',
      { queryParams },
      {
        successEvent: 'ac-api-direcciones-list-success',
        errorEvent: 'ac-api-direcciones-list-error',
        resolveData: () =>
          this._applyQueryParams(
            this._addresses.map(a => this._formatAddress(a)),
            queryParams,
          ),
      },
    );
  }

  /** Obtiene una dirección por id. */
  obtenerDireccion(id) {
    return this._simulateCall(
      'obtenerDireccion',
      { id },
      {
        successEvent: 'ac-api-direcciones-get-success',
        errorEvent: 'ac-api-direcciones-get-error',
        resolveData: () => this._formatAddress(this._requireMockAddress(id)),
      },
    );
  }

  /** Agrega una dirección nueva. La primera dirección registrada queda como predeterminada. */
  agregarDireccion(objetoDireccion) {
    return this._simulateCall(
      'agregarDireccion',
      { objetoDireccion },
      {
        successEvent: 'ac-api-direcciones-add-success',
        errorEvent: 'ac-api-direcciones-add-error',
        errorMessage: 'No se pudo agregar la dirección',
        resolveData: () => {
          if (!objetoDireccion?.linea1 || !objetoDireccion?.ciudad) {
            throw new Error('`linea1` y `ciudad` son obligatorios');
          }
          const nuevaDireccion = {
            id: this._nextId++,
            etiqueta: objetoDireccion.etiqueta ?? 'Dirección',
            linea1: objetoDireccion.linea1,
            ciudad: objetoDireccion.ciudad,
            pais: objetoDireccion.pais ?? 'Perú',
            predeterminada: this._addresses.length === 0,
          };
          this._addresses.push(nuevaDireccion);
          return this._formatAddress(nuevaDireccion);
        },
      },
    );
  }

  /** Actualiza (edita) una dirección existente, mezclando `cambios` sobre el registro actual. */
  actualizarDireccion(id, cambios = {}) {
    return this._simulateCall(
      'actualizarDireccion',
      { id, cambios },
      {
        successEvent: 'ac-api-direcciones-update-success',
        errorEvent: 'ac-api-direcciones-update-error',
        resolveData: () => {
          const address = this._requireMockAddress(id);
          Object.assign(address, cambios, { id: address.id });
          return this._formatAddress(address);
        },
      },
    );
  }

  /** Elimina una dirección; si era la predeterminada, promueve la siguiente que quede. */
  eliminarDireccion(id) {
    return this._simulateCall(
      'eliminarDireccion',
      { id },
      {
        successEvent: 'ac-api-direcciones-delete-success',
        errorEvent: 'ac-api-direcciones-delete-error',
        resolveData: () => {
          const address = this._requireMockAddress(id);
          this._addresses = this._addresses.filter(a => a.id !== id);
          if (address.predeterminada && this._addresses.length > 0) {
            this._addresses[0].predeterminada = true;
          }
          return { id, deleted: true };
        },
      },
    );
  }

  /** Marca una dirección como predeterminada; desmarca cualquier otra. */
  marcarPredeterminada(id) {
    return this._simulateCall(
      'marcarPredeterminada',
      { id },
      {
        successEvent: 'ac-api-direcciones-mark-default-success',
        errorEvent: 'ac-api-direcciones-mark-default-error',
        resolveData: () => {
          this._requireMockAddress(id);
          for (const address of this._addresses) {
            address.predeterminada = address.id === Number(id);
          }
          return this._addresses.map(a => this._formatAddress(a));
        },
      },
    );
  }

  _requireMockAddress(id) {
    const address = this._addresses.find(a => a.id === Number(id));
    if (!address) {
      throw new Error(`La dirección ${id} no existe en el mock`);
    }
    return address;
  }

  _formatAddress(address) {
    return { ...address };
  }

  /** Orden + paginado + proyección de campos, compartido por `listarDirecciones`. */
  _applyQueryParams(list, queryParams = {}) {
    let result = [...list];

    if (queryParams.sortBy) {
      const dir = queryParams.sortDir === 'desc' ? -1 : 1;
      result = [...result].sort((a, b) =>
        a[queryParams.sortBy] > b[queryParams.sortBy] ? dir : -dir,
      );
    }

    if (queryParams.pagination) {
      const pageSize = Number(queryParams.pagination);
      const page = Number(queryParams.page ?? 1);
      const start = (page - 1) * pageSize;
      result = result.slice(start, start + pageSize);
    }

    if (!Array.isArray(queryParams.fields) || queryParams.fields.length === 0) {
      return result;
    }
    return result.map(address =>
      Object.fromEntries(queryParams.fields.map(field => [field, address[field]])),
    );
  }
}
