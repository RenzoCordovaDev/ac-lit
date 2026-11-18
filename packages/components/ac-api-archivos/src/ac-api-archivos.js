import { LitElement } from 'lit';
import { ApiSimulatorMixin } from '@ac-base/ac-api-mixin';

const MOCK_FILES = [
  {
    id: 1,
    nombre: 'contrato.pdf',
    tamanioKb: 240,
    tipo: 'application/pdf',
    subidoEn: '2026-01-02T12:00:00.000Z',
  },
  {
    id: 2,
    nombre: 'foto-perfil.png',
    tamanioKb: 86,
    tipo: 'image/png',
    subidoEn: '2026-01-03T09:00:00.000Z',
  },
];

const UPLOAD_PROGRESS_STEPS = [25, 50, 75, 100];

/**
 * `ac-api-archivos` - simulador de API de archivos, sin UI. Mismo contrato de
 * propiedades que `ac-api-users`, pero `subirArchivo` no usa el orquestador
 * genérico `_simulateCall` del mixin: además de su evento final de
 * éxito/error, emite varios `ac-api-archivos-upload-progress` intermedios
 * (25/50/75/100%), usando directamente `_wait`/`_emit` — así se ve cómo se
 * arma un flujo con eventos de progreso cuando el patrón simple no alcanza.
 */
export class ApiArchivos extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-api-archivos';
  }

  constructor() {
    super();
    this._files = MOCK_FILES.map(file => ({ ...file }));
    this._nextId = this._files.length + 1;
  }

  /** Lista archivos, con soporte de `queryParams` (orden, paginado, proyección). */
  listarArchivos(queryParams = {}) {
    return this._simulateCall(
      'listarArchivos',
      { queryParams },
      {
        successEvent: 'ac-api-archivos-list-success',
        errorEvent: 'ac-api-archivos-list-error',
        resolveData: () =>
          this._applyQueryParams(
            this._files.map(f => this._formatFile(f)),
            queryParams,
          ),
      },
    );
  }

  /** Obtiene un archivo por id. */
  obtenerArchivo(id) {
    return this._simulateCall(
      'obtenerArchivo',
      { id },
      {
        successEvent: 'ac-api-archivos-get-success',
        errorEvent: 'ac-api-archivos-get-error',
        resolveData: () => this._formatFile(this._requireMockFile(id)),
      },
    );
  }

  /**
   * Sube un archivo nuevo. A diferencia del resto de métodos, emite varios
   * `ac-api-archivos-upload-progress` (uno por cada paso de `UPLOAD_PROGRESS_STEPS`)
   * antes de resolver/rechazar con el evento final.
   */
  async subirArchivo(objetoArchivo) {
    const method = 'subirArchivo';
    const params = { objetoArchivo };

    if (!objetoArchivo?.nombre) {
      const error = { message: '`nombre` es obligatorio para subir un archivo', method, params };
      this._emit('ac-api-archivos-upload-error', { method, params, error });
      throw error;
    }

    const pasoMs = this.timeout / UPLOAD_PROGRESS_STEPS.length;
    for (const porcentaje of UPLOAD_PROGRESS_STEPS) {
      await this._wait(pasoMs);
      this._emit('ac-api-archivos-upload-progress', { method, params, data: { porcentaje } });
    }

    if (this.simulateError) {
      const error = { message: 'Error simulado en subirArchivo', method, params };
      this._emit('ac-api-archivos-upload-error', { method, params, error });
      throw error;
    }

    const nuevoArchivo = {
      id: this._nextId++,
      nombre: objetoArchivo.nombre,
      tamanioKb: objetoArchivo.tamanioKb ?? 0,
      tipo: objetoArchivo.tipo ?? 'application/octet-stream',
      subidoEn: new Date().toISOString(),
    };
    this._files.push(nuevoArchivo);
    const data = this._formatFile(nuevoArchivo);
    this._emit('ac-api-archivos-upload-success', { method, params, data });
    return data;
  }

  /** Elimina un archivo por id. */
  eliminarArchivo(id) {
    return this._simulateCall(
      'eliminarArchivo',
      { id },
      {
        successEvent: 'ac-api-archivos-delete-success',
        errorEvent: 'ac-api-archivos-delete-error',
        resolveData: () => {
          this._requireMockFile(id);
          this._files = this._files.filter(f => f.id !== id);
          return { id, deleted: true };
        },
      },
    );
  }

  /** Descarga un archivo: devuelve un mock de su contenido en base64. */
  descargarArchivo(id) {
    return this._simulateCall(
      'descargarArchivo',
      { id },
      {
        successEvent: 'ac-api-archivos-download-success',
        errorEvent: 'ac-api-archivos-download-error',
        resolveData: () => this._formatFileDownload(this._requireMockFile(id)),
      },
    );
  }

  _requireMockFile(id) {
    const file = this._files.find(f => f.id === Number(id));
    if (!file) {
      throw new Error(`El archivo ${id} no existe en el mock`);
    }
    return file;
  }

  _formatFile(file) {
    return { ...file };
  }

  _formatFileDownload(file) {
    return { id: file.id, nombre: file.nombre, contenidoBase64: this._encodeMockContent(file) };
  }

  _encodeMockContent(file) {
    return btoa(`contenido-mock-de-${file.nombre}`);
  }

  /** Orden + paginado + proyección de campos, compartido por `listarArchivos`. */
  _applyQueryParams(list, queryParams = {}) {
    let result = [...list];

    if (queryParams.tipo) {
      result = result.filter(file => file.tipo === queryParams.tipo);
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

    if (!Array.isArray(queryParams.fields) || queryParams.fields.length === 0) {
      return result;
    }
    return result.map(file =>
      Object.fromEntries(queryParams.fields.map(field => [field, file[field]])),
    );
  }
}
