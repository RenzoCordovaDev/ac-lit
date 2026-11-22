import '../index.js';
import '@ac-components/ac-button-basic';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
import '@ac-base/ac-demo-content/case-event-bridge.js';

// Los casos ahora son documentos completos cargados en un <iframe> (ver
// ac-demo-case.js), así que el cableado de abrir/cerrar ya podría ir en un
// <script> propio de cada caso en vez de acá — queda en un archivo
// compartido porque los 2 casos de este componente usan el mismo patrón de
// atributos data-*, sin necesidad de duplicarlo.
//   data-open-transition="id"   al hacer click, abre el ac-transition-container con ese id
//   data-close-on-back          el contenedor se cierra al pulsar su flecha de volver
document.addEventListener('click', event => {
  const trigger = event.target.closest?.('[data-open-transition]');
  if (trigger) {
    document.getElementById(trigger.dataset.openTransition).show();
  }
});

document.addEventListener('ac-transition-container-header-back-icon-click', event => {
  if (event.target.hasAttribute('data-close-on-back')) event.target.hide();
});
