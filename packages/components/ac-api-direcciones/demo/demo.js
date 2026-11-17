import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-components/ac-button-basic';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Los casos se cargan con fetch + innerHTML, así que no pueden traer <script>: el
// cableado de los botones de prueba se hace aquí, por delegación.

function api() {
  return document.getElementById('apiDirecciones');
}

function value(id) {
  return document.getElementById(id)?.value ?? '';
}

function numberValue(id) {
  const raw = value(id);
  return raw === '' ? undefined : Number(raw);
}

const ACTIONS = {
  btnList: () => api().listarDirecciones(),
  btnGet: () => api().obtenerDireccion(numberValue('getId')),
  btnAdd: () =>
    api().agregarDireccion({
      etiqueta: value('addEtiqueta'),
      linea1: value('addLinea1'),
      ciudad: value('addCiudad'),
    }),
  btnUpdate: () =>
    api().actualizarDireccion(numberValue('updateId'), { ciudad: value('updateCiudad') }),
  btnDelete: () => api().eliminarDireccion(numberValue('deleteId')),
  btnMarkDefault: () => api().marcarPredeterminada(numberValue('markDefaultId')),
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
