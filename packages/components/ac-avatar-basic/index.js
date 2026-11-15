import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { AvatarBasic } from './src/avatar-basic.js';

export { AvatarBasic } from './src/avatar-basic.js';

registerTranslations(AvatarBasic.is, locales);

// Auto-registro del componente
customElements.define(AvatarBasic.is, AvatarBasic);
