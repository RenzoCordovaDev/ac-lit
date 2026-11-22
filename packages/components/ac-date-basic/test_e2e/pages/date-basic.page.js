import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class DateBasicPage extends ComponentObject {
  constructor(scope) {
    super({ selector: '[data-testid="date-basic-default"]', scope });
  }
}
