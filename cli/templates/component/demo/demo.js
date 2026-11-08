import '../index.js';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import { setGlobalLocale } from '@ac-base/ac-intl-mixin';

const localeSelect = document.querySelector('#locale-select');

localeSelect.addEventListener('change', () => {
  setGlobalLocale(localeSelect.value);
});
