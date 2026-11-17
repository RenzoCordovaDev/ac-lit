import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_ACCOUNTS = [
  { id: 1, titular: 'Cuenta principal', saldo: 2500.0, moneda: 'PEN' },
  { id: 2, titular: 'Cuenta de ahorros', saldo: 8000.0, moneda: 'PEN' },
];

// Precio mock por producto, usado solo por `comprar` — este componente no
// depende de `ac-api-productos`, mantiene su propio mock mínimo.
const MOCK_PRICES = { 1: 3499.9, 2: 79.9, 3: 899.0, 4: 120.5, 5: 49.9 };

/**
 * `ac-api-operaciones` - simulador de API de operaciones financieras, sin UI.
 * Mismo contrato que `ac-api-users`: se declara en el `render()` de otro
 * componente y se invoca a través de sus métodos públicos, cada uno con
 * `Promise` + evento `ac-api-operaciones-<acción>-<resultado>`.
 */
export class ApiOperaciones extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-operaciones';
  }

  constructor() {
    super();
    this._accounts = MOCK_ACCOUNTS.map(account => ({ ...account }));
    this._movements = [];
    this._nextMovementId = 1;
    this._nextOperationId = 1;
  }

  /** Consulta el saldo actual de una cuenta. */
  consultarSaldo(cuentaId) {
    return this._simulateCall(
      'consultarSaldo',
      { cuentaId },
      {
        successEvent: 'ac-api-operaciones-balance-success',
        errorEvent: 'ac-api-operaciones-balance-error',
        resolveData: () => this._formatAccount(this._requireMockAccount(cuentaId)),
      },
    );
  }

  /** Lista el historial de movimientos de una cuenta, con soporte de `queryParams`. */
  obtenerHistorial(cuentaId, queryParams = {}) {
    return this._simulateCall(
      'obtenerHistorial',
      { cuentaId, queryParams },
      {
        successEvent: 'ac-api-operaciones-history-success',
        errorEvent: 'ac-api-operaciones-history-error',
        resolveData: () => {
          this._requireMockAccount(cuentaId);
          const movimientos = this._movements.filter(m => m.cuentaId === Number(cuentaId));
          return this._applyQueryParams(
            movimientos.map(m => this._formatMovement(m)),
            queryParams,
          );
        },
      },
    );
  }

  /** Simula la compra de un producto, debitando la cuenta principal (id 1). */
  comprar(productoId, cantidad = 1) {
    return this._simulateCall(
      'comprar',
      { productoId, cantidad },
      {
        successEvent: 'ac-api-operaciones-buy-success',
        errorEvent: 'ac-api-operaciones-buy-error',
        resolveData: () => {
          const precioUnitario = MOCK_PRICES[productoId];
          if (precioUnitario == null) {
            throw new Error(`El producto ${productoId} no existe en el mock de precios`);
          }
          const total = Number((precioUnitario * cantidad).toFixed(2));
          const cuenta = this._requireMockAccount(1);
          if (cuenta.saldo < total) {
            throw new Error('Saldo insuficiente para completar la compra');
          }
          cuenta.saldo = Number((cuenta.saldo - total).toFixed(2));
          this._recordMovement(
            cuenta.id,
            'compra',
            -total,
            `Compra producto ${productoId} x${cantidad}`,
          );
          return { operacionId: this._nextOperationId++, total, estado: 'aprobada' };
        },
      },
    );
  }

  /** Transfiere dinero entre dos cuentas del mock. */
  transferir(cuentaOrigenId, cuentaDestinoId, monto) {
    return this._simulateCall(
      'transferir',
      { cuentaOrigenId, cuentaDestinoId, monto },
      {
        successEvent: 'ac-api-operaciones-transfer-success',
        errorEvent: 'ac-api-operaciones-transfer-error',
        resolveData: () => {
          const origen = this._requireMockAccount(cuentaOrigenId);
          const destino = this._requireMockAccount(cuentaDestinoId);
          const valor = Number(monto);
          if (origen.saldo < valor) {
            throw new Error('Saldo insuficiente para completar la transferencia');
          }
          origen.saldo = Number((origen.saldo - valor).toFixed(2));
          destino.saldo = Number((destino.saldo + valor).toFixed(2));
          this._recordMovement(
            origen.id,
            'transferencia-enviada',
            -valor,
            `Transferencia a cuenta ${destino.id}`,
          );
          this._recordMovement(
            destino.id,
            'transferencia-recibida',
            valor,
            `Transferencia de cuenta ${origen.id}`,
          );
          return {
            operacionId: this._nextOperationId++,
            origen: this._formatAccount(origen),
            destino: this._formatAccount(destino),
            monto: valor,
            estado: 'completada',
          };
        },
      },
    );
  }

  /** Deposita dinero en una cuenta. */
  depositar(cuentaId, monto) {
    return this._simulateCall(
      'depositar',
      { cuentaId, monto },
      {
        successEvent: 'ac-api-operaciones-deposit-success',
        errorEvent: 'ac-api-operaciones-deposit-error',
        resolveData: () => {
          const cuenta = this._requireMockAccount(cuentaId);
          const valor = Number(monto);
          cuenta.saldo = Number((cuenta.saldo + valor).toFixed(2));
          this._recordMovement(cuenta.id, 'deposito', valor, 'Depósito');
          return this._formatAccount(cuenta);
        },
      },
    );
  }

  /** Retira dinero de una cuenta; falla si no hay saldo suficiente. */
  retirar(cuentaId, monto) {
    return this._simulateCall(
      'retirar',
      { cuentaId, monto },
      {
        successEvent: 'ac-api-operaciones-withdraw-success',
        errorEvent: 'ac-api-operaciones-withdraw-error',
        resolveData: () => {
          const cuenta = this._requireMockAccount(cuentaId);
          const valor = Number(monto);
          if (cuenta.saldo < valor) {
            throw new Error('Saldo insuficiente para completar el retiro');
          }
          cuenta.saldo = Number((cuenta.saldo - valor).toFixed(2));
          this._recordMovement(cuenta.id, 'retiro', -valor, 'Retiro');
          return this._formatAccount(cuenta);
        },
      },
    );
  }

  _requireMockAccount(id) {
    const account = this._accounts.find(a => a.id === Number(id));
    if (!account) {
      throw new Error(`La cuenta ${id} no existe en el mock`);
    }
    return account;
  }

  _recordMovement(cuentaId, tipo, monto, descripcion) {
    this._movements.push({
      id: this._nextMovementId++,
      cuentaId,
      tipo,
      monto,
      descripcion,
      fecha: new Date().toISOString(),
    });
  }

  _formatAccount(account) {
    return {
      cuentaId: account.id,
      titular: account.titular,
      saldo: this._formatAmount(account.saldo),
      moneda: account.moneda,
    };
  }

  _formatMovement(movement) {
    return { ...movement, monto: this._formatAmount(movement.monto) };
  }

  _formatAmount(amount) {
    return Number(amount.toFixed(2));
  }

  /** Orden + paginado + proyección de campos, compartido por `obtenerHistorial`. */
  _applyQueryParams(list, queryParams = {}) {
    let result = [...list];

    if (queryParams.tipo) {
      result = result.filter(movement => movement.tipo === queryParams.tipo);
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

    return result;
  }
}
