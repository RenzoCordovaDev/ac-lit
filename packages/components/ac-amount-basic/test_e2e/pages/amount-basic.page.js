import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class AmountBasicPage extends ComponentObject {
  constructor(scope) {
    super({ selector: '[data-testid="amount-default"]', scope });
  }
}
