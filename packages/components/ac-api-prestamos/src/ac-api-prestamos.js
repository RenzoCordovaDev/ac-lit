import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_LOAN_PRODUCTS = [
  { id: 1, nombre: 'Préstamo Personal', tasaAnual: 18, montoMax: 20000, plazoMaxMeses: 36 },
  { id: 2, nombre: 'Préstamo Vehicular', tasaAnual: 14, montoMax: 60000, plazoMaxMeses: 60 },
];

const MOCK_LOANS = [
  {
    id: 1,
    productoId: 1,
    montoTotal: 6000,
    cuotasTotales: 12,
    cuotasPagadas: 3,
    cuotaMonto: 550,
    proximoPago: '2024-05-01',
    estado: 'activo',
  },
];

/**
 * `ac-api-prestamos` - simulador de API de préstamos, sin UI.
 * Mismo contrato que `ac-api-operaciones`: se declara en el `render()` de otro
 * componente y se invoca a través de sus métodos públicos, cada uno con
 * `Promise` + evento `ac-api-prestamos-<acción>-<resultado>`.
 */
export class ApiPrestamos extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-prestamos';
  }

  constructor() {
    super();
    this._products = MOCK_LOAN_PRODUCTS.map(product => ({ ...product }));
    this._loans = MOCK_LOANS.map(loan => ({ ...loan }));
    this._nextLoanId = Math.max(0, ...this._loans.map(loan => loan.id)) + 1;
  }

  /** Lista los productos de préstamo disponibles, con soporte de `queryParams`. */
  listarProductos(queryParams = {}) {
    return this._simulateCall(
      'listarProductos',
      { queryParams },
      {
        successEvent: 'ac-api-prestamos-products-success',
        errorEvent: 'ac-api-prestamos-products-error',
        resolveData: () =>
          this._applyQueryParams(
            this._products.map(product => ({ ...product })),
            queryParams,
          ),
      },
    );
  }

  /** Calcula una cuota estimada para un producto, monto y plazo, sin crear nada. */
  simularPrestamo(productoId, monto, plazoMeses) {
    return this._simulateCall(
      'simularPrestamo',
      { productoId, monto, plazoMeses },
      {
        successEvent: 'ac-api-prestamos-simulate-success',
        errorEvent: 'ac-api-prestamos-simulate-error',
        resolveData: () => {
          const producto = this._requireProduct(productoId);
          const solicitud = this._validateRequest(producto, monto, plazoMeses);
          return this._buildQuote(producto, solicitud);
        },
      },
    );
  }

  /** Solicita un préstamo nuevo: valida igual que `simularPrestamo` y lo registra como activo. */
  solicitarPrestamo(productoId, monto, plazoMeses) {
    return this._simulateCall(
      'solicitarPrestamo',
      { productoId, monto, plazoMeses },
      {
        successEvent: 'ac-api-prestamos-request-success',
        errorEvent: 'ac-api-prestamos-request-error',
        resolveData: () => {
          const producto = this._requireProduct(productoId);
          const solicitud = this._validateRequest(producto, monto, plazoMeses);
          const cotizacion = this._buildQuote(producto, solicitud);
          const prestamo = {
            id: this._nextLoanId++,
            productoId: producto.id,
            montoTotal: cotizacion.montoTotal,
            cuotasTotales: solicitud.plazoMeses,
            cuotasPagadas: 0,
            cuotaMonto: cotizacion.cuotaMonto,
            proximoPago: this._addMonths(new Date().toISOString().slice(0, 10), 1),
            estado: 'activo',
          };
          this._loans.push(prestamo);
          return { ...prestamo };
        },
      },
    );
  }

  /** Lista los préstamos, con filtros `estado`/`productoId` y soporte de sort/pagination. */
  listarPrestamos(queryParams = {}) {
    return this._simulateCall(
      'listarPrestamos',
      { queryParams },
      {
        successEvent: 'ac-api-prestamos-list-success',
        errorEvent: 'ac-api-prestamos-list-error',
        resolveData: () =>
          this._applyQueryParams(
            this._loans.map(loan => ({ ...loan })),
            queryParams,
            ['estado', 'productoId'],
          ),
      },
    );
  }

  /** Registra el pago de la siguiente cuota; si es la última, el préstamo pasa a `pagado`. */
  pagarCuota(prestamoId) {
    return this._simulateCall(
      'pagarCuota',
      { prestamoId },
      {
        successEvent: 'ac-api-prestamos-pay-success',
        errorEvent: 'ac-api-prestamos-pay-error',
        resolveData: () => {
          const prestamo = this._requireLoan(prestamoId);
          if (prestamo.cuotasPagadas >= prestamo.cuotasTotales) {
            throw new Error(`El préstamo ${prestamo.id} no tiene cuotas pendientes`);
          }
          prestamo.cuotasPagadas += 1;
          if (prestamo.cuotasPagadas === prestamo.cuotasTotales) {
            prestamo.estado = 'pagado';
          }
          return { ...prestamo };
        },
      },
    );
  }

  /** Devuelve el cronograma de cuotas de un préstamo (pagadas y pendientes). */
  obtenerCronograma(prestamoId) {
    return this._simulateCall(
      'obtenerCronograma',
      { prestamoId },
      {
        successEvent: 'ac-api-prestamos-schedule-success',
        errorEvent: 'ac-api-prestamos-schedule-error',
        resolveData: () => {
          const prestamo = this._requireLoan(prestamoId);
          return Array.from({ length: prestamo.cuotasTotales }, (_, index) => {
            const numero = index + 1;
            return {
              numero,
              fecha: this._addMonths(prestamo.proximoPago, index),
              monto: prestamo.cuotaMonto,
              estado: numero <= prestamo.cuotasPagadas ? 'pagada' : 'pendiente',
            };
          });
        },
      },
    );
  }

  _requireProduct(id) {
    const producto = this._products.find(product => product.id === Number(id));
    if (!producto) {
      throw new Error(`El producto ${id} no existe en el mock`);
    }
    return producto;
  }

  _requireLoan(id) {
    const prestamo = this._loans.find(loan => loan.id === Number(id));
    if (!prestamo) {
      throw new Error(`El préstamo ${id} no existe en el mock`);
    }
    return prestamo;
  }

  /** Valida monto y plazo contra el producto; devuelve los valores numéricos. */
  _validateRequest(producto, monto, plazoMeses) {
    const valor = Number(monto);
    const plazo = Number(plazoMeses);
    if (!(valor > 0) || !(plazo > 0)) {
      throw new Error('El monto y el plazo deben ser mayores a cero');
    }
    if (valor > producto.montoMax) {
      throw new Error(
        `El monto ${valor} supera el máximo de ${producto.montoMax} para ${producto.nombre}`,
      );
    }
    if (plazo > producto.plazoMaxMeses) {
      throw new Error(
        `El plazo de ${plazo} meses supera el máximo de ${producto.plazoMaxMeses} para ${producto.nombre}`,
      );
    }
    return { monto: valor, plazoMeses: plazo };
  }

  /** Interés simple sobre `tasaAnual`: interés = monto * tasa * (plazo/12); cuota = (monto + interés) / plazo. */
  _buildQuote(producto, { monto, plazoMeses }) {
    const interesTotal = this._round2(monto * (producto.tasaAnual / 100) * (plazoMeses / 12));
    const montoTotal = this._round2(monto + interesTotal);
    return {
      productoId: producto.id,
      nombre: producto.nombre,
      tasaAnual: producto.tasaAnual,
      monto,
      plazoMeses,
      interesTotal,
      montoTotal,
      cuotaMonto: this._round2(montoTotal / plazoMeses),
    };
  }

  _addMonths(isoDate, months) {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1 + months, day)).toISOString().slice(0, 10);
  }

  _round2(amount) {
    return Number(amount.toFixed(2));
  }

  /** Filtros por igualdad (`filterKeys`), orden y paginado, compartido por los listados. */
  _applyQueryParams(list, queryParams = {}, filterKeys = []) {
    let result = [...list];

    for (const key of filterKeys) {
      if (queryParams[key] != null && queryParams[key] !== '') {
        result = result.filter(item => String(item[key]) === String(queryParams[key]));
      }
    }

    if (queryParams.sortBy) {
      const dir = queryParams.sortDir === 'desc' ? -1 : 1;
      result = result.sort((a, b) => (a[queryParams.sortBy] > b[queryParams.sortBy] ? dir : -dir));
    }

    if (queryParams.pagination) {
      const pageSize = Number(queryParams.pagination);
      const page = Number(queryParams.page ?? 1);
      const start = (page - 1) * pageSize;
      result = result.slice(start, start + pageSize);
    }

    return result;
  }
}
