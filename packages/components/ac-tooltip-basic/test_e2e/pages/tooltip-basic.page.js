import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class TooltipBasicPage extends ComponentObject {
  constructor(testId) {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** El trigger es contenido slotted (luz, no shadow) — un botón de ejemplo en cada caso. */
  get trigger() {
    return this.root.$('button');
  }

  /** El globo vive en el shadow root del componente. */
  get bubble() {
    return this.root.$('[part="bubble"]');
  }
}
