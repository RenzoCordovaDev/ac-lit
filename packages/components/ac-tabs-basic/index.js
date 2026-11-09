import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { TabsBasic } from './src/tabs-basic.js';

export { TabsBasic } from './src/tabs-basic.js';

registerTranslations(TabsBasic.is, locales);

// Auto-registro del componente
customElements.define(TabsBasic.is, TabsBasic);
