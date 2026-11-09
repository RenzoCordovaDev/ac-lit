import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { CheckboxBasic } from './src/checkbox-basic.js';

export { CheckboxBasic } from './src/checkbox-basic.js';

registerTranslations(CheckboxBasic.is, locales);

// Auto-registro del componente
customElements.define(CheckboxBasic.is, CheckboxBasic);
