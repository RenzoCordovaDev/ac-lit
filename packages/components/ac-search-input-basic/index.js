import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { SearchInputBasic } from './src/search-input-basic.js';

export { SearchInputBasic } from './src/search-input-basic.js';

registerTranslations(SearchInputBasic.is, locales);

// Auto-registro del componente
customElements.define(SearchInputBasic.is, SearchInputBasic);
