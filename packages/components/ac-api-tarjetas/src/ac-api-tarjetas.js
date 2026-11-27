import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_CREDIT_LIMIT = 5000;
const MOCK_TITULAR = 'Cliente Demo';
const MOCK_CARDS = [
  {
    id: 1,
    cuentaId: 1,
    tipo: 'debito',
    marca: 'Visa',
    ultimos4: '4321',
    titular: 'Cliente Demo',
    estado: 'activa',
  },
  {
    id: 2,
    cuentaId: 2,
    tipo: 'credito',
    marca: 'Mastercard',
    ultimos4: '8765',
    titular: 'Cliente Demo',
    estado: 'activa',
    lineaCredito: MOCK_CREDIT_LIMIT,
    disponible: 3200,
  },
];

const MOCK_PIN = '1234';

/**
 * `ac-api-tarjetas` - simulador de API de tarjetas de débito y crédito, sin UI.
 * Mismo contrato que `ac-api-operaciones`: se declara en el `render()` de otro
 * componente y se invoca a través de sus métodos públicos, cada uno con
 * `Promise` + evento `ac-api-tarjetas-<acción>-<resultado>`.
 */
export class ApiTarjetas extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-tarjetas';
  }

  constructor() {
    super();
    this._cards = MOCK_CARDS.map(card => ({ ...card }));
    this._nextCardId = Math.max(...this._cards.map(card => card.id)) + 1;
  }

  /** Lista las tarjetas del mock, con soporte de `queryParams`. */
  listarTarjetas(queryParams = {}) {
    return this._simulateCall(
      'listarTarjetas',
      { queryParams },
      {
        successEvent: 'ac-api-tarjetas-list-success',
        errorEvent: 'ac-api-tarjetas-list-error',
        resolveData: () =>
          this._applyQueryParams(this._cards, queryParams).map(card => ({ ...card })),
      },
    );
  }

  /** Solicita una tarjeta de débito o crédito para una cuenta conocida. */
  solicitarTarjeta(cuentaId, tipo) {
    return this._simulateCall(
      'solicitarTarjeta',
      { cuentaId, tipo },
      {
        successEvent: 'ac-api-tarjetas-request-success',
        errorEvent: 'ac-api-tarjetas-request-error',
        resolveData: () => {
          // La cuenta no se valida contra otro componente: solo el tipo.
          if (tipo !== 'debito' && tipo !== 'credito') {
            throw new Error(`El tipo de tarjeta ${tipo} no existe en el mock`);
          }

          const id = this._nextCardId++;
          const tarjeta = {
            id,
            cuentaId: Number(cuentaId),
            tipo,
            marca: 'Visa',
            ultimos4: String(id).slice(-4).padStart(4, '0'),
            titular: MOCK_TITULAR,
            estado: 'activa',
          };

          if (tipo === 'credito') {
            tarjeta.lineaCredito = MOCK_CREDIT_LIMIT;
            tarjeta.disponible = MOCK_CREDIT_LIMIT;
          }

          this._cards.push(tarjeta);
          return { ...tarjeta };
        },
      },
    );
  }

  /** Bloquea una tarjeta activa. */
  bloquearTarjeta(tarjetaId, motivo) {
    return this._simulateCall(
      'bloquearTarjeta',
      { tarjetaId, motivo },
      {
        successEvent: 'ac-api-tarjetas-block-success',
        errorEvent: 'ac-api-tarjetas-block-error',
        resolveData: () => {
          const tarjeta = this._requireMockCard(tarjetaId);
          if (tarjeta.estado === 'bloqueada') {
            throw new Error(`La tarjeta ${tarjetaId} ya está bloqueada`);
          }
          tarjeta.estado = 'bloqueada';
          return { ...tarjeta };
        },
      },
    );
  }

  /** Reactiva una tarjeta bloqueada. */
  desbloquearTarjeta(tarjetaId) {
    return this._simulateCall(
      'desbloquearTarjeta',
      { tarjetaId },
      {
        successEvent: 'ac-api-tarjetas-unblock-success',
        errorEvent: 'ac-api-tarjetas-unblock-error',
        resolveData: () => {
          const tarjeta = this._requireMockCard(tarjetaId);
          if (tarjeta.estado !== 'bloqueada') {
            throw new Error(`La tarjeta ${tarjetaId} no está bloqueada`);
          }
          tarjeta.estado = 'activa';
          return { ...tarjeta };
        },
      },
    );
  }

  /** Simula el cambio de PIN, con el mismo PIN de validación en cada llamada. */
  cambiarPin(tarjetaId, pinActual, _pinNuevo) {
    return this._simulateCall(
      'cambiarPin',
      { tarjetaId },
      {
        successEvent: 'ac-api-tarjetas-pin-success',
        errorEvent: 'ac-api-tarjetas-pin-error',
        resolveData: () => {
          const tarjeta = this._requireMockCard(tarjetaId);
          if (pinActual !== MOCK_PIN) {
            throw new Error('El PIN actual es incorrecto');
          }
          return { tarjetaId: tarjeta.id, estado: 'actualizado' };
        },
      },
    );
  }

  /** Consulta la línea y el importe disponible de una tarjeta de crédito. */
  consultarLineaDisponible(tarjetaId) {
    return this._simulateCall(
      'consultarLineaDisponible',
      { tarjetaId },
      {
        successEvent: 'ac-api-tarjetas-credit-line-success',
        errorEvent: 'ac-api-tarjetas-credit-line-error',
        resolveData: () => {
          const tarjeta = this._requireMockCard(tarjetaId);
          if (tarjeta.tipo === 'debito') {
            throw new Error(`La tarjeta ${tarjetaId} no tiene línea de crédito`);
          }
          return {
            tarjetaId: tarjeta.id,
            lineaCredito: tarjeta.lineaCredito,
            disponible: tarjeta.disponible,
          };
        },
      },
    );
  }

  _requireMockCard(id) {
    const tarjeta = this._cards.find(card => card.id === Number(id));
    if (!tarjeta) {
      throw new Error(`La tarjeta ${id} no existe en el mock`);
    }
    return tarjeta;
  }

  /** Aplica filtros, orden y paginado a `listarTarjetas`. */
  _applyQueryParams(list, queryParams = {}) {
    let result = [...list];

    if (queryParams.estado) {
      result = result.filter(card => card.estado === queryParams.estado);
    }

    if (queryParams.tipo) {
      result = result.filter(card => card.tipo === queryParams.tipo);
    }

    if (queryParams.sortBy) {
      const { sortBy } = queryParams;
      const dir = queryParams.sortDir === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) return dir;
        if (a[sortBy] < b[sortBy]) return -dir;
        return 0;
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
