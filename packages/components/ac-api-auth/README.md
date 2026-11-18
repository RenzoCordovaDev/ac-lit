# `@ac-components/ac-api-auth`

`ac-api-auth` es un componente **sin UI**: simula el ciclo de vida completo de
una sesión (login, registro, logout, validación y refresco de token). Mismo
contrato que [`ac-api-users`](../ac-api-users/README.md), aunque es un
componente independiente de él — dueño de su propio mock de cuentas y sesiones.

## Instalación

```bash
pnpm add @ac-components/ac-api-auth
```

```js
import '@ac-components/ac-api-auth';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`: `version`, `timeout`,
`simulateError` (ver [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md)).

## Métodos públicos

| Método                           | Evento éxito                   | Evento error                 |
| -------------------------------- | ------------------------------ | ---------------------------- |
| `iniciarSesion(email, password)` | `ac-api-auth-login-success`    | `ac-api-auth-login-error`    |
| `registrarCuenta(objetoCuenta)`  | `ac-api-auth-register-success` | `ac-api-auth-register-error` |
| `cerrarSesion(token)`            | `ac-api-auth-logout-success`   | `ac-api-auth-logout-error`   |
| `validarSesion(token)`           | `ac-api-auth-validate-success` | `ac-api-auth-validate-error` |
| `refrescarToken(token)`          | `ac-api-auth-refresh-success`  | `ac-api-auth-refresh-error`  |

`registrarCuenta` deja la cuenta autenticada (misma forma de respuesta que
`iniciarSesion`: `{ token, usuario }`). `refrescarToken` invalida el token
anterior — una `validarSesion` posterior con el token viejo dispara error.

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-auth';

class MiLogin extends LitElement {
  static properties = { token: { state: true } };

  firstUpdated() {
    this._apiAuth = this.renderRoot.querySelector('#apiAuth');
  }

  _login() {
    this._apiAuth.iniciarSesion('ana.torres@mail.com', '1234');
  }

  _handleLogin(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.token = data.token;
  }

  render() {
    return html`
      <ac-api-auth
        id="apiAuth"
        version="0"
        @ac-api-auth-login-success="${this._handleLogin}"
        @ac-api-auth-login-error="${this._handleLogin}"
      ></ac-api-auth>

      <button @click="${this._login}">Iniciar sesión</button>
    `;
  }
}
```

## Métodos privados

`_requireSession`, `_createSession`, `_generateToken`, `_formatAccount`,
`_formatAccountEmail`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
