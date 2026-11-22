import '../index.js';
import '@ac-components/ac-button-basic';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
import '@ac-base/ac-demo-content/case-event-bridge.js';

// Los casos ahora son documentos completos cargados en un <iframe> (ver
// ac-demo-case.js), así que el cableado de mostrar/ocultar ya podría ir en un
// <script> propio de cada caso en vez de acá — queda en un archivo
// compartido porque los 2 casos de este componente usan el mismo patrón de
// atributos data-*, sin necesidad de duplicarlo.
//   data-show-toast="id1 id2"   al hacer click, muestra los toasts con esos ids
document.addEventListener('click', event => {
  const trigger = event.target.closest?.('[data-show-toast]');
  if (!trigger) return;

  for (const id of trigger.dataset.showToast.split(/\s+/)) {
    document.getElementById(id).show();
  }
});
