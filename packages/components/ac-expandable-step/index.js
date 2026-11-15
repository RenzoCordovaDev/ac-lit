import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { ExpandableStep } from './src/expandable-step.js';

export { ExpandableStep } from './src/expandable-step.js';

registerTranslations(ExpandableStep.is, locales);

// Auto-registro del componente
customElements.define(ExpandableStep.is, ExpandableStep);
