import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { HeaderBasic } from './src/header-basic.js';

export { HeaderBasic } from './src/header-basic.js';

registerTranslations(HeaderBasic.is, locales);

// Auto-registro del componente
customElements.define(HeaderBasic.is, HeaderBasic);
