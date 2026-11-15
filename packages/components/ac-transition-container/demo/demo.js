import '../index.js';
import '@ac-components/ac-button-basic';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Los casos se cargan con fetch + innerHTML, así que no pueden traer <script>: el
// cableado de abrir/cerrar se hace aquí, por delegación, con atributos de datos.
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
