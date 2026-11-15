import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { TextareaBasic } from './src/textarea-basic.js';

export { TextareaBasic } from './src/textarea-basic.js';

registerTranslations(TextareaBasic.is, locales);

// Auto-registro del componente
customElements.define(TextareaBasic.is, TextareaBasic);
