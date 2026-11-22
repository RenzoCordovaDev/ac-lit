import '../index.js';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
import '@ac-base/ac-demo-content/case-event-bridge.js';

// Los casos ahora son documentos completos cargados en un <iframe> (ver
// ac-demo-case.js), así que el cableado de abrir/cerrar ya podría ir en un
// <script> propio de cada caso en vez de acá — queda en un archivo
// compartido porque los 2 casos de este componente usan el mismo patrón de
// atributos data-*, sin necesidad de duplicarlo.
//   data-open-modal="id"        al hacer click, abre el modal con ese id
//   data-close-on-primary       el modal se cierra al pulsar su botón principal
//   data-close-on-secondary     el modal se cierra al pulsar su botón secundario
document.addEventListener('click', event => {
  const trigger = event.target.closest?.('[data-open-modal]');
  if (trigger) {
    document.getElementById(trigger.dataset.openModal).open = true;
  }
});

document.addEventListener('ac-modal-basic-primary-click', event => {
  if (event.target.hasAttribute('data-close-on-primary')) event.target.hide();
});

document.addEventListener('ac-modal-basic-secondary-click', event => {
  if (event.target.hasAttribute('data-close-on-secondary')) event.target.hide();
});
