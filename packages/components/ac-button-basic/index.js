import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { ButtonBasic } from './src/button-basic.js';

export { ButtonBasic } from './src/button-basic.js';

registerTranslations(ButtonBasic.is, locales);

// Auto-registro del componente
customElements.define(ButtonBasic.is, ButtonBasic);
