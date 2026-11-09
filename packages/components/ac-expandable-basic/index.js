import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { ExpandableBasic } from './src/expandable-basic.js';

export { ExpandableBasic } from './src/expandable-basic.js';

registerTranslations(ExpandableBasic.is, locales);

// Auto-registro del componente
customElements.define(ExpandableBasic.is, ExpandableBasic);
