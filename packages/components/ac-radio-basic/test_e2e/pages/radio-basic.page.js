import { ComponentObject } from '@ac-base/ac-e2e-testing';

export const RADIO_SELECTORS = {
  monthly: '[data-testid="radio-monthly"]',
  annual: '[data-testid="radio-annual"]',
  lifetime: '[data-testid="radio-lifetime"]',
  disabled: '[data-testid="radio-disabled"]',
};

export class RadioBasicPage extends ComponentObject {
  constructor(key) {
    super({ selector: RADIO_SELECTORS[key] });
  }
}
