import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

function wizard() {
  return document.getElementById('wizard');
}

document.addEventListener('ac-demo-case-load', async () => {
  const el = wizard();
  if (!el) return;
  await el.updateComplete;
  el.init();
});

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
