import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_PRODUCTS = [
  {
    id: 1,
    nombre: 'Laptop Pro 14"',
    precio: 3499.9,
    categoria: 'electronica',
    stock: 12,
    activo: true,
  },
  {
    id: 2,
    nombre: 'Mouse inalámbrico',
    precio: 79.9,
    categoria: 'electronica',
    stock: 54,
    activo: true,
  },
  { id: 3, nombre: 'Silla ergonómica', precio: 899.0, categoria: 'hogar', stock: 8, activo: true },
  {
    id: 4,
    nombre: 'Lámpara de escritorio',
    precio: 120.5,
    categoria: 'hogar',
    stock: 0,
    activo: false,
  },
  { id: 5, nombre: 'Polo algodón', precio: 49.9, categoria: 'ropa', stock: 30, activo: true },
  {
    id: 6,
    nombre: 'Zapatillas running',
    precio: 259.9,
    categoria: 'ropa',
    stock: 15,
    activo: true,
  },
  {
    id: 7,
    nombre: 'Monitor 27" 4K',
    precio: 1199.0,
    categoria: 'electronica',
    stock: 6,
    activo: true,
  },
  {
    id: 8,
    nombre: 'Organizador de escritorio',
    precio: 65.0,
    categoria: 'hogar',
    stock: 20,
    activo: false,
  },
];

/**
 * `ac-api-productos` - simulador de API de productos, sin UI. Mismo contrato
 * que `ac-api-users`: se declara en el `render()` de otro componente y se
 * invoca a través de sus métodos públicos, cada uno con `Promise` + evento
 * `ac-api-productos-<acción>-<resultado>`.
 */
export class ApiProductos extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-productos';
  }

  constructor() {
    super();
    this._products = MOCK_PRODUCTS.map(product => ({ ...product }));
    this._nextId = this._products.length + 1;
  }

  /** Obtiene un producto por id. */
  obtenerProducto(id, queryParams = {}) {
    return this._simulateCall(
      'obtenerProducto',
      { id, queryParams },
      {
        successEvent: 'ac-api-productos-get-product-success',
        errorEvent: 'ac-api-productos-get-product-error',
        resolveData: () =>
          this._applyFieldsParam(this._formatProduct(this._requireMockProduct(id)), queryParams),
      },
    );
  }

  /** Lista productos, con soporte de `queryParams` (paginación, orden, filtro, proyección). */
  listarProductos(queryParams = {}) {
    return this._simulateCall(
      'listarProductos',
      { queryParams },
      {
        successEvent: 'ac-api-productos-list-success',
        errorEvent: 'ac-api-productos-list-error',
        resolveData: () =>
          this._applyQueryParams(
            this._products.map(product => this._formatProduct(product)),
            queryParams,
          ),
      },
    );
  }

  /** Busca productos por nombre, con el mismo soporte de `queryParams` que `listarProductos`. */
  buscarProductos(texto, queryParams = {}) {
    return this._simulateCall(
      'buscarProductos',
      { texto, queryParams },
      {
        successEvent: 'ac-api-productos-search-success',
        errorEvent: 'ac-api-productos-search-error',
        resolveData: () => {
          const needle = (texto ?? '').trim().toLowerCase();
          const matches = this._products.filter(product =>
            product.nombre.toLowerCase().includes(needle),
          );
          return this._applyQueryParams(
            matches.map(product => this._formatProduct(product)),
            queryParams,
          );
        },
      },
    );
  }

  /** Obtiene el detalle extendido de un producto, con datos anidados (especificaciones/inventario). */
  obtenerDetalleProducto(id) {
    return this._simulateCall(
      'obtenerDetalleProducto',
      { id },
      {
        successEvent: 'ac-api-productos-get-detail-success',
        errorEvent: 'ac-api-productos-get-detail-error',
        resolveData: () => this._formatProductDetail(this._requireMockProduct(id)),
      },
    );
  }

  /** Registra (crea) un producto nuevo a partir de `objetoProducto`. */
  registrarProducto(objetoProducto) {
    return this._simulateCall(
      'registrarProducto',
      { objetoProducto },
      {
        successEvent: 'ac-api-productos-register-success',
        errorEvent: 'ac-api-productos-register-error',
        errorMessage: 'No se pudo registrar el producto',
        resolveData: () => {
          if (!objetoProducto?.nombre || objetoProducto?.precio == null) {
            throw new Error('`nombre` y `precio` son obligatorios para registrar un producto');
          }
          const nuevoProducto = {
            id: this._nextId++,
            nombre: objetoProducto.nombre,
            precio: Number(objetoProducto.precio),
            categoria: objetoProducto.categoria ?? 'general',
            stock: Number(objetoProducto.stock ?? 0),
            activo: true,
          };
          this._products.push(nuevoProducto);
          return this._formatProduct(nuevoProducto);
        },
      },
    );
  }

  /** Actualiza (edita) un producto existente, mezclando `cambios` sobre el registro actual. */
  actualizarProducto(id, cambios = {}) {
    return this._simulateCall(
      'actualizarProducto',
      { id, cambios },
      {
        successEvent: 'ac-api-productos-update-success',
        errorEvent: 'ac-api-productos-update-error',
        resolveData: () => {
          const product = this._requireMockProduct(id);
          Object.assign(product, cambios, { id: product.id });
          return this._formatProduct(product);
        },
      },
    );
  }

  /** Elimina un producto por id. */
  eliminarProducto(id) {
    return this._simulateCall(
      'eliminarProducto',
      { id },
      {
        successEvent: 'ac-api-productos-delete-success',
        errorEvent: 'ac-api-productos-delete-error',
        resolveData: () => {
          this._requireMockProduct(id);
          this._products = this._products.filter(product => product.id !== id);
          return { id, deleted: true };
        },
      },
    );
  }

  _requireMockProduct(id) {
    const product = this._products.find(p => p.id === Number(id));
    if (!product) {
      throw new Error(`El producto ${id} no existe en el mock`);
    }
    return product;
  }

  _formatProduct(product) {
    return {
      id: product.id,
      nombre: product.nombre,
      precio: this._formatProductPrice(product),
      categoria: product.categoria,
      stock: product.stock,
      activo: product.activo,
    };
  }

  _formatProductDetail(product) {
    return {
      ...this._formatProduct(product),
      especificaciones: this._formatProductSpecs(product),
      inventario: { stock: product.stock, bodega: `Bodega ${(product.id % 3) + 1}` },
    };
  }

  _formatProductPrice(product) {
    return Number(product.precio.toFixed(2));
  }

  _formatProductSpecs(product) {
    return { peso: `${(product.id * 0.3).toFixed(1)} kg`, dimensiones: '30 x 20 x 10 cm' };
  }

  /** Filtro + orden + paginado + proyección de campos, compartido por listar/buscar. */
  _applyQueryParams(list, queryParams = {}) {
    let result = [...list];

    if (queryParams.category) {
      result = result.filter(product => product.categoria === queryParams.category);
    }
    if (queryParams.status === 'active' || queryParams.activo === true) {
      result = result.filter(product => product.activo);
    }
    if (queryParams.status === 'inactive' || queryParams.activo === false) {
      result = result.filter(product => !product.activo);
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

    return result.map(product => this._applyFieldsParam(product, queryParams));
  }

  _applyFieldsParam(product, queryParams = {}) {
    if (!Array.isArray(queryParams.fields) || queryParams.fields.length === 0) {
      return product;
    }
    return Object.fromEntries(queryParams.fields.map(field => [field, product[field]]));
  }
}
