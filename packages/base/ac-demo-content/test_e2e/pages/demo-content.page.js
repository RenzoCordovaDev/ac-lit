import { ComponentObject } from '@ac-base/ac-e2e-testing';

const HOST_SELECTOR = '[data-testid="demo-content"]';

export class DemoContentPage extends ComponentObject {
  constructor() {
    super({ selector: HOST_SELECTOR });
  }

  get caseSelect() {
    return $(HOST_SELECTOR).$('.ac-demo-content__case-select');
  }

  get localeSwitch() {
    return $(HOST_SELECTOR).$('.ac-demo-content__locale-switch');
  }

  get ambientSelect() {
    return $(HOST_SELECTOR).$('.ac-demo-content__ambient-select');
  }

  get themeToggle() {
    return $(HOST_SELECTOR).$('.ac-demo-content__theme-toggle');
  }

  get deviceFrame() {
    return $(HOST_SELECTOR).$('.ac-demo-content__device-frame');
  }

  deviceButton(key) {
    return $(HOST_SELECTOR).$(`[data-device="${key}"]`);
  }

  get eventsButton() {
    return $(HOST_SELECTOR).$('.ac-demo-content__events-button');
  }

  get eventsModal() {
    return $(HOST_SELECTOR).$('.ac-demo-content__modal');
  }

  get eventsModalList() {
    return $(HOST_SELECTOR).$('.ac-demo-content__modal-list');
  }
}
