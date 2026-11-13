import '../index.js';
import '@ac-components/ac-expandable-step';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Los casos se cargan con fetch + innerHTML, así que no pueden traer <script>: el
// cableado del botón "Continuar"/"Finalizar" de cada paso se hace aquí, por
// delegación, con un atributo de datos.
//   data-complete-step="id-del-step"   al hacer click, completa ese ac-expandable-step
document.addEventListener('click', event => {
  const trigger = event.target.closest?.('[data-complete-step]');
  if (trigger) {
    document.getElementById(trigger.dataset.completeStep)?.complete();
  }
});
