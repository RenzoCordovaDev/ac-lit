import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const TAX_RATE = 0.18;

/**
 * `ac-api-carrito` - simulador de API de carrito de compras, sin UI. A
 * diferencia de `ac-api-users`, el "mock" acá es el propio estado del
 * carrito (vacío al montar la instancia) — mismo contrato: `Promise` +
 * evento `ac-api-carrito-<acción>-<resultado>` en cada método.
 */
export class ApiCarrito extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-carrito';
  }

  constructor() {
    super();
    this._items = [];
  }

  /** Agrega un ítem (o suma la cantidad si el producto ya estaba en el carrito). */
  agregarItem(item) {
    return this._simulateCall(
      'agregarItem',
      { item },
      {
        successEvent: 'ac-api-carrito-add-success',
        errorEvent: 'ac-api-carrito-add-error',
        errorMessage: 'No se pudo agregar el ítem al carrito',
        resolveData: () => {
          if (!item?.productoId || !item?.nombre || item?.precio == null) {
            throw new Error('`productoId`, `nombre` y `precio` son obligatorios');
          }
          const existente = this._items.find(i => i.productoId === item.productoId);
          if (existente) {
            existente.cantidad += item.cantidad ?? 1;
          } else {
            this._items.push({
              productoId: item.productoId,
              nombre: item.nombre,
              precio: Number(item.precio),
              cantidad: item.cantidad ?? 1,
            });
          }
          return this._items.map(i => this._formatItem(i));
        },
      },
    );
  }

  /** Quita un ítem del carrito por `productoId`. */
  quitarItem(productoId) {
    return this._simulateCall(
      'quitarItem',
      { productoId },
      {
        successEvent: 'ac-api-carrito-remove-success',
        errorEvent: 'ac-api-carrito-remove-error',
        resolveData: () => {
          this._requireMockItem(productoId);
          this._items = this._items.filter(i => i.productoId !== productoId);
          return this._items.map(i => this._formatItem(i));
        },
      },
    );
  }

  /** Lista los ítems del carrito, con soporte de `queryParams` (orden, paginado, proyección). */
  listarItems(queryParams = {}) {
    return this._simulateCall(
      'listarItems',
      { queryParams },
      {
        successEvent: 'ac-api-carrito-list-success',
        errorEvent: 'ac-api-carrito-list-error',
        resolveData: () =>
          this._applyQueryParams(
            this._items.map(i => this._formatItem(i)),
            queryParams,
          ),
      },
    );
  }

  /** Actualiza la cantidad de un ítem existente. */
  actualizarCantidad(productoId, cantidad) {
    return this._simulateCall(
      'actualizarCantidad',
      { productoId, cantidad },
      {
        successEvent: 'ac-api-carrito-update-quantity-success',
        errorEvent: 'ac-api-carrito-update-quantity-error',
        errorMessage: 'La cantidad debe ser mayor a 0',
        resolveData: () => {
          const item = this._requireMockItem(productoId);
          if (!(cantidad > 0)) {
            throw new Error('La cantidad debe ser mayor a 0');
          }
          item.cantidad = cantidad;
          return this._formatItem(item);
        },
      },
    );
  }

  /** Vacía el carrito por completo. */
  vaciarCarrito() {
    return this._simulateCall(
      'vaciarCarrito',
      {},
      {
        successEvent: 'ac-api-carrito-clear-success',
        errorEvent: 'ac-api-carrito-clear-error',
        resolveData: () => {
          this._items = [];
          return { cleared: true };
        },
      },
    );
  }

  /** Obtiene un resumen con subtotal, impuestos y total. */
  obtenerResumen() {
    return this._simulateCall(
      'obtenerResumen',
      {},
      {
        successEvent: 'ac-api-carrito-summary-success',
        errorEvent: 'ac-api-carrito-summary-error',
        resolveData: () => this._formatSummary(),
      },
    );
  }

  _requireMockItem(productoId) {
    const item = this._items.find(i => i.productoId === productoId);
    if (!item) {
      throw new Error(`El producto ${productoId} no está en el carrito`);
    }
    return item;
  }

  _formatItem(item) {
    return { ...item, subtotal: this._formatAmount(item.precio * item.cantidad) };
  }

  _formatSummary() {
    const subtotal = this._items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const impuestos = subtotal * TAX_RATE;
    return {
      items: this._items.map(i => this._formatItem(i)),
      subtotal: this._formatAmount(subtotal),
      impuestos: this._formatAmount(impuestos),
      total: this._formatAmount(subtotal + impuestos),
    };
  }

  _formatAmount(amount) {
    return Number(amount.toFixed(2));
  }

  /** Orden + paginado + proyección de campos, compartido por `listarItems`. */
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
    return result.map(item =>
      Object.fromEntries(queryParams.fields.map(field => [field, item[field]])),
    );
  }
}
