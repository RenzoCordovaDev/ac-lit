import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_PAYMENT_METHODS = [
  { id: 1, tipo: 'tarjeta', marca: 'Visa', numero: '4111111111111111', predeterminado: true },
  {
    id: 2,
    tipo: 'tarjeta',
    marca: 'Mastercard',
    numero: '5500000000000004',
    predeterminado: false,
  },
];

/**
 * `ac-api-pagos` - simulador de API de métodos de pago, sin UI. Mismo
 * contrato que `ac-api-users`: se declara en el `render()` de otro
 * componente y se invoca a través de sus métodos públicos, cada uno con
 * `Promise` + evento `ac-api-pagos-<acción>-<resultado>`.
 */
export class ApiPagos extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-pagos';
  }

  constructor() {
    super();
    this._methods = MOCK_PAYMENT_METHODS.map(method => ({ ...method }));
    this._nextId = this._methods.length + 1;
    this._nextOperationId = 1;
  }

  /** Lista métodos de pago guardados, con soporte de `queryParams` (orden, paginado, proyección). */
  listarMetodosPago(queryParams = {}) {
    return this._simulateCall(
      'listarMetodosPago',
      { queryParams },
      {
        successEvent: 'ac-api-pagos-list-success',
        errorEvent: 'ac-api-pagos-list-error',
        resolveData: () =>
          this._applyQueryParams(
            this._methods.map(m => this._formatMethod(m)),
            queryParams,
          ),
      },
    );
  }

  /** Agrega un método de pago nuevo; el número de tarjeta se enmascara en la respuesta. */
  agregarMetodoPago(objetoMetodo) {
    return this._simulateCall(
      'agregarMetodoPago',
      { objetoMetodo },
      {
        successEvent: 'ac-api-pagos-add-success',
        errorEvent: 'ac-api-pagos-add-error',
        errorMessage: 'No se pudo agregar el método de pago',
        resolveData: () => {
          if (!objetoMetodo?.marca || !objetoMetodo?.numero) {
            throw new Error('`marca` y `numero` son obligatorios');
          }
          const nuevoMetodo = {
            id: this._nextId++,
            tipo: 'tarjeta',
            marca: objetoMetodo.marca,
            numero: objetoMetodo.numero,
            predeterminado: this._methods.length === 0,
          };
          this._methods.push(nuevoMetodo);
          return this._formatMethod(nuevoMetodo);
        },
      },
    );
  }

  /** Elimina un método de pago por id. */
  eliminarMetodoPago(id) {
    return this._simulateCall(
      'eliminarMetodoPago',
      { id },
      {
        successEvent: 'ac-api-pagos-delete-success',
        errorEvent: 'ac-api-pagos-delete-error',
        resolveData: () => {
          this._requireMockMethod(id);
          this._methods = this._methods.filter(m => m.id !== id);
          return { id, deleted: true };
        },
      },
    );
  }

  /** Marca un método de pago como predeterminado; desmarca cualquier otro. */
  marcarMetodoPredeterminado(id) {
    return this._simulateCall(
      'marcarMetodoPredeterminado',
      { id },
      {
        successEvent: 'ac-api-pagos-mark-default-success',
        errorEvent: 'ac-api-pagos-mark-default-error',
        resolveData: () => {
          this._requireMockMethod(id);
          for (const method of this._methods) {
            method.predeterminado = method.id === Number(id);
          }
          return this._methods.map(m => this._formatMethod(m));
        },
      },
    );
  }

  /** Procesa un pago con un método existente; falla si el monto no es válido o el método no existe. */
  procesarPago(monto, metodoId) {
    return this._simulateCall(
      'procesarPago',
      { monto, metodoId },
      {
        successEvent: 'ac-api-pagos-process-success',
        errorEvent: 'ac-api-pagos-process-error',
        errorMessage: 'No se pudo procesar el pago',
        resolveData: () => {
          if (!(monto > 0)) {
            throw new Error('El monto debe ser mayor a 0');
          }
          this._requireMockMethod(metodoId);
          return { operacionId: this._nextOperationId++, monto: Number(monto), estado: 'aprobado' };
        },
      },
    );
  }

  _requireMockMethod(id) {
    const method = this._methods.find(m => m.id === Number(id));
    if (!method) {
      throw new Error(`El método de pago ${id} no existe en el mock`);
    }
    return method;
  }

  _formatMethod(method) {
    return {
      id: method.id,
      tipo: method.tipo,
      marca: method.marca,
      ultimosDigitos: this._maskCardNumber(method),
      predeterminado: method.predeterminado,
    };
  }

  _maskCardNumber(method) {
    return method.numero.slice(-4);
  }

  /** Orden + paginado + proyección de campos, compartido por `listarMetodosPago`. */
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
    return result.map(method =>
      Object.fromEntries(queryParams.fields.map(field => [field, method[field]])),
    );
  }
}
