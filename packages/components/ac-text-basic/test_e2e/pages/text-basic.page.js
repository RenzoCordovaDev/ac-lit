import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class TextBasicPage extends ComponentObject {
  constructor(testId = 'text-slot') {
    super({ selector: `[data-testid="${testId}"]` });
  }

  /** Etiqueta real que renderiza el componente dentro de su shadow root. */
  get renderedElement() {
    return this.root.$('[part="root"]');
  }
}
