import '../index.js';
import '@ac-components/ac-button-basic';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Los casos se cargan con fetch + innerHTML, así que no pueden traer <script>: el
// cableado de mostrar/ocultar se hace aquí, por delegación, con atributos de datos.
//   data-show-toast="id1 id2"   al hacer click, muestra los toasts con esos ids
document.addEventListener('click', event => {
  const trigger = event.target.closest?.('[data-show-toast]');
  if (!trigger) return;

  for (const id of trigger.dataset.showToast.split(/\s+/)) {
    document.getElementById(id).show();
  }
});
