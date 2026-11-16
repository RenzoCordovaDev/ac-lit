import { ComponentObject } from '@ac-base/ac-e2e-testing';

export const DIVIDER_SELECTORS = {
  'sin-label': '[data-testid="divider-basic-no-label"]',
  'con-label': '[data-testid="divider-basic-short-label"]',
};

export class DividerBasicPage extends ComponentObject {
  constructor(variant) {
    super({ selector: DIVIDER_SELECTORS[variant] });
  }

  get rootPart() {
    return this.root.$('[part="root"]');
  }
}
