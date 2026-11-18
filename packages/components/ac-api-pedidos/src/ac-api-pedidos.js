import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const ESTADOS_SEGUIMIENTO = ['pendiente', 'confirmado', 'en_camino', 'entregado'];

const MOCK_ORDERS = [
  {
    id: 1,
    items: [{ productoId: 1, cantidad: 1 }],
    total: 3499.9,
    estado: 'confirmado',
    fecha: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 2,
    items: [
      { productoId: 2, cantidad: 2 },
      { productoId: 5, cantidad: 1 },
    ],
    total: 209.7,
    estado: 'entregado',
    fecha: '2026-01-05T15:30:00.000Z',
  },
];

/**
 * `ac-api-pedidos` - simulador de API de pedidos, sin UI. Mismo contrato que
 * `ac-api-users`: se declara en el `render()` de otro componente y se invoca
 * a través de sus métodos públicos, cada uno con `Promise` + evento
 * `ac-api-pedidos-<acción>-<resultado>`.
 */
export class ApiPedidos extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-pedidos';
  }

  constructor() {
    super();
    this._orders = MOCK_ORDERS.map(order => ({
      ...order,
      items: order.items.map(item => ({ ...item })),
    }));
    this._nextId = this._orders.length + 1;
  }

  /** Crea un pedido nuevo a partir de un `carrito` (arreglo de `{ productoId, cantidad, precioUnitario }`). */
  crearPedido(carrito) {
    return this._simulateCall(
      'crearPedido',
      { carrito },
      {
        successEvent: 'ac-api-pedidos-create-success',
        errorEvent: 'ac-api-pedidos-create-error',
        errorMessage: 'No se pudo crear el pedido',
        resolveData: () => {
          if (!Array.isArray(carrito) || carrito.length === 0) {
            throw new Error('El carrito debe traer al menos un ítem');
          }
          const nuevoPedido = {
            id: this._nextId++,
            items: carrito.map(item => ({ productoId: item.productoId, cantidad: item.cantidad })),
            total: this._calculateTotal(carrito),
            estado: 'pendiente',
            fecha: new Date().toISOString(),
          };
          this._orders.push(nuevoPedido);
          return this._formatOrder(nuevoPedido);
        },
      },
    );
  }

  /** Obtiene un pedido por id. */
  obtenerPedido(id) {
    return this._simulateCall(
      'obtenerPedido',
      { id },
      {
        successEvent: 'ac-api-pedidos-get-success',
        errorEvent: 'ac-api-pedidos-get-error',
        resolveData: () => this._formatOrder(this._requireMockOrder(id)),
      },
    );
  }

  /** Lista pedidos, con soporte de `queryParams` (paginación, orden, filtro por estado, proyección). */
  listarPedidos(queryParams = {}) {
    return this._simulateCall(
      'listarPedidos',
      { queryParams },
      {
        successEvent: 'ac-api-pedidos-list-success',
        errorEvent: 'ac-api-pedidos-list-error',
        resolveData: () =>
          this._applyQueryParams(
            this._orders.map(order => this._formatOrder(order)),
            queryParams,
          ),
      },
    );
  }

  /** Obtiene el estado de un pedido, con el detalle de seguimiento (pasos). */
  obtenerEstadoPedido(id) {
    return this._simulateCall(
      'obtenerEstadoPedido',
      { id },
      {
        successEvent: 'ac-api-pedidos-get-status-success',
        errorEvent: 'ac-api-pedidos-get-status-error',
        resolveData: () => this._formatOrderStatus(this._requireMockOrder(id)),
      },
    );
  }

  /** Cancela un pedido; falla si ya fue entregado. */
  cancelarPedido(id) {
    return this._simulateCall(
      'cancelarPedido',
      { id },
      {
        successEvent: 'ac-api-pedidos-cancel-success',
        errorEvent: 'ac-api-pedidos-cancel-error',
        errorMessage: 'No se pudo cancelar el pedido',
        resolveData: () => {
          const order = this._requireMockOrder(id);
          if (order.estado === 'entregado') {
            throw new Error('Un pedido ya entregado no se puede cancelar');
          }
          order.estado = 'cancelado';
          return this._formatOrder(order);
        },
      },
    );
  }

  _requireMockOrder(id) {
    const order = this._orders.find(o => o.id === Number(id));
    if (!order) {
      throw new Error(`El pedido ${id} no existe en el mock`);
    }
    return order;
  }

  _calculateTotal(carrito) {
    return Number(
      carrito.reduce((sum, item) => sum + (item.precioUnitario ?? 0) * item.cantidad, 0).toFixed(2),
    );
  }

  _formatOrder(order) {
    return {
      id: order.id,
      items: order.items,
      total: order.total,
      estado: order.estado,
      fecha: order.fecha,
    };
  }

  _formatOrderStatus(order) {
    const stepIndex = Math.max(ESTADOS_SEGUIMIENTO.indexOf(order.estado), 0);
    return {
      id: order.id,
      estado: order.estado,
      seguimiento: {
        pasos: ESTADOS_SEGUIMIENTO.map((paso, index) => ({ paso, completado: index <= stepIndex })),
      },
    };
  }

  /** Filtro por estado + orden + paginado + proyección, compartido por `listarPedidos`. */
  _applyQueryParams(list, queryParams = {}) {
    let result = [...list];

    if (queryParams.status) {
      result = result.filter(order => order.estado === queryParams.status);
    }

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

    return result.map(order => this._applyFieldsParam(order, queryParams));
  }

  _applyFieldsParam(order, queryParams = {}) {
    if (!Array.isArray(queryParams.fields) || queryParams.fields.length === 0) {
      return order;
    }
    return Object.fromEntries(queryParams.fields.map(field => [field, order[field]]));
  }
}
