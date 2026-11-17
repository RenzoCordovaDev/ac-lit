# `@ac-base/ac-api-mixin`

Mixin base para los componentes `ac-api-*` del catálogo: simuladores de consumo de
API **sin UI** (no renderizan nada), pensados para declararse en el `render()` de
otro componente e invocar sus métodos públicos, igual que a cualquier componente
visual del catálogo.

## Qué da

- `version` (`String`, default `'v1'`), `timeout` (`Number`, ms, default `3000`) y
  `simulateError` (`Boolean`, atributo `simulate-error`, default `false`) como
  propiedades reactivas listas para usar.
- `render()` que no pinta nada — el componente que lo use no necesita definirlo.
- `_wait(ms = this.timeout)` — latencia simulada.
- `_emit(name, detail)` — dispara un `CustomEvent` (`bubbles`/`composed`) con la
  convención de naming del catálogo (`${tag}-${acción}-${resultado}`).
- `_simulateCall(method, params, { successEvent, errorEvent, resolveData, errorMessage })` —
  orquesta el patrón completo: espera `timeout`, y si `simulateError` está activo
  dispara `errorEvent` y rechaza la promesa; si no, resuelve `resolveData()`,
  dispara `successEvent` y devuelve ese dato.

## Uso

```js
import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

export class ApiUsers extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-users';
  }

  listarUsuarios(queryParams = {}) {
    return this._simulateCall('listarUsuarios', queryParams, {
      successEvent: 'ac-api-users-list-success',
      errorEvent: 'ac-api-users-list-error',
      resolveData: () => this._applyQueryParams(this._buildMockUserList(), queryParams),
    });
  }
}
```

Cada método público del componente concreto solo necesita construir el mock y
delegar en `_simulateCall`; el manejo de latencia, error simulado y disparo de
eventos vive una sola vez acá.
