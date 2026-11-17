import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-components/ac-button-basic';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Los casos se cargan con fetch + innerHTML, así que no pueden traer <script>: el
// cableado de los botones de prueba se hace aquí, por delegación. `subirArchivo`
// además dispara varios `ac-api-archivos-upload-progress` — se reflejan acá en
// `#uploadProgress`, aparte del panel de eventos de `ac-demo-content`.

function api() {
  return document.getElementById('apiArchivos');
}

function value(id) {
  return document.getElementById(id)?.value ?? '';
}

function numberValue(id) {
  const raw = value(id);
  return raw === '' ? undefined : Number(raw);
}

const ACTIONS = {
  btnList: () => api().listarArchivos(),
  btnGet: () => api().obtenerArchivo(numberValue('getId')),
  btnUpload: () =>
    api().subirArchivo({ nombre: value('uploadNombre'), tamanioKb: numberValue('uploadTamanio') }),
  btnDownload: () => api().descargarArchivo(numberValue('downloadId')),
  btnDelete: () => api().eliminarArchivo(numberValue('deleteId')),
};

document.addEventListener('click', event => {
  const trigger = event.target.closest?.('[id]');
  const action = trigger && ACTIONS[trigger.id];
  if (!action) return;
  action()?.catch?.(() => {});
});

document.addEventListener('change', event => {
  if (event.target.id === 'simulateErrorToggle') {
    api().simulateError = event.target.checked;
  }
});

document.addEventListener('ac-api-archivos-upload-progress', event => {
  const progressEl = document.getElementById('uploadProgress');
  if (progressEl) progressEl.textContent = `${event.detail.data.porcentaje}%`;
});
