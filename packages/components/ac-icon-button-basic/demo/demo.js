import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Cableado del caso de interacción: los casos se cargan con fetch+innerHTML
// (ver docs/CONVENTIONS.md), así que no pueden traer <script> propio — el
// click nativo del botón solo-ícono (composed: true) burbujea igual hasta
// `document`, sin importar en qué shadow root/slot haya nacido.
document.addEventListener('click', event => {
  const target = event
    .composedPath()
    .find(node => node?.dataset?.testid === 'icon-button-click-target');
  if (!target) return;

  const counter = document.querySelector('[data-testid="icon-button-click-count"]');
  if (counter) {
    counter.textContent = String(Number(counter.textContent) + 1);
  }
});
