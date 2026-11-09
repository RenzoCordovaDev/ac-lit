import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { ToastBasic } from './src/toast-basic.js';

export { ToastBasic } from './src/toast-basic.js';

registerTranslations(ToastBasic.is, locales);

// Auto-registro del componente
customElements.define(ToastBasic.is, ToastBasic);
