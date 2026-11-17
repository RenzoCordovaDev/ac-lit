import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-components/ac-button-basic';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Los casos se cargan con fetch + innerHTML, así que no pueden traer <script>: el
// cableado de los botones de prueba se hace aquí, por delegación. `ac-api-productos`
// no renderiza nada — cada evento disparado se ve en el panel de eventos (campanita)
// de `ac-demo-content` (atributo `events` en demo/index.html).

function api() {
  return document.getElementById('apiProductos');
}

function value(id) {
  return document.getElementById(id)?.value ?? '';
}

function numberValue(id) {
  const raw = value(id);
  return raw === '' ? undefined : Number(raw);
}

const ACTIONS = {
  btnGetProduct: () => api().obtenerProducto(numberValue('getProductId')),
  btnList: () => {
    const category = value('listCategory');
    return api().listarProductos(category ? { category } : {});
  },
  btnSearch: () => api().buscarProductos(value('searchTexto')),
  btnDetail: () => api().obtenerDetalleProducto(numberValue('detailId')),
  btnRegister: () =>
    api().registrarProducto({
      nombre: value('registerNombre'),
      precio: numberValue('registerPrecio'),
    }),
  btnUpdate: () =>
    api().actualizarProducto(numberValue('updateId'), { precio: numberValue('updatePrecio') }),
  btnDelete: () => api().eliminarProducto(numberValue('deleteId')),
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
