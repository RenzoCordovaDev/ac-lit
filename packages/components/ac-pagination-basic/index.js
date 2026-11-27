import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { PaginationBasic } from './src/pagination-basic.js';

export { PaginationBasic } from './src/pagination-basic.js';

registerTranslations(PaginationBasic.is, locales);

// Auto-registro del componente
customElements.define(PaginationBasic.is, PaginationBasic);
