import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-components/ac-button-basic';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Los casos se cargan con fetch + innerHTML, así que no pueden traer <script>: el
// cableado de los botones de prueba se hace aquí, por delegación.

function api() {
  return document.getElementById('apiCarrito');
}

function value(id) {
  return document.getElementById(id)?.value ?? '';
}

function numberValue(id) {
  const raw = value(id);
  return raw === '' ? undefined : Number(raw);
}

const ACTIONS = {
  btnAdd: () =>
    api().agregarItem({
      productoId: numberValue('addProductoId'),
      nombre: value('addNombre'),
      precio: numberValue('addPrecio'),
      cantidad: numberValue('addCantidad') ?? 1,
    }),
  btnRemove: () => api().quitarItem(numberValue('removeProductoId')),
  btnList: () => api().listarItems(),
  btnUpdateQty: () =>
    api().actualizarCantidad(numberValue('updateQtyProductoId'), numberValue('updateQtyCantidad')),
  btnClear: () => api().vaciarCarrito(),
  btnSummary: () => api().obtenerResumen(),
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
