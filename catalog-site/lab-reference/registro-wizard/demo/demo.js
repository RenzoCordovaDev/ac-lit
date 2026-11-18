import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// El caso se carga con fetch + innerHTML (ac-demo-case), así que no puede
// traer <script>: el cableado del botón de prueba se hace acá, por
// delegación de eventos (mismo patrón que las demos de ac-api-*). Por el
// mismo motivo, `init()` no se llama al cargar este módulo -- el elemento
// `#wizard` todavía no existe en el documento en ese momento -- sino recién
// cuando `ac-demo-case` confirma que terminó de insertar su contenido
// (evento `ac-demo-case-load`, ver src/demo-case.js).

function wizard() {
  return document.getElementById('wizard');
}

document.addEventListener('ac-demo-case-load', async () => {
  const el = wizard();
  if (!el) return;
  // Espera el primer render para que el `ref()` interno de `ac-api-users` ya
  // esté asignado antes de llamar a `init()` (si no, `_apiUsersRef.value`
  // todavía sería `undefined`).
  await el.updateComplete;
  el.init();
});

// Botón de prueba: alterna `simulate-error` en el `ac-api-users` interno del
// wizard para poder probar el camino de error del guardado desde la demo.
// El wizard no expone esto por su API pública (solo `init()`/`reset()`, ver
// non-negotiable #3) -- la demo lee el shadow root igual que lo haría
// cualquier herramienta externa de inspección/test, no el propio componente.
document.addEventListener('click', event => {
  const trigger = event.target.closest?.('#toggle-error-btn');
  if (!trigger) return;

  const apiUsers = wizard()?.shadowRoot?.querySelector('ac-api-users');
  if (!apiUsers) return;

  apiUsers.simulateError = !apiUsers.simulateError;
  trigger.textContent = apiUsers.simulateError
    ? 'Simulando error (click para desactivar)'
    : 'Simular error en el guardado';
});
