import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_USERS = [
  { id: 1, nombre: 'Ana Torres', email: 'ANA.TORRES@MAIL.COM', rol: 'admin', activo: true },
  { id: 2, nombre: 'Luis Gómez', email: 'Luis.Gomez@mail.com', rol: 'editor', activo: true },
  { id: 3, nombre: 'Marta Ríos', email: 'marta.rios@mail.com', rol: 'lector', activo: false },
  { id: 4, nombre: 'Carlos Peña', email: 'carlos.pena@mail.com', rol: 'editor', activo: true },
  { id: 5, nombre: 'Sofía Luna', email: 'sofia.luna@mail.com', rol: 'lector', activo: true },
  { id: 6, nombre: 'Diego Vargas', email: 'diego.vargas@mail.com', rol: 'admin', activo: false },
  { id: 7, nombre: 'Elena Soto', email: 'elena.soto@mail.com', rol: 'lector', activo: true },
  { id: 8, nombre: 'Jorge Paredes', email: 'jorge.paredes@mail.com', rol: 'editor', activo: true },
];

/**
 * `ac-api-users` - simulador de API de usuarios, sin UI. Se declara en el
 * `render()` de otro componente (como cualquier componente visual del
 * catálogo) y se invoca a través de sus métodos públicos; cada uno devuelve
 * una `Promise` y además dispara un evento `ac-api-users-<acción>-<resultado>`.
 */
export class ApiUsers extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-users';
  }

  constructor() {
    super();
    this._users = MOCK_USERS.map(user => ({ ...user }));
    this._nextId = this._users.length + 1;
  }

  /** Obtiene un usuario por id. */
  obtenerDatosUsuario(id, queryParams = {}) {
    return this._simulateCall(
      'obtenerDatosUsuario',
      { id, queryParams },
      {
        successEvent: 'ac-api-users-get-user-success',
        errorEvent: 'ac-api-users-get-user-error',
        resolveData: () => {
          const user = this._requireMockUser(id);
          return this._applyFieldsParam(this._formatUser(user), queryParams);
        },
      },
    );
  }

  /** Lista usuarios, con soporte de `queryParams` (paginación, orden, filtro, proyección). */
  listarUsuarios(queryParams = {}) {
    return this._simulateCall(
      'listarUsuarios',
      { queryParams },
      {
        successEvent: 'ac-api-users-list-success',
        errorEvent: 'ac-api-users-list-error',
        resolveData: () =>
          this._applyQueryParams(
            this._users.map(user => this._formatUser(user)),
            queryParams,
          ),
      },
    );
  }

  /** Busca usuarios por nombre o email, con el mismo soporte de `queryParams` que `listarUsuarios`. */
  buscarUsuarios(texto, queryParams = {}) {
    return this._simulateCall(
      'buscarUsuarios',
      { texto, queryParams },
      {
        successEvent: 'ac-api-users-search-success',
        errorEvent: 'ac-api-users-search-error',
        resolveData: () => {
          const needle = (texto ?? '').trim().toLowerCase();
          const matches = this._users.filter(
            user =>
              user.nombre.toLowerCase().includes(needle) ||
              user.email.toLowerCase().includes(needle),
          );
          return this._applyQueryParams(
            matches.map(user => this._formatUser(user)),
            queryParams,
          );
        },
      },
    );
  }

  /** Obtiene el perfil extendido de un usuario, con datos anidados (contacto/dirección/preferencias). */
  obtenerPerfilUsuario(id) {
    return this._simulateCall(
      'obtenerPerfilUsuario',
      { id },
      {
        successEvent: 'ac-api-users-get-profile-success',
        errorEvent: 'ac-api-users-get-profile-error',
        resolveData: () => this._formatUserProfile(this._requireMockUser(id)),
      },
    );
  }

  /** Registra (crea) un usuario nuevo a partir de `objetoUsuario`. */
  registrarUsuario(objetoUsuario) {
    return this._simulateCall(
      'registrarUsuario',
      { objetoUsuario },
      {
        successEvent: 'ac-api-users-register-success',
        errorEvent: 'ac-api-users-register-error',
        errorMessage: 'No se pudo registrar el usuario',
        resolveData: () => {
          if (!objetoUsuario?.nombre || !objetoUsuario?.email) {
            throw new Error('`nombre` y `email` son obligatorios para registrar un usuario');
          }
          const nuevoUsuario = {
            id: this._nextId++,
            nombre: objetoUsuario.nombre,
            email: objetoUsuario.email,
            rol: objetoUsuario.rol ?? 'lector',
            activo: true,
          };
          this._users.push(nuevoUsuario);
          return this._formatUser(nuevoUsuario);
        },
      },
    );
  }

  /** Actualiza (edita) un usuario existente, mezclando `cambios` sobre el registro actual. */
  actualizarUsuario(id, cambios = {}) {
    return this._simulateCall(
      'actualizarUsuario',
      { id, cambios },
      {
        successEvent: 'ac-api-users-update-success',
        errorEvent: 'ac-api-users-update-error',
        resolveData: () => {
          const user = this._requireMockUser(id);
          Object.assign(user, cambios, { id: user.id });
          return this._formatUser(user);
        },
      },
    );
  }

  /** Elimina un usuario por id. */
  eliminarUsuario(id) {
    return this._simulateCall(
      'eliminarUsuario',
      { id },
      {
        successEvent: 'ac-api-users-delete-success',
        errorEvent: 'ac-api-users-delete-error',
        resolveData: () => {
          this._requireMockUser(id);
          this._users = this._users.filter(user => user.id !== id);
          return { id, deleted: true };
        },
      },
    );
  }

  /** Simula un login: valida email/password contra el mock y devuelve un token. */
  validarCredenciales(email, password) {
    return this._simulateCall(
      'validarCredenciales',
      { email },
      {
        successEvent: 'ac-api-users-auth-success',
        errorEvent: 'ac-api-users-auth-error',
        errorMessage: 'Credenciales inválidas',
        resolveData: () => {
          const user = this._users.find(u => u.email.toLowerCase() === (email ?? '').toLowerCase());
          if (!user || !password || password.length < 4) {
            throw new Error('Credenciales inválidas');
          }
          return { token: `mock-token-${user.id}-${Date.now()}`, user: this._formatUser(user) };
        },
      },
    );
  }

  _requireMockUser(id) {
    const user = this._users.find(u => u.id === Number(id));
    if (!user) {
      throw new Error(`El usuario ${id} no existe en el mock`);
    }
    return user;
  }

  _formatUser(user) {
    return {
      id: user.id,
      nombre: user.nombre,
      email: this._formatUserContactDetailEmail(user),
      rol: user.rol,
      activo: user.activo,
    };
  }

  _formatUserProfile(user) {
    return {
      ...this._formatUser(user),
      contacto: { email: this._formatUserContactDetailEmail(user), telefono: '+51 900 000 000' },
      direccion: this._formatUserAddress(user),
      preferencias: { idioma: 'es-PE', notificaciones: user.activo },
    };
  }

  _formatUserContactDetailEmail(user) {
    return user.email.trim().toLowerCase();
  }

  _formatUserAddress(user) {
    return {
      linea1: `Av. Mock ${user.id}00`,
      ciudad: 'Lima',
      pais: 'Perú',
    };
  }

  /** Filtro + orden + paginado + proyección de campos, compartido por listar/buscar. */
  _applyQueryParams(list, queryParams = {}) {
    let result = [...list];

    if (queryParams.role) {
      result = result.filter(user => user.rol === queryParams.role);
    }
    if (queryParams.status === 'active' || queryParams.activo === true) {
      result = result.filter(user => user.activo);
    }
    if (queryParams.status === 'inactive' || queryParams.activo === false) {
      result = result.filter(user => !user.activo);
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

    return result.map(user => this._applyFieldsParam(user, queryParams));
  }

  _applyFieldsParam(user, queryParams = {}) {
    if (!Array.isArray(queryParams.fields) || queryParams.fields.length === 0) {
      return user;
    }
    return Object.fromEntries(queryParams.fields.map(field => [field, user[field]]));
  }
}
