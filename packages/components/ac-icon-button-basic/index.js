import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { IconButtonBasic } from './src/icon-button-basic.js';

export { IconButtonBasic } from './src/icon-button-basic.js';

registerTranslations(IconButtonBasic.is, locales);

// Auto-registro del componente
customElements.define(IconButtonBasic.is, IconButtonBasic);
