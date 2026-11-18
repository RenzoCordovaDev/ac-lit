import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class RegistroWizardPage extends ComponentObject {
  constructor(testId = 'registro-wizard-default') {
    super({ selector: `[data-testid="${testId}"]` });
  }

  async snapshot() {
    return browser.execute(selector => {
      const el = document.querySelector(selector);
      const steps = [...el.shadowRoot.querySelectorAll('ac-expandable-step')];
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
      (selector, nombreValue, emailValue) => {
        const el = document.querySelector(selector);
        const [nombreInput, emailInput] = el.shadowRoot.querySelectorAll('ac-input-basic');
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
    );
  }

  async acceptTerminos() {
    await browser.execute(selector => {
      const el = document.querySelector(selector);
      const checkbox = el.shadowRoot.querySelector('ac-checkbox-basic');
      const input = checkbox.shadowRoot.querySelector('input');
      input.checked = true;
      input.dispatchEvent(new Event('change'));
    }, this.selector);
  }

  async clickActionButton(index) {
    await browser.execute(
      (selector, i) => {
        const el = document.querySelector(selector);
        const button = el.shadowRoot.querySelectorAll('.registro-wizard__actions ac-button-basic')[
          i
        ];
        button.shadowRoot.querySelector('button').click();
      },
      this.selector,
      index,
    );
  }
}
