import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { FooterBasic } from './src/footer-basic.js';

export { FooterBasic } from './src/footer-basic.js';

registerTranslations(FooterBasic.is, locales);

// Auto-registro del componente
customElements.define(FooterBasic.is, FooterBasic);
