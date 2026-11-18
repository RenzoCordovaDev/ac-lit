import '../index.js';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';

// La demo no es parte del catálogo (no usa `ac-demo-content`): es solo lo
// mínimo para levantar `registro-wizard` con `vite demo` y verlo funcionar.
// `init()` simula la lectura inicial contra `ac-api-users` (ver non-negotiable
// #3) -- se llama una vez el elemento está definido, como lo haría cualquier
// app consumidora al montar el componente.
customElements.whenDefined('registro-wizard').then(async () => {
  const wizard = document.getElementById('wizard');
  // Espera el primer render para que el `ref()` interno de `ac-api-users` ya
  // esté asignado antes de llamar a `init()` (si no, `_apiUsersRef.value`
  // todavía sería `undefined`).
  await wizard.updateComplete;
  wizard.init();
});

// Botón de prueba: alterna `simulate-error` en el `ac-api-users` interno del
// wizard para poder probar el camino de error del guardado desde la demo.
// El wizard no expone esto por su API pública (solo `init()`/`reset()`, ver
// non-negotiable #3) -- la demo lee el shadow root igual que lo haría
// cualquier herramienta externa de inspección/test, no el propio componente.
document.getElementById('toggle-error-btn').addEventListener('click', event => {
  const wizard = document.getElementById('wizard');
  const apiUsers = wizard.shadowRoot?.querySelector('ac-api-users');
  if (!apiUsers) return;

  apiUsers.simulateError = !apiUsers.simulateError;
  event.target.textContent = apiUsers.simulateError
    ? 'Simulando error (click para desactivar)'
    : 'Simular error en el guardado';
});
