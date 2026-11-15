import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { CardBasic } from './src/card-basic.js';

export { CardBasic } from './src/card-basic.js';

registerTranslations(CardBasic.is, locales);

// Auto-registro del componente
customElements.define(CardBasic.is, CardBasic);
