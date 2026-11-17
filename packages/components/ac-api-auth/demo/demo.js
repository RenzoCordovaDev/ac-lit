import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-components/ac-button-basic';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Los casos se cargan con fetch + innerHTML, así que no pueden traer <script>: el
// cableado de los botones de prueba se hace aquí, por delegación.

function api() {
  return document.getElementById('apiAuth');
}

function value(id) {
  return document.getElementById(id)?.value ?? '';
}

let lastToken = '';

const ACTIONS = {
  btnLogin: async () => {
    const { token } = await api().iniciarSesion(value('loginEmail'), value('loginClave'));
    lastToken = token;
    document.getElementById('currentToken').textContent = token;
  },
  btnRegister: async () => {
    const { token } = await api().registrarCuenta({
      nombre: value('registerNombre'),
      email: value('registerEmail'),
      clave: value('registerClave'),
    });
    lastToken = token;
    document.getElementById('currentToken').textContent = token;
  },
  btnValidate: () => api().validarSesion(lastToken),
  btnRefresh: async () => {
    const { token } = await api().refrescarToken(lastToken);
    lastToken = token;
    document.getElementById('currentToken').textContent = token;
  },
  btnLogout: () => api().cerrarSesion(lastToken),
};

document.addEventListener('click', event => {
  const trigger = event.target.closest?.('[id]');
  const action = trigger && ACTIONS[trigger.id];
  if (!action) return;
  Promise.resolve(action()).catch(() => {});
});

document.addEventListener('change', event => {
  if (event.target.id === 'simulateErrorToggle') {
    api().simulateError = event.target.checked;
  }
});
