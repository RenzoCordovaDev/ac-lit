import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// El componente nunca se cierra ni se remueve a sí mismo (ver
// docs/CONVENTIONS.md, "Emerald Pro" / componente ac-notification-basic) —
// esta demo escucha su evento de cierre y saca el nodo, tal como lo haría una
// app real recorriendo la lista de notificaciones activas.
document.addEventListener('ac-notification-basic-dismiss-click', event => {
  if (event.target.tagName === 'AC-NOTIFICATION-BASIC') event.target.remove();
});
