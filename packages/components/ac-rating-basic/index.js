import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { RatingBasic } from './src/rating-basic.js';

export { RatingBasic } from './src/rating-basic.js';

registerTranslations(RatingBasic.is, locales);

// Auto-registro del componente
customElements.define(RatingBasic.is, RatingBasic);
