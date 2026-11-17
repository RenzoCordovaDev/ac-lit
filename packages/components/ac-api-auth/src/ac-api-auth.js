import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_ACCOUNTS = [
  { id: 1, nombre: 'Ana Torres', email: 'ana.torres@mail.com', clave: '1234' },
  { id: 2, nombre: 'Luis Gómez', email: 'luis.gomez@mail.com', clave: 'abcd' },
];

/**
 * `ac-api-auth` - simulador de API de autenticación/sesión, sin UI. A
 * diferencia de `ac-api-users`, este componente es dueño del ciclo de vida
 * completo de la sesión (login, registro, logout, validación, refresco de
 * token) — mismo contrato que el resto de la familia: `Promise` + evento
 * `ac-api-auth-<acción>-<resultado>` en cada método.
 */
export class ApiAuth extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-auth';
  }

  constructor() {
    super();
    this._accounts = MOCK_ACCOUNTS.map(account => ({ ...account }));
    this._sessions = new Map();
    this._nextId = this._accounts.length + 1;
  }

  /** Inicia sesión: valida email/clave contra el mock y devuelve un token. */
  iniciarSesion(email, password) {
    return this._simulateCall(
      'iniciarSesion',
      { email },
      {
        successEvent: 'ac-api-auth-login-success',
        errorEvent: 'ac-api-auth-login-error',
        errorMessage: 'Credenciales inválidas',
        resolveData: () => {
          const account = this._accounts.find(
            a => a.email.toLowerCase() === (email ?? '').toLowerCase(),
          );
          if (!account || account.clave !== password) {
            throw new Error('Credenciales inválidas');
          }
          return this._createSession(account);
        },
      },
    );
  }

  /** Registra una cuenta nueva y la deja autenticada (equivalente a loguearse después). */
  registrarCuenta(objetoCuenta) {
    return this._simulateCall(
      'registrarCuenta',
      { objetoCuenta },
      {
        successEvent: 'ac-api-auth-register-success',
        errorEvent: 'ac-api-auth-register-error',
        errorMessage: 'No se pudo registrar la cuenta',
        resolveData: () => {
          if (!objetoCuenta?.nombre || !objetoCuenta?.email || !objetoCuenta?.clave) {
            throw new Error('`nombre`, `email` y `clave` son obligatorios para registrarse');
          }
          if (
            this._accounts.some(a => a.email.toLowerCase() === objetoCuenta.email.toLowerCase())
          ) {
            throw new Error('Ya existe una cuenta con ese email');
          }
          const nuevaCuenta = {
            id: this._nextId++,
            nombre: objetoCuenta.nombre,
            email: objetoCuenta.email,
            clave: objetoCuenta.clave,
          };
          this._accounts.push(nuevaCuenta);
          return this._createSession(nuevaCuenta);
        },
      },
    );
  }

  /** Cierra sesión: invalida el token. */
  cerrarSesion(token) {
    return this._simulateCall(
      'cerrarSesion',
      { token },
      {
        successEvent: 'ac-api-auth-logout-success',
        errorEvent: 'ac-api-auth-logout-error',
        errorMessage: 'La sesión no existe o ya expiró',
        resolveData: () => {
          this._requireSession(token);
          this._sessions.delete(token);
          return { token, closed: true };
        },
      },
    );
  }

  /** Valida que un token siga activo y devuelve el usuario asociado. */
  validarSesion(token) {
    return this._simulateCall(
      'validarSesion',
      { token },
      {
        successEvent: 'ac-api-auth-validate-success',
        errorEvent: 'ac-api-auth-validate-error',
        errorMessage: 'La sesión no existe o ya expiró',
        resolveData: () => {
          const session = this._requireSession(token);
          return { valid: true, usuario: this._formatAccount(session.usuario) };
        },
      },
    );
  }

  /** Refresca un token: invalida el anterior y entrega uno nuevo para el mismo usuario. */
  refrescarToken(token) {
    return this._simulateCall(
      'refrescarToken',
      { token },
      {
        successEvent: 'ac-api-auth-refresh-success',
        errorEvent: 'ac-api-auth-refresh-error',
        errorMessage: 'La sesión no existe o ya expiró',
        resolveData: () => {
          const session = this._requireSession(token);
          this._sessions.delete(token);
          return this._createSession(session.usuario);
        },
      },
    );
  }

  _requireSession(token) {
    const session = this._sessions.get(token);
    if (!session) {
      throw new Error('La sesión no existe o ya expiró');
    }
    return session;
  }

  _createSession(account) {
    const token = this._generateToken(account);
    this._sessions.set(token, { usuario: account, creadoEn: new Date().toISOString() });
    return { token, usuario: this._formatAccount(account) };
  }

  _generateToken(account) {
    return `mock-token-${account.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  _formatAccount(account) {
    return { id: account.id, nombre: account.nombre, email: this._formatAccountEmail(account) };
  }

  _formatAccountEmail(account) {
    return account.email.trim().toLowerCase();
  }
}
