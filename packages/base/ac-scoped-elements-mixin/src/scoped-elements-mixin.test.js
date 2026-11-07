import { LitElement, html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScopedElementsMixin } from './scoped-elements-mixin.js';

class AcTestDependency extends LitElement {
  static get is() {
    return 'ac-test-dependency';
  }
  render() {
    return html`dependency`;
  }
}

class AcTestHost extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return AcTestHost.scopedElementsFromClasses([AcTestDependency]);
  }
  render() {
    return html`<ac-test-dependency></ac-test-dependency>`;
  }
}
customElements.define('ac-test-host', AcTestHost);

describe('ScopedElementsMixin', () => {
  it('registers declared scoped elements as custom elements', async () => {
    const el = await fixture(html`<ac-test-host></ac-test-host>`);
    expect(customElements.get('ac-test-dependency')).to.equal(AcTestDependency);
    expect(el.getScopedElement('ac-test-dependency')).to.equal(AcTestDependency);
  });

  it('does not throw when re-registering an already-defined tag', () => {
    expect(() => new AcTestHost().defineScopedElement('ac-test-dependency', AcTestDependency)).to
      .not.throw;
  });
});
