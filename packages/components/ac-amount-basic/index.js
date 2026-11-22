import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { AmountBasic } from './src/amount-basic.js';

export { AmountBasic } from './src/amount-basic.js';

registerTranslations(AmountBasic.is, locales);

// Auto-registro del componente
customElements.define(AmountBasic.is, AmountBasic);
