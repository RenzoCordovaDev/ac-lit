import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { SwitchBasic } from './src/switch-basic.js';

export { SwitchBasic } from './src/switch-basic.js';

registerTranslations(SwitchBasic.is, locales);

// Auto-registro del componente
customElements.define(SwitchBasic.is, SwitchBasic);
