import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { ListBasic } from './src/list-basic.js';

export { ListBasic } from './src/list-basic.js';

registerTranslations(ListBasic.is, locales);

// Auto-registro del componente
customElements.define(ListBasic.is, ListBasic);
