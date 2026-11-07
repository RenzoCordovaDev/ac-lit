import '../index.js';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import { setGlobalLocale } from '@ac-base/ac-intl-mixin';

const localeSelect = document.querySelector('#locale-select');
const eventLog = document.querySelector('#event-log');

localeSelect.addEventListener('change', () => {
  setGlobalLocale(localeSelect.value);
});

document.addEventListener('ac-link-basic-click', () => {
  const entry = document.createElement('div');
  entry.textContent = `[${new Date().toLocaleTimeString()}] ac-link-basic-click`;
  eventLog.prepend(entry);
});
