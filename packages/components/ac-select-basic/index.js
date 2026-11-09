import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { SelectBasic } from './src/select-basic.js';

export { SelectBasic } from './src/select-basic.js';

registerTranslations(SelectBasic.is, locales);

// Auto-registro del componente
customElements.define(SelectBasic.is, SelectBasic);
