import { ComponentObject } from '@ac-base/ac-e2e-testing';

export const BUTTON_SELECTORS = {
  enabled: '[data-testid="btn-enabled"]',
  disabled: '[data-testid="btn-disabled"]',
  loading: '[data-testid="btn-loading"]',
};

export class ButtonBasicPage extends ComponentObject {
  constructor(state) {
    super({ selector: BUTTON_SELECTORS[state] });
  }
}
