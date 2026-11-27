import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

document.querySelector('ac-demo-content').addEventListener('click', event => {
  const button = event.target.closest('[data-toggle-slide]');
  if (!button) return;

  const slide = document.getElementById(button.getAttribute('aria-controls'));
  slide.active = !slide.active;
  button.setAttribute('aria-expanded', String(slide.active));
});
