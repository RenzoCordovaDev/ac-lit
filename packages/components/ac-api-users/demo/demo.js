import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-components/ac-button-basic';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Los casos se cargan con fetch + innerHTML, así que no pueden traer <script>: el
// cableado de los botones de prueba se hace aquí, por delegación, con atributos de
// datos. `ac-api-users` no renderiza nada — lo único visible es este panel de
// prueba; cada evento que dispara ya se ve solo, en el panel de eventos
// (campanita) de `ac-demo-content` (atributo `events` en demo/index.html).

function api() {
  return document.getElementById('apiUsers');
}

function value(id) {
  return document.getElementById(id)?.value ?? '';
}

function numberValue(id) {
  const raw = value(id);
  return raw === '' ? undefined : Number(raw);
}

const ACTIONS = {
  btnGetUser: () => api().obtenerDatosUsuario(numberValue('getUserId')),
  btnList: () => {
    const pagination = numberValue('listPagination');
    return api().listarUsuarios(pagination ? { pagination } : {});
  },
  btnSearch: () => api().buscarUsuarios(value('searchTexto')),
  btnProfile: () => api().obtenerPerfilUsuario(numberValue('profileId')),
  btnRegister: () =>
    api().registrarUsuario({ nombre: value('registerNombre'), email: value('registerEmail') }),
  btnUpdate: () =>
    api().actualizarUsuario(numberValue('updateId'), { nombre: value('updateNombre') }),
  btnDelete: () => api().eliminarUsuario(numberValue('deleteId')),
  btnAuth: () => api().validarCredenciales(value('authEmail'), value('authPassword')),
};

document.addEventListener('click', event => {
  const trigger = event.target.closest?.('[id]');
  const action = trigger && ACTIONS[trigger.id];
  if (!action) return;
  // El resultado/error ya se ve en el panel de eventos de ac-demo-content —
  // acá solo evitamos el "unhandled rejection" cuando simulateError está activo.
  action()?.catch?.(() => {});
});

document.addEventListener('change', event => {
  if (event.target.id === 'simulateErrorToggle') {
    api().simulateError = event.target.checked;
  }
});
