import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class IconButtonBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }
}
