import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { RegistroWizardModalResultado } from './src/elements/modal-resultado/registro-wizard-modal-resultado.js';
import { RegistroWizardStepDatos } from './src/elements/step-datos/registro-wizard-step-datos.js';
import { RegistroWizardStepPreferencias } from './src/elements/step-preferencias/registro-wizard-step-preferencias.js';
import { RegistroWizardStepResumen } from './src/elements/step-resumen/registro-wizard-step-resumen.js';
import { RegistroWizardSteps } from './src/elements/steps/registro-wizard-steps.js';
import { RegistroWizard } from './src/registro-wizard.js';

export { RegistroWizard } from './src/registro-wizard.js';
export { RegistroWizardSteps } from './src/elements/steps/registro-wizard-steps.js';
export { RegistroWizardStepDatos } from './src/elements/step-datos/registro-wizard-step-datos.js';
export { RegistroWizardStepPreferencias } from './src/elements/step-preferencias/registro-wizard-step-preferencias.js';
export { RegistroWizardStepResumen } from './src/elements/step-resumen/registro-wizard-step-resumen.js';
export { RegistroWizardModalResultado } from './src/elements/modal-resultado/registro-wizard-modal-resultado.js';

const ELEMENTS = [
  RegistroWizard,
  RegistroWizardSteps,
  RegistroWizardStepDatos,
  RegistroWizardStepPreferencias,
  RegistroWizardStepResumen,
  RegistroWizardModalResultado,
];

// Auto-registro del componente y de sus elementos internos (todos comparten el
// mismo locales.json: sus claves de traducción usan el prefijo registro-wizard-*
// sin importar cuál de los 6 elementos la consume).
ELEMENTS.forEach(ElementClass => {
  registerTranslations(ElementClass.is, locales);
  customElements.define(ElementClass.is, ElementClass);
});
