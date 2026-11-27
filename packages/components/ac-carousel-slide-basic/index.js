import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { CarouselSlideBasic } from './src/carousel-slide-basic.js';

export { CarouselSlideBasic } from './src/carousel-slide-basic.js';

registerTranslations(CarouselSlideBasic.is, locales);

// Auto-registro del componente
customElements.define(CarouselSlideBasic.is, CarouselSlideBasic);
