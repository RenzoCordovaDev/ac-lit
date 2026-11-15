import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ExpandableMultistepPage extends ComponentObject {
  constructor() {
    super({ selector: '[data-testid="expandable-multistep-basic"]' });
  }

  step(number) {
    return this.root.$(`[data-testid="step-${number}"]`);
  }

  continueButton(number) {
    return this.root.$(`[data-testid="continue-step-${number}"]`);
  }

  editLink(number) {
    return this.step(number).$('[part="edit"]');
  }

  get confirmation() {
    return this.root.$('[data-testid="confirmation"]');
  }

  async property(number, name) {
    return browser.execute(
      (testId, prop) => document.querySelector(`[data-testid="${testId}"]`)[prop],
      `step-${number}`,
      name,
    );
  }
}
