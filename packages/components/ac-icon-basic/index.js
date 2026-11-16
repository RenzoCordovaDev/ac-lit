import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { IconBasic } from './src/icon-basic.js';

export { IconBasic } from './src/icon-basic.js';

registerTranslations(IconBasic.is, locales);

// Auto-registro del componente
customElements.define(IconBasic.is, IconBasic);
