import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { ContainerBasic } from './src/container-basic.js';

export { ContainerBasic } from './src/container-basic.js';

registerTranslations(ContainerBasic.is, locales);

// Auto-registro del componente
customElements.define(ContainerBasic.is, ContainerBasic);
