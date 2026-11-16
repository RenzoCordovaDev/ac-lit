import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ProgressBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** La pista con `role="progressbar"`, dentro del shadow root del componente. */
  get track() {
    return this.root.$('[part="track"]');
  }

  /** El relleno, cuyo ancho inline (`style="width: X%"`) refleja `value`. */
  get fill() {
    return this.root.$('[part="fill"]');
  }
}
