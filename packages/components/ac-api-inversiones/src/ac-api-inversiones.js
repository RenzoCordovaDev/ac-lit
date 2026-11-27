import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_INVESTMENT_PRODUCTS = [
  {
    id: 1,
    nombre: 'Depósito a Plazo 90 días',
    tipo: 'plazo_fijo',
    tasaAnual: 6.5,
    montoMinimo: 500,
    plazoDias: 90,
  },
  {
    id: 2,
    nombre: 'Fondo Mutuo Renta Mixta',
    tipo: 'fondo_mutuo',
    tasaAnual: 9,
    montoMinimo: 200,
    plazoDias: 0,
  },
];

const MOCK_INVESTMENTS = [
  {
    id: 1,
    productoId: 1,
    montoInvertido: 1000,
    fechaInicio: '2024-01-01',
    fechaVencimiento: '2024-04-01',
    estado: 'activa',
  },
];

const MS_POR_DIA = 24 * 60 * 60 * 1000;

/**
 * `ac-api-inversiones` - simulador de API de inversiones (depósitos a plazo y
 * fondos mutuos), sin UI. Mismo contrato que `ac-api-operaciones`: se declara en
 * el `render()` de otro componente y se invoca a través de sus métodos públicos,
 * cada uno con `Promise` + evento `ac-api-inversiones-<acción>-<resultado>`.
 */
export class ApiInversiones extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-inversiones';
  }

  constructor() {
    super();
    this._products = MOCK_INVESTMENT_PRODUCTS.map(product => ({ ...product }));
    this._investments = MOCK_INVESTMENTS.map(investment => ({ ...investment }));
    this._nextInvestmentId = this._investments.length + 1;
  }

  /** Lista los productos de inversión, con soporte de `queryParams`. */
  listarProductos(queryParams = {}) {
    return this._simulateCall(
      'listarProductos',
      { queryParams },
      {
        successEvent: 'ac-api-inversiones-products-success',
        errorEvent: 'ac-api-inversiones-products-error',
        resolveData: () => {
          const productos = queryParams.tipo
            ? this._products.filter(product => product.tipo === queryParams.tipo)
            : this._products;
          return this._applyQueryParams(
            productos.map(product => ({ ...product })),
            queryParams,
          );
        },
      },
    );
  }

  /** Calcula la rentabilidad estimada de un monto en un producto, sin crear inversión. */
  simularRentabilidad(productoId, monto, plazoDias) {
    return this._simulateCall(
      'simularRentabilidad',
      { productoId, monto, plazoDias },
      {
        successEvent: 'ac-api-inversiones-simulate-success',
        errorEvent: 'ac-api-inversiones-simulate-error',
        resolveData: () => {
          const producto = this._requireProduct(productoId);
          this._validateMonto(producto, monto);
          const rentabilidad = this._calcularRentabilidad(
            Number(monto),
            producto.tasaAnual,
            plazoDias,
          );
          return {
            productoId: producto.id,
            montoFinal: this._round(Number(monto) + rentabilidad),
            rentabilidad: this._round(rentabilidad),
          };
        },
      },
    );
  }

  /** Crea una inversión nueva en un producto, con inicio hoy y vencimiento según su plazo. */
  suscribirInversion(productoId, monto) {
    return this._simulateCall(
      'suscribirInversion',
      { productoId, monto },
      {
        successEvent: 'ac-api-inversiones-subscribe-success',
        errorEvent: 'ac-api-inversiones-subscribe-error',
        resolveData: () => {
          const producto = this._requireProduct(productoId);
          this._validateMonto(producto, monto);
          const hoy = new Date();
          const inversion = {
            id: this._nextInvestmentId++,
            productoId: producto.id,
            montoInvertido: Number(monto),
            fechaInicio: this._toDateString(hoy),
            fechaVencimiento:
              producto.plazoDias > 0
                ? this._toDateString(this._addDays(hoy, producto.plazoDias))
                : null,
            estado: 'activa',
          };
          this._investments.push(inversion);
          return { ...inversion };
        },
      },
    );
  }

  /** Lista las inversiones, con soporte de `queryParams`. */
  listarInversiones(queryParams = {}) {
    return this._simulateCall(
      'listarInversiones',
      { queryParams },
      {
        successEvent: 'ac-api-inversiones-list-success',
        errorEvent: 'ac-api-inversiones-list-error',
        resolveData: () => {
          const inversiones = this._investments.filter(
            inversion =>
              (!queryParams.estado || inversion.estado === queryParams.estado) &&
              (!queryParams.productoId || inversion.productoId === Number(queryParams.productoId)),
          );
          return this._applyQueryParams(
            inversiones.map(inversion => ({ ...inversion })),
            queryParams,
          );
        },
      },
    );
  }

  /** Rescata una inversión activa: devuelve principal + rentabilidad al día de hoy. */
  rescatarInversion(inversionId) {
    return this._simulateCall(
      'rescatarInversion',
      { inversionId },
      {
        successEvent: 'ac-api-inversiones-redeem-success',
        errorEvent: 'ac-api-inversiones-redeem-error',
        resolveData: () => {
          const inversion = this._requireInvestment(inversionId);
          if (inversion.estado === 'rescatada') {
            throw new Error(`La inversión ${inversionId} ya fue rescatada`);
          }
          const producto = this._requireProduct(inversion.productoId);
          const diasTranscurridos = Math.max(
            0,
            Math.floor((Date.now() - this._parseDateString(inversion.fechaInicio)) / MS_POR_DIA),
          );
          const rentabilidad = this._calcularRentabilidad(
            inversion.montoInvertido,
            producto.tasaAnual,
            diasTranscurridos,
          );
          inversion.estado = 'rescatada';
          return {
            inversionId: inversion.id,
            montoInvertido: inversion.montoInvertido,
            diasTranscurridos,
            rentabilidad: this._round(rentabilidad),
            montoFinal: this._round(inversion.montoInvertido + rentabilidad),
            estado: inversion.estado,
          };
        },
      },
    );
  }

  _requireProduct(id) {
    const product = this._products.find(p => p.id === Number(id));
    if (!product) {
      throw new Error(`El producto ${id} no existe en el mock`);
    }
    return product;
  }

  _requireInvestment(id) {
    const investment = this._investments.find(i => i.id === Number(id));
    if (!investment) {
      throw new Error(`La inversión ${id} no existe en el mock`);
    }
    return investment;
  }

  _validateMonto(producto, monto) {
    if (Number(monto) < producto.montoMinimo) {
      throw new Error(`El monto mínimo para ${producto.nombre} es ${producto.montoMinimo}`);
    }
  }

  /** Rentabilidad proporcional al plazo: monto * (tasaAnual / 100) * (días / 365). */
  _calcularRentabilidad(monto, tasaAnual, dias) {
    return monto * (tasaAnual / 100) * (Number(dias) / 365);
  }

  _round(amount) {
    return Number(amount.toFixed(2));
  }

  _addDays(date, dias) {
    const result = new Date(date);
    result.setDate(result.getDate() + dias);
    return result;
  }

  /** Fecha local en formato `YYYY-MM-DD`. */
  _toDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Inverso de `_toDateString`: milisegundos de la medianoche local de esa fecha. */
  _parseDateString(dateString) {
    return new Date(`${dateString}T00:00:00`).getTime();
  }

  /** Orden + paginado, compartido por `listarProductos` y `listarInversiones`. */
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

    return result;
  }
}
