import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

const demo = document.querySelector('ac-demo-content');

demo.addEventListener('ac-pagination-basic-page-change', event => {
  const list = event.target.closest('[data-paginated-list]');
  if (!list) return;

  for (const items of list.querySelectorAll('[data-list-page]')) {
    items.hidden = Number(items.dataset.listPage) !== event.detail.page;
  }
});

demo.addEventListener('change', event => {
  const checkbox = event.target;
  if (!checkbox.matches('[data-disable-pagination]')) return;

  const pagination = checkbox.closest('section').querySelector('ac-pagination-basic');
  pagination.disabled = checkbox.checked;
});
