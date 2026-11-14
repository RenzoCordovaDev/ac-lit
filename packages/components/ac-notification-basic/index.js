import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { NotificationBasic } from './src/notification-basic.js';

export { NotificationBasic } from './src/notification-basic.js';

registerTranslations(NotificationBasic.is, locales);

// Auto-registro del componente
customElements.define(NotificationBasic.is, NotificationBasic);
