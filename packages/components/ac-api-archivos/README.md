# `@ac-components/ac-api-archivos`

`ac-api-archivos` es un componente **sin UI**: simula el consumo de una API de
archivos (listar, obtener, subir, descargar, eliminar). Mismo contrato de
propiedades que [`ac-api-users`](../ac-api-users/README.md), pero
`subirArchivo` además emite eventos de **progreso** — es el ejemplo de la
familia `ac-api-*` para ese patrón.

## Instalación

```bash
pnpm add @ac-components/ac-api-archivos
```

```js
import '@ac-components/ac-api-archivos';
```

## Propiedades

Igual que el resto de la familia `ac-api-*`: `version`, `timeout`,
`simulateError` (ver [`@ac-base/ac-api-mixin`](../../base/ac-api-mixin/README.md)).

## Métodos públicos

| Método                             | Evento éxito                       | Evento error                     |
| ---------------------------------- | ---------------------------------- | -------------------------------- |
| `listarArchivos(queryParams = {})` | `ac-api-archivos-list-success`     | `ac-api-archivos-list-error`     |
| `obtenerArchivo(id)`               | `ac-api-archivos-get-success`      | `ac-api-archivos-get-error`      |
| `subirArchivo(objetoArchivo)`      | `ac-api-archivos-upload-success`   | `ac-api-archivos-upload-error`   |
| `descargarArchivo(id)`             | `ac-api-archivos-download-success` | `ac-api-archivos-download-error` |
| `eliminarArchivo(id)`              | `ac-api-archivos-delete-success`   | `ac-api-archivos-delete-error`   |

### `subirArchivo` y el evento de progreso

A diferencia del resto de métodos (que usan el orquestador genérico
`_simulateCall` de `@ac-base/ac-api-mixin`), `subirArchivo` dispara además
`ac-api-archivos-upload-progress` cuatro veces (`{ porcentaje: 25|50|75|100 }`)
repartidas en `this.timeout`, antes de resolver o rechazar con su evento
final. Es el ejemplo de la familia para un flujo que necesita algo más que
"espera → éxito/error".

`descargarArchivo` devuelve `{ id, nombre, contenidoBase64 }` — un mock en
base64, no el archivo real.

## Uso

```js
import { LitElement, html } from 'lit';
import '@ac-components/ac-api-archivos';

class MisArchivos extends LitElement {
  static properties = { progreso: { state: true } };

  firstUpdated() {
    this._apiArchivos = this.renderRoot.querySelector('#apiArchivos');
  }

  _subir() {
    this._apiArchivos.subirArchivo({ nombre: 'reporte.pdf', tamanioKb: 200 });
  }

  _handleProgress(event) {
    this.progreso = event.detail.data.porcentaje;
  }

  render() {
    return html`
      <ac-api-archivos
        id="apiArchivos"
        version="0"
        @ac-api-archivos-upload-progress="${this._handleProgress}"
      ></ac-api-archivos>

      <button @click="${this._subir}">Subir archivo</button>
      <p>Progreso: ${this.progreso ?? 0}%</p>
    `;
  }
}
```

## Métodos privados

`_requireMockFile`, `_formatFile`, `_formatFileDownload`,
`_encodeMockContent`, `_applyQueryParams`.

## Desarrollo

```bash
aclit component:serve
aclit component:lint
aclit component:test
aclit component:build
```
