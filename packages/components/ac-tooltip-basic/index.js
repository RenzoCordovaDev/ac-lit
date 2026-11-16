import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { TooltipBasic } from './src/tooltip-basic.js';

export { TooltipBasic } from './src/tooltip-basic.js';

registerTranslations(TooltipBasic.is, locales);

// Auto-registro del componente
customElements.define(TooltipBasic.is, TooltipBasic);
