import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { __class_name__ } from './src/__file_base__.js';

export { __class_name__ } from './src/__file_base__.js';

registerTranslations(__class_name__.is, locales);

// Auto-registro del componente
customElements.define(__class_name__.is, __class_name__);
