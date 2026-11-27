import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { BreadcrumbBasic } from './src/breadcrumb-basic.js';

export { BreadcrumbBasic } from './src/breadcrumb-basic.js';

registerTranslations(BreadcrumbBasic.is, locales);

// Auto-registro del componente
customElements.define(BreadcrumbBasic.is, BreadcrumbBasic);
