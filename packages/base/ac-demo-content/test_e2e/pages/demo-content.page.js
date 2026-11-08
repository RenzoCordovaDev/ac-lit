import { ComponentObject } from '@ac-base/ac-e2e-testing';

const HOST_SELECTOR = '[data-testid="demo-content"]';

export class DemoContentPage extends ComponentObject {
  constructor() {
    super({ selector: HOST_SELECTOR });
  }

  get caseSelect() {
    return $(HOST_SELECTOR).$('.ac-demo-content__case-select');
  }

  get localeSelect() {
    return $(HOST_SELECTOR).$('.ac-demo-content__locale-select');
  }

  get ambientSelect() {
    return $(HOST_SELECTOR).$('.ac-demo-content__ambient-select');
  }

  get sizeSelect() {
    return $(HOST_SELECTOR).$('.ac-demo-content__size-select');
  }

  get themeToggle() {
    return $(HOST_SELECTOR).$('.ac-demo-content__theme-toggle');
  }

  get eventLog() {
    return $(HOST_SELECTOR).$('.ac-demo-content__event-log');
  }
}
