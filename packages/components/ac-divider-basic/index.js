import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { DividerBasic } from './src/divider-basic.js';

export { DividerBasic } from './src/divider-basic.js';

registerTranslations(DividerBasic.is, locales);

// Auto-registro del componente
customElements.define(DividerBasic.is, DividerBasic);
