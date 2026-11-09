import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { SliderBasic } from './src/slider-basic.js';

export { SliderBasic } from './src/slider-basic.js';

registerTranslations(SliderBasic.is, locales);

// Auto-registro del componente
customElements.define(SliderBasic.is, SliderBasic);
