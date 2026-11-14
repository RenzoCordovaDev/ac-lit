import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class NotificationBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  get dismissButton() {
    return this.root.$('[part="dismiss"]');
  }
}
