import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { TextBasic } from './src/text-basic.js';

export { TextBasic, addTextTranslations } from './src/text-basic.js';

registerTranslations(TextBasic.is, locales);

// Auto-registro del componente
customElements.define(TextBasic.is, TextBasic);
