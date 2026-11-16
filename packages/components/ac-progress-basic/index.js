import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { ProgressBasic } from './src/progress-basic.js';

export { ProgressBasic } from './src/progress-basic.js';

registerTranslations(ProgressBasic.is, locales);

// Auto-registro del componente
customElements.define(ProgressBasic.is, ProgressBasic);
