import '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
import locales from '../locales.json' with { type: 'json' };

const demo = document.querySelector('ac-demo-content');

function syncCaseLocale() {
  const activeCase = demo.querySelector('ac-demo-case[active]');
  if (!activeCase) return;

  const { languages, activeLanguage } = demo.demoState;
  const locale = languages[activeLanguage] ?? 'es-PE';
  activeCase.lang = locale;
  for (const el of activeCase.querySelectorAll('[data-demo-text]')) {
    el.textContent = locales[locale][el.dataset.demoText];
  }
}

demo.addEventListener('ac-demo-content-state-change', syncCaseLocale);
demo.addEventListener('ac-demo-case-load', syncCaseLocale);
