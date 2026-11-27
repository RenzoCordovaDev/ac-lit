import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_INSURANCE_PRODUCTS = [
  { id: 1, nombre: 'Seguro de Vida', tipo: 'vida', primaMensual: 45 },
  { id: 2, nombre: 'Seguro Vehicular', tipo: 'vehicular', primaMensual: 120 },
  { id: 3, nombre: 'Seguro de Hogar', tipo: 'hogar', primaMensual: 60 },
  { id: 4, nombre: 'Seguro de Viaje', tipo: 'viaje', primaMensual: 25 },
];

const MOCK_POLICIES = [
  {
    id: 1,
    productoId: 1,
    numeroPoliza: 'POL-0001',
    vigenciaDesde: '2024-01-01',
    vigenciaHasta: '2025-01-01',
    estado: 'vigente',
  },
];

/**
 * `ac-api-seguros` - simulador de API de cotización y contratación de seguros, sin UI.
 * Se declara en el `render()` de otro componente y se invoca a través de sus
 * métodos públicos, cada uno con `Promise` + evento `ac-api-seguros-<acción>-<resultado>`.
 */
export class ApiSeguros extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-seguros';
  }

  constructor() {
    super();
    this._products = MOCK_INSURANCE_PRODUCTS.map(product => ({ ...product }));
    this._policies = MOCK_POLICIES.map(policy => ({ ...policy }));
    this._nextPolicyId = 2;
  }

  /** Lista el catálogo de seguros, con filtro por tipo. */
  listarProductos(queryParams = {}) {
    return this._simulateCall('listarProductos', queryParams, {
      successEvent: 'ac-api-seguros-products-success',
      errorEvent: 'ac-api-seguros-products-error',
      resolveData: () => this._applyQueryParams(this._products, queryParams, ['tipo']),
    });
  }

  /** Estima la prima mensual de un producto según el factor de riesgo. */
  cotizar(productoId, datos) {
    return this._simulateCall(
      'cotizar',
      { productoId, datos },
      {
        successEvent: 'ac-api-seguros-quote-success',
        errorEvent: 'ac-api-seguros-quote-error',
        resolveData: () => {
          const product = this._requireMockProduct(productoId);
          const factorRiesgo = datos?.factorRiesgo ?? 1;
          const primaEstimada = Number((product.primaMensual * factorRiesgo).toFixed(2));
          return { productoId: product.id, primaEstimada };
        },
      },
    );
  }

  /** Crea una póliza vigente por un año. */
  contratarSeguro(productoId, datos) {
    return this._simulateCall(
      'contratarSeguro',
      { productoId, datos },
      {
        successEvent: 'ac-api-seguros-subscribe-success',
        errorEvent: 'ac-api-seguros-subscribe-error',
        resolveData: () => {
          const product = this._requireMockProduct(productoId);
          const desde = new Date();
          const hasta = new Date(desde);
          hasta.setUTCFullYear(desde.getUTCFullYear() + 1);
          // Si el 29 de febrero desborda a marzo, usa el último día de febrero.
          if (hasta.getUTCMonth() !== desde.getUTCMonth()) {
            hasta.setUTCDate(0);
          }
          const id = this._nextPolicyId++;
          const policy = {
            id,
            productoId: product.id,
            numeroPoliza: `POL-${String(id).padStart(4, '0')}`,
            vigenciaDesde: desde.toISOString().slice(0, 10),
            vigenciaHasta: hasta.toISOString().slice(0, 10),
            estado: 'vigente',
          };
          this._policies.push(policy);
          return { ...policy };
        },
      },
    );
  }

  /** Lista las pólizas de la instancia, con filtros por estado y producto. */
  listarPolizas(queryParams = {}) {
    return this._simulateCall('listarPolizas', queryParams, {
      successEvent: 'ac-api-seguros-policies-success',
      errorEvent: 'ac-api-seguros-policies-error',
      resolveData: () =>
        this._applyQueryParams(this._policies, queryParams, ['estado', 'productoId']),
    });
  }

  /** Cancela una póliza vigente y registra el motivo. */
  cancelarPoliza(polizaId, motivo) {
    return this._simulateCall(
      'cancelarPoliza',
      { polizaId, motivo },
      {
        successEvent: 'ac-api-seguros-cancel-success',
        errorEvent: 'ac-api-seguros-cancel-error',
        resolveData: () => {
          const policy = this._requireMockPolicy(polizaId);
          if (policy.estado === 'cancelada') {
            throw new Error(`La póliza ${polizaId} ya está cancelada`);
          }
          policy.estado = 'cancelada';
          policy.motivoCancelacion = motivo;
          return { ...policy };
        },
      },
    );
  }

  _requireMockProduct(id) {
    const product = this._products.find(item => item.id === Number(id));
    if (!product) {
      throw new Error(`El producto ${id} no existe en el mock`);
    }
    return product;
  }

  _requireMockPolicy(id) {
    const policy = this._policies.find(item => item.id === Number(id));
    if (!policy) {
      throw new Error(`La póliza ${id} no existe en el mock`);
    }
    return policy;
  }

  /** Aplica los filtros de dominio (`filterKeys`), orden y paginado de una consulta. */
  _applyQueryParams(list, queryParams, filterKeys) {
    const { sortBy, sortDir, pagination, page = 1 } = queryParams;
    let result = [...list];

    filterKeys.forEach(filterKey => {
      const value = queryParams[filterKey];
      if (value) {
        result = result.filter(item => String(item[filterKey]) === String(value));
      }
    });

    if (sortBy) {
      const dir = sortDir === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) return dir;
        if (a[sortBy] < b[sortBy]) return -dir;
        return 0;
      });
    }

    if (pagination) {
      const pageSize = Number(pagination);
      const start = (Number(page) - 1) * pageSize;
      result = result.slice(start, start + pageSize);
    }

    return result.map(item => ({ ...item }));
  }
}
