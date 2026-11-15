import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ProfileCardBasicPage extends ComponentObject {
  constructor(testId = 'profile-card-basic-default') {
    super({ selector: `[data-testid="${testId}"]` });
  }

  get name() {
    return this.root.$('[part="name"]');
  }

  get status() {
    return this.root.$('[part="status"]');
  }

  get actionButton() {
    return this.root.$('[part="action"]');
  }
}
