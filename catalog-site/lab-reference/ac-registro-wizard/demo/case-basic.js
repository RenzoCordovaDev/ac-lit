// Script propio de este caso (demo/case-basic.html) — ver el comentario largo
// en demo-case.js sobre el camino "documento completo": al vivir en su propio
// <iframe>, este archivo puede traer su propia lógica en vez de acumularla en
// el demo.js compartido de todo el demo (como pasaba antes con el listener
// delegado de #toggle-error-btn).
import '../index.js';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
import '@ac-base/ac-demo-content/case-event-bridge.js';

const wizard = () => document.getElementById('wizard');

async function initWizard() {
  const el = wizard();
  if (!el) return;
  await el.updateComplete;
  el.init();
}

document.getElementById('toggle-error-btn').addEventListener('click', event => {
  const apiUsers = wizard()?.shadowRoot?.querySelector('ac-api-users');
  if (!apiUsers) return;

  apiUsers.simulateError = !apiUsers.simulateError;
  event.target.textContent = apiUsers.simulateError
    ? 'Simulando error (click para desactivar)'
    : 'Simular error en el guardado';
});

initWizard();
