import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { BadgeBasic } from './src/badge-basic.js';

export { BadgeBasic } from './src/badge-basic.js';

registerTranslations(BadgeBasic.is, locales);

// Auto-registro del componente
customElements.define(BadgeBasic.is, BadgeBasic);
