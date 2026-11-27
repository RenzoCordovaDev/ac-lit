import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_ACCOUNT_TYPES = [
  { id: 1, nombre: 'Cuenta de Ahorros', moneda: 'PEN', tasaInteres: 2.5 },
  { id: 2, nombre: 'Cuenta Corriente', moneda: 'PEN', tasaInteres: 0 },
  { id: 3, nombre: 'Cuenta Sueldo', moneda: 'PEN', tasaInteres: 1.0 },
];

const MOCK_ACCOUNTS = [
  {
    id: 1,
    tipoId: 1,
    alias: 'Mis ahorros',
    moneda: 'PEN',
    estado: 'activa',
    fechaApertura: '2024-01-15',
  },
  {
    id: 2,
    tipoId: 2,
    alias: 'Gastos diarios',
    moneda: 'PEN',
    estado: 'activa',
    fechaApertura: '2024-03-10',
  },
];

/**
 * `ac-api-cuentas` - simulador de API del ciclo de vida de cuentas bancarias, sin UI.
 * Se declara en el `render()` de otro componente y se invoca a través de sus
 * métodos públicos, cada uno con `Promise` + evento `ac-api-cuentas-<acción>-<resultado>`.
 */
export class ApiCuentas extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-cuentas';
  }

  constructor() {
    super();
    this._accountTypes = MOCK_ACCOUNT_TYPES.map(type => ({ ...type }));
    this._accounts = MOCK_ACCOUNTS.map(account => ({ ...account }));
    this._nextAccountId = Math.max(...this._accounts.map(account => account.id)) + 1;
  }

  /** Lista los tipos de cuenta disponibles. */
  listarTiposCuenta() {
    return this._simulateCall(
      'listarTiposCuenta',
      {},
      {
        successEvent: 'ac-api-cuentas-types-success',
        errorEvent: 'ac-api-cuentas-types-error',
        resolveData: () => this._accountTypes.map(type => ({ ...type })),
      },
    );
  }

  /** Lista las cuentas del mock, con soporte de `queryParams`. */
  listarCuentas(queryParams = {}) {
    return this._simulateCall(
      'listarCuentas',
      { queryParams },
      {
        successEvent: 'ac-api-cuentas-list-success',
        errorEvent: 'ac-api-cuentas-list-error',
        resolveData: () =>
          this._applyQueryParams(this._accounts, queryParams).map(account => ({
            ...account,
          })),
      },
    );
  }

  /** Abre una cuenta activa de un tipo existente. */
  abrirCuenta(tipoId, alias) {
    return this._simulateCall(
      'abrirCuenta',
      { tipoId, alias },
      {
        successEvent: 'ac-api-cuentas-open-success',
        errorEvent: 'ac-api-cuentas-open-error',
        resolveData: () => {
          const type = this._accountTypes.find(type => type.id === Number(tipoId));
          if (!type) {
            throw new Error(`El tipo de cuenta ${tipoId} no existe en el mock`);
          }
          const account = {
            id: this._nextAccountId++,
            tipoId: type.id,
            alias,
            moneda: type.moneda,
            estado: 'activa',
            fechaApertura: new Date().toISOString().slice(0, 10),
          };
          this._accounts.push(account);
          return { ...account };
        },
      },
    );
  }

  /** Cambia el alias de una cuenta activa o bloqueada. */
  actualizarAlias(cuentaId, alias) {
    return this._simulateCall(
      'actualizarAlias',
      { cuentaId, alias },
      {
        successEvent: 'ac-api-cuentas-rename-success',
        errorEvent: 'ac-api-cuentas-rename-error',
        resolveData: () => {
          const account = this._requireMockAccount(cuentaId);
          if (account.estado === 'cerrada') {
            throw new Error(`La cuenta ${cuentaId} ya está cerrada`);
          }
          account.alias = alias;
          return { ...account };
        },
      },
    );
  }

  /** Bloquea una cuenta activa y registra el motivo. */
  bloquearCuenta(cuentaId, motivo) {
    return this._simulateCall(
      'bloquearCuenta',
      { cuentaId, motivo },
      {
        successEvent: 'ac-api-cuentas-block-success',
        errorEvent: 'ac-api-cuentas-block-error',
        resolveData: () => {
          const account = this._requireMockAccount(cuentaId);
          if (account.estado === 'bloqueada' || account.estado === 'cerrada') {
            throw new Error(`La cuenta ${cuentaId} ya está ${account.estado}`);
          }
          account.estado = 'bloqueada';
          account.motivoBloqueo = motivo;
          return { ...account };
        },
      },
    );
  }

  /** Cierra una cuenta activa o bloqueada. */
  cerrarCuenta(cuentaId) {
    return this._simulateCall(
      'cerrarCuenta',
      { cuentaId },
      {
        successEvent: 'ac-api-cuentas-close-success',
        errorEvent: 'ac-api-cuentas-close-error',
        resolveData: () => {
          const account = this._requireMockAccount(cuentaId);
          if (account.estado === 'cerrada') {
            throw new Error(`La cuenta ${cuentaId} ya está cerrada`);
          }
          account.estado = 'cerrada';
          return { ...account };
        },
      },
    );
  }

  _requireMockAccount(id) {
    const account = this._accounts.find(account => account.id === Number(id));
    if (!account) {
      throw new Error(`La cuenta ${id} no existe en el mock`);
    }
    return account;
  }

  /** Filtra, ordena y pagina las cuentas de `listarCuentas`. */
  _applyQueryParams(list, queryParams = {}) {
    let result = [...list];

    if (queryParams.estado) {
      result = result.filter(account => account.estado === queryParams.estado);
    }

    if (queryParams.tipoId != null) {
      const tipoId = Number(queryParams.tipoId);
      result = result.filter(account => account.tipoId === tipoId);
    }

    if (queryParams.sortBy) {
      const { sortBy, sortDir } = queryParams;
      const dir = sortDir === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        if (a[sortBy] === b[sortBy]) return 0;
        return a[sortBy] > b[sortBy] ? dir : -dir;
      });
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
