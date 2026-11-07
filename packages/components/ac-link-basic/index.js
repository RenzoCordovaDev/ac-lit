import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { LinkBasic } from './src/link-basic.js';

export { LinkBasic } from './src/link-basic.js';

registerTranslations(LinkBasic.is, locales);

// Auto-registro del componente
customElements.define(LinkBasic.is, LinkBasic);
