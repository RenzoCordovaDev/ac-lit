import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

document.addEventListener('ac-list-basic-item-click', event => {
  const list = event.target.closest('ac-list-basic[data-select-on-click]');
  if (!list) return;

  list.items = list.items.map((item, index) => ({
    ...item,
    selected: index === event.detail.index,
  }));
});
