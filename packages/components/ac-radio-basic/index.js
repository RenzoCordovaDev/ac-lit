import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { RadioBasic } from './src/radio-basic.js';

export { RadioBasic } from './src/radio-basic.js';

registerTranslations(RadioBasic.is, locales);

// Auto-registro del componente
customElements.define(RadioBasic.is, RadioBasic);
