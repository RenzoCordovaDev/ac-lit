import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { RegistroWizard } from './src/registro-wizard.js';

export { RegistroWizard } from './src/registro-wizard.js';

registerTranslations(RegistroWizard.is, locales);

// Auto-registro del componente
customElements.define(RegistroWizard.is, RegistroWizard);
