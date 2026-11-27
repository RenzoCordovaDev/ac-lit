import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { CarouselBasic } from './src/carousel-basic.js';

export { CarouselBasic } from './src/carousel-basic.js';

registerTranslations(CarouselBasic.is, locales);

// Auto-registro del componente
customElements.define(CarouselBasic.is, CarouselBasic);
