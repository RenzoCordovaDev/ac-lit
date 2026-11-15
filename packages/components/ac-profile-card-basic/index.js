import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { ProfileCardBasic } from './src/profile-card-basic.js';

export { ProfileCardBasic } from './src/profile-card-basic.js';

registerTranslations(ProfileCardBasic.is, locales);

// Auto-registro del componente
customElements.define(ProfileCardBasic.is, ProfileCardBasic);
