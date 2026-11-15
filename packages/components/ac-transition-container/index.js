import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { TransitionContainer } from './src/transition-container.js';

export { TransitionContainer } from './src/transition-container.js';

registerTranslations(TransitionContainer.is, locales);

// Auto-registro del componente
customElements.define(TransitionContainer.is, TransitionContainer);
