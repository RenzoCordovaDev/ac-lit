import { ComponentObject } from '@ac-base/ac-e2e-testing';

export const LINK_SELECTORS = {
  enabled: '[data-testid="link-enabled"]',
  disabled: '[data-testid="link-disabled"]',
};

export class LinkBasicPage extends ComponentObject {
  constructor(state) {
    super({ selector: LINK_SELECTORS[state] });
  }
}
