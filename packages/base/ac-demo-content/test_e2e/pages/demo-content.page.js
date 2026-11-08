import { ComponentObject } from '@ac-base/ac-e2e-testing';

const HOST_SELECTOR = '[data-testid="demo-content"]';

export class DemoContentPage extends ComponentObject {
  constructor() {
    super({ selector: HOST_SELECTOR });
  }

  get caseSelect() {
    return $(HOST_SELECTOR).$('.ac-demo-content__case-select');
  }

  get ambientSelect() {
    return $(HOST_SELECTOR).$('.ac-demo-content__ambient-select');
  }

  get deviceFrame() {
    return $(HOST_SELECTOR).$('.ac-demo-content__device-frame');
  }

  deviceButton(key) {
    return $(HOST_SELECTOR).$(`.ac-demo-content__device-switcher [data-value="${key}"]`);
  }

  themeButton(theme) {
    return $(HOST_SELECTOR).$(`.ac-demo-content__theme-switcher [data-value="${theme}"]`);
  }

  languageButton(index) {
    return $(HOST_SELECTOR).$(`.ac-demo-content__locale-switcher [data-value="${index}"]`);
  }

  viewModeButton(mode) {
    return $(HOST_SELECTOR).$(`.ac-demo-content__viewmode-switcher [data-value="${mode}"]`);
  }

  get codeBlock() {
    return $(HOST_SELECTOR).$('.ac-demo-content__code-block');
  }

  get eventsButton() {
    return $(HOST_SELECTOR).$('.ac-demo-content__events-button');
  }

  get eventsPanel() {
    return $(HOST_SELECTOR).$('.ac-demo-content__modal');
  }

  get eventsPanelList() {
    return $(HOST_SELECTOR).$('.ac-demo-content__modal-list');
  }
}
