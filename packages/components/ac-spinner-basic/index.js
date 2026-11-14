import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { SpinnerBasic } from './src/spinner-basic.js';

export { SpinnerBasic } from './src/spinner-basic.js';

registerTranslations(SpinnerBasic.is, locales);

// Auto-registro del componente
customElements.define(SpinnerBasic.is, SpinnerBasic);
