import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import '@ac-components/ac-expandable-step';
import { ExpandableMultistep } from './src/expandable-multistep.js';

export { ExpandableMultistep } from './src/expandable-multistep.js';

registerTranslations(ExpandableMultistep.is, locales);

// Auto-registro del componente
customElements.define(ExpandableMultistep.is, ExpandableMultistep);
