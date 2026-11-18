# `@ac-components/ac-api-users`

`ac-api-users` es un componente **sin UI** (no renderiza nada): simula el
consumo de una API de usuarios. Se declara en el `render()` de otro
componente — igual que cualquier componente visual del catálogo — y se usa
invocando sus métodos públicos y/o escuchando sus eventos.

## Instalación

```bash
pnpm add @ac-components/ac-api-users
```

```js
import '@ac-components/ac-api-users';
```

## Propiedades

| Propiedad       | Atributo         | Tipo    | Default | Descripción                                                                    |
| --------------- | ---------------- | ------- | ------- | ------------------------------------------------------------------------------ |
| `version`       | `version`        | String  | `'v1'`  | Versión del mock/servicio simulado.                                            |
| `timeout`       | `timeout`        | Number  | `3000`  | Latencia simulada (ms) de cada método.                                         |
| `simulateError` | `simulate-error` | Boolean | `false` | Si está en `true`, todo método siguiente rechaza y dispara su evento `-error`. |

## Métodos públicos

Cada método devuelve una `Promise` **y además** dispara un `CustomEvent`
(`bubbles`/`composed`) con la convención `ac-api-users-<acción>-<resultado>`.
El `detail` es `{ method, params, data }` en éxito o `{ method, params, error }`
en error — por eso un mismo handler alcanza para ambos, como en el ejemplo de
abajo.

| Método                                      | Evento éxito                       | Evento error                     |
| ------------------------------------------- | ---------------------------------- | -------------------------------- |
| `obtenerDatosUsuario(id, queryParams = {})` | `ac-api-users-get-user-success`    | `ac-api-users-get-user-error`    |
| `listarUsuarios(queryParams = {})`          | `ac-api-users-list-success`        | `ac-api-users-list-error`        |
| `buscarUsuarios(texto, queryParams = {})`   | `ac-api-users-search-success`      | `ac-api-users-search-error`      |
| `obtenerPerfilUsuario(id)`                  | `ac-api-users-get-profile-success` | `ac-api-users-get-profile-error` |
| `registrarUsuario(objetoUsuario)`           | `ac-api-users-register-success`    | `ac-api-users-register-error`    |
| `actualizarUsuario(id, cambios)`            | `ac-api-users-update-success`      | `ac-api-users-update-error`      |
| `eliminarUsuario(id)`                       | `ac-api-users-delete-success`      | `ac-api-users-delete-error`      |
| `validarCredenciales(email, password)`      | `ac-api-users-auth-success`        | `ac-api-users-auth-error`        |

### `queryParams` soportado en `listarUsuarios`/`buscarUsuarios`

| Clave                | Tipo                     | Efecto                                                     |
| -------------------- | ------------------------ | ---------------------------------------------------------- |
| `pagination`         | Number                   | Recorta el resultado a N registros.                        |
| `page`               | Number (default `1`)     | Combinado con `pagination`, simula paginado real (offset). |
| `sortBy` / `sortDir` | String / `'asc'\|'desc'` | Ordena el resultado por esa clave.                         |
| `fields`             | `string[]`               | Proyección: devuelve solo esas claves por registro.        |
| `role`               | String                   | Filtra por `rol`.                                          |
| `status`             | `'active'\|'inactive'`   | Filtra por `activo`.                                       |

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-users';

class MiPantallaUsuarios extends LitElement {
  static properties = { usuarios: { state: true } };

  constructor() {
    super();
    this.usuarios = [];
  }

  firstUpdated() {
    this._apiUsers = this.renderRoot.querySelector('#apiUsers');
  }

  _cargarUsuarios() {
    this._apiUsers.listarUsuarios({ pagination: 3, sortBy: 'nombre' });
  }

  _handleList(event) {
    const { data, error } = event.detail;
    if (error) return console.error(error);
    this.usuarios = data;
  }

  render() {
    return html`
      <ac-api-users
        id="apiUsers"
        version="0"
        @ac-api-users-list-success="${this._handleList}"
        @ac-api-users-list-error="${this._handleList}"
      ></ac-api-users>

      <button @click="${this._cargarUsuarios}">Cargar usuarios</button>
      <ul>
        ${this.usuarios.map(u => html`<li>${u.nombre}</li>`)}
      </ul>
    `;
  }
}
```

> El componente no pinta nada: igual necesita quedar en el DOM del padre (vía
> `render()`, como arriba) para poder recibir los eventos y que el padre lo
> ubique con `querySelector`/`id`.

## Métodos privados

Toda la lógica de formateo del mock vive separada, con el prefijo `_`:
`_formatUser`, `_formatUserProfile`, `_formatUserContactDetailEmail`,
`_formatUserAddress`, `_applyQueryParams`, `_applyFieldsParam`,
`_requireMockUser`. El manejo de latencia/error simulado/disparo de eventos lo
da `@ac-base/ac-api-mixin` (`_wait`, `_emit`, `_simulateCall`) — ver su README
para el detalle de ese contrato.

## Desarrollo

```bash
aclit component:serve   # o: pnpm --filter @ac-components/ac-api-users component:serve
aclit component:lint
aclit component:test
aclit component:build
```

> El `demo/` de este componente no tiene nada que "ver": los métodos se
> invocan desde el panel de prueba (botones) y cada evento disparado aparece
> en el panel de eventos (campanita) de `ac-demo-content`.
