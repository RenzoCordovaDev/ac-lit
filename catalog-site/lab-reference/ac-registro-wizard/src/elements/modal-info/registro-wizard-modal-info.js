import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import '@ac-components/ac-text-basic';

import { RegistroWizardModalInfoStyles } from './registro-wizard-modal-info.styles.js';

/**
 * Contenido del modal de información general de ac-registro-wizard: explica qué es este caso de laboratorio y qué pasos recorre. Puramente estático -- no recibe propiedades ni dispara eventos.
 * @lit @webcomponent @customElement
 */
export class RegistroWizardModalInfo extends ComponentMixin(LitElement) {
  static get is() {
    return 'registro-wizard-modal-info';
  }

  static get styles() {
    return [componentBaseStyles, RegistroWizardModalInfoStyles];
  }

  render() {
    return html`
      <ac-text-basic
        tag="p"
        size="md"
        text=${this.t('registro-wizard-info-body-1')}
      ></ac-text-basic>
      <ac-text-basic
        tag="p"
        size="md"
        text=${this.t('registro-wizard-info-body-2')}
      ></ac-text-basic>
    `;
  }
}
