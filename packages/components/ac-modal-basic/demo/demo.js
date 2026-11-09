import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Los casos se cargan con fetch + innerHTML, así que no pueden traer <script>: el
// cableado de abrir/cerrar se hace aquí, por delegación, con atributos de datos.
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
