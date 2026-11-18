import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    titulo: 'Pedido confirmado',
    mensaje: 'Tu pedido #1 fue confirmado.',
    tipo: 'pedido',
    leida: false,
    fecha: '2026-01-10T10:05:00.000Z',
  },
  {
    id: 2,
    titulo: 'Pago aprobado',
    mensaje: 'Tu pago de S/ 159.80 fue aprobado.',
    tipo: 'pago',
    leida: true,
    fecha: '2026-01-09T09:00:00.000Z',
  },
  {
    id: 3,
    titulo: 'Oferta especial',
    mensaje: '20% de descuento en electrónica esta semana.',
    tipo: 'promocion',
    leida: false,
    fecha: '2026-01-08T08:00:00.000Z',
  },
];

/**
 * `ac-api-notificaciones` - simulador de API de notificaciones, sin UI. Mismo
 * contrato que `ac-api-users`: se declara en el `render()` de otro componente
 * y se invoca a través de sus métodos públicos, cada uno con `Promise` +
 * evento `ac-api-notificaciones-<acción>-<resultado>`.
 */
export class ApiNotificaciones extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-notificaciones';
  }

  constructor() {
    super();
    this._notifications = MOCK_NOTIFICATIONS.map(n => ({ ...n }));
    this._nextId = this._notifications.length + 1;
  }

  /** Envía (crea) una notificación nueva, no leída. */
  enviarNotificacion(objetoNotificacion) {
    return this._simulateCall(
      'enviarNotificacion',
      { objetoNotificacion },
      {
        successEvent: 'ac-api-notificaciones-send-success',
        errorEvent: 'ac-api-notificaciones-send-error',
        errorMessage: 'No se pudo enviar la notificación',
        resolveData: () => {
          if (!objetoNotificacion?.titulo || !objetoNotificacion?.mensaje) {
            throw new Error('`titulo` y `mensaje` son obligatorios para enviar una notificación');
          }
          const nueva = {
            id: this._nextId++,
            titulo: objetoNotificacion.titulo,
            mensaje: objetoNotificacion.mensaje,
            tipo: objetoNotificacion.tipo ?? 'general',
            leida: false,
            fecha: new Date().toISOString(),
          };
          this._notifications.unshift(nueva);
          return this._formatNotification(nueva);
        },
      },
    );
  }

  /** Lista notificaciones, con soporte de `queryParams` (filtro, orden, paginado, proyección). */
  listarNotificaciones(queryParams = {}) {
    return this._simulateCall(
      'listarNotificaciones',
      { queryParams },
      {
        successEvent: 'ac-api-notificaciones-list-success',
        errorEvent: 'ac-api-notificaciones-list-error',
        resolveData: () =>
          this._applyQueryParams(
            this._notifications.map(n => this._formatNotification(n)),
            queryParams,
          ),
      },
    );
  }

  /** Obtiene una notificación por id. */
  obtenerNotificacion(id) {
    return this._simulateCall(
      'obtenerNotificacion',
      { id },
      {
        successEvent: 'ac-api-notificaciones-get-success',
        errorEvent: 'ac-api-notificaciones-get-error',
        resolveData: () => this._formatNotification(this._requireMockNotification(id)),
      },
    );
  }

  /** Marca una notificación como leída. */
  marcarLeida(id) {
    return this._simulateCall(
      'marcarLeida',
      { id },
      {
        successEvent: 'ac-api-notificaciones-mark-read-success',
        errorEvent: 'ac-api-notificaciones-mark-read-error',
        resolveData: () => {
          const notification = this._requireMockNotification(id);
          notification.leida = true;
          return this._formatNotification(notification);
        },
      },
    );
  }

  /** Elimina una notificación por id. */
  eliminarNotificacion(id) {
    return this._simulateCall(
      'eliminarNotificacion',
      { id },
      {
        successEvent: 'ac-api-notificaciones-delete-success',
        errorEvent: 'ac-api-notificaciones-delete-error',
        resolveData: () => {
          this._requireMockNotification(id);
          this._notifications = this._notifications.filter(n => n.id !== id);
          return { id, deleted: true };
        },
      },
    );
  }

  _requireMockNotification(id) {
    const notification = this._notifications.find(n => n.id === Number(id));
    if (!notification) {
      throw new Error(`La notificación ${id} no existe en el mock`);
    }
    return notification;
  }

  _formatNotification(notification) {
    return {
      id: notification.id,
      titulo: notification.titulo,
      mensaje: notification.mensaje,
      tipo: notification.tipo,
      leida: notification.leida,
      fecha: notification.fecha,
    };
  }

  /** Filtro + orden + paginado + proyección de campos, compartido por `listarNotificaciones`. */
  _applyQueryParams(list, queryParams = {}) {
    let result = [...list];

    if (queryParams.tipo) {
      result = result.filter(n => n.tipo === queryParams.tipo);
    }
    if (queryParams.leida === true || queryParams.status === 'read') {
      result = result.filter(n => n.leida);
    }
    if (queryParams.leida === false || queryParams.status === 'unread') {
      result = result.filter(n => !n.leida);
    }

    const sortBy = queryParams.sortBy ?? 'fecha';
    const dir = queryParams.sortDir === 'asc' ? 1 : -1;
    result = [...result].sort((a, b) => (a[sortBy] > b[sortBy] ? dir : -dir));

    if (queryParams.pagination) {
      const pageSize = Number(queryParams.pagination);
      const page = Number(queryParams.page ?? 1);
      const start = (page - 1) * pageSize;
      result = result.slice(start, start + pageSize);
    }

    return result.map(n => this._applyFieldsParam(n, queryParams));
  }

  _applyFieldsParam(notification, queryParams = {}) {
    if (!Array.isArray(queryParams.fields) || queryParams.fields.length === 0) {
      return notification;
    }
    return Object.fromEntries(queryParams.fields.map(field => [field, notification[field]]));
  }
}
