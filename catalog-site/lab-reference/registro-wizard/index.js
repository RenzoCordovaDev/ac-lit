import { RegistroWizard } from './src/registro-wizard.js';

export { RegistroWizard } from './src/registro-wizard.js';

// Auto-registro del componente (mismo patrón que cualquier componente real del catálogo).
customElements.define(RegistroWizard.is, RegistroWizard);
