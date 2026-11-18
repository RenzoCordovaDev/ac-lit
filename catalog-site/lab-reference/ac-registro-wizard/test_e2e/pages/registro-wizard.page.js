import { ComponentObject } from '@ac-base/ac-e2e-testing';

const STEP_CONTENT_TAGS = [
  'registro-wizard-step-datos',
  'registro-wizard-step-preferencias',
  'registro-wizard-step-resumen',
];

const STEP_ACTIONS_CLASS = [
  'registro-wizard-step-datos__actions',
  'registro-wizard-step-preferencias__actions',
  'registro-wizard-step-resumen__actions',
];

export class RegistroWizardPage extends ComponentObject {
  constructor(testId = 'registro-wizard-default') {
    super({ selector: `[data-testid="${testId}"]` });
  }

  async snapshot() {
    return browser.execute(selector => {
      const el = document.querySelector(selector);
      const stepsHost = el.shadowRoot.querySelector('registro-wizard-steps');
      const steps = [...stepsHost.shadowRoot.querySelectorAll('ac-expandable-step')];
      return {
        open: el._open,
        modalOpen: el._modalOpen,
        activeStepIndex: steps.findIndex(step => step.active),
        errorMessage: el._errorMessage,
        registeredUser: el._registeredUser,
      };
    }, this.selector);
  }

  async setApiTimeout(ms) {
    await browser.execute(
      (selector, timeout) => {
        document.querySelector(selector).shadowRoot.querySelector('ac-api-users').timeout = timeout;
      },
      this.selector,
      ms,
    );
  }

  async setSimulateError(value) {
    await browser.execute(
      (selector, simulateError) => {
        document.querySelector(selector).shadowRoot.querySelector('ac-api-users').simulateError =
          simulateError;
      },
      this.selector,
      value,
    );
  }

  async fillStep1(nombre, email) {
    await browser.execute(
      (selector, nombreValue, emailValue, contentTag) => {
        const el = document.querySelector(selector);
        const stepsHost = el.shadowRoot.querySelector('registro-wizard-steps');
        const step = stepsHost.shadowRoot.querySelectorAll('ac-expandable-step')[0];
        const datos = step.querySelector(contentTag);
        const [nombreInput, emailInput] = datos.shadowRoot.querySelectorAll('ac-input-basic');
        const nombreField = nombreInput.shadowRoot.querySelector('input');
        nombreField.value = nombreValue;
        nombreField.dispatchEvent(new Event('input'));
        const emailField = emailInput.shadowRoot.querySelector('input');
        emailField.value = emailValue;
        emailField.dispatchEvent(new Event('input'));
      },
      this.selector,
      nombre,
      email,
      STEP_CONTENT_TAGS[0],
    );
  }

  async acceptTerminos() {
    await browser.execute(
      (selector, contentTag) => {
        const el = document.querySelector(selector);
        const stepsHost = el.shadowRoot.querySelector('registro-wizard-steps');
        const step = stepsHost.shadowRoot.querySelectorAll('ac-expandable-step')[1];
        const preferencias = step.querySelector(contentTag);
        const checkbox = preferencias.shadowRoot.querySelector('ac-checkbox-basic');
        const input = checkbox.shadowRoot.querySelector('input');
        input.checked = true;
        input.dispatchEvent(new Event('change'));
      },
      this.selector,
      STEP_CONTENT_TAGS[1],
    );
  }

  async clickActionButton(index) {
    await browser.execute(
      (selector, i, contentTags, actionsClasses) => {
        const el = document.querySelector(selector);
        const stepsHost = el.shadowRoot.querySelector('registro-wizard-steps');
        const step = stepsHost.shadowRoot.querySelectorAll('ac-expandable-step')[i];
        const content = step.querySelector(contentTags[i]);
        const button = content.shadowRoot.querySelector(`.${actionsClasses[i]} ac-button-basic`);
        button.shadowRoot.querySelector('button').click();
      },
      this.selector,
      index,
      STEP_CONTENT_TAGS,
      STEP_ACTIONS_CLASS,
    );
  }
}
