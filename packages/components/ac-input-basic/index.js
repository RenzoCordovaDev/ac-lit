import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { InputBasic } from './src/input-basic.js';

export { InputBasic } from './src/input-basic.js';

registerTranslations(InputBasic.is, locales);

// Auto-registro del componente
customElements.define(InputBasic.is, InputBasic);
