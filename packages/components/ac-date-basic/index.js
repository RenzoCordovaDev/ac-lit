import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { DateBasic } from './src/date-basic.js';

export { DateBasic } from './src/date-basic.js';

registerTranslations(DateBasic.is, locales);

// Auto-registro del componente
customElements.define(DateBasic.is, DateBasic);
