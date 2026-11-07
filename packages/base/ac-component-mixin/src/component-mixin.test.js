import { LitElement, html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ComponentMixin } from './component-mixin.js';
import { registerTranslations } from '@ac-base/ac-intl-mixin';

class AcTestComponent extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-test-component';
  }
  render() {
    return this.loading ? this._skeletonTemplate : html`<p>ready</p>`;
  }
}
customElements.define(AcTestComponent.is, AcTestComponent);

describe('ComponentMixin', () => {
  it('sets the documented default properties', async () => {
    const el = await fixture(html`<ac-test-component></ac-test-component>`);
    expect(el.ambient).to.equal('light');
    expect(el.mode).to.equal('default');
    expect(el.loading).to.be.false;
    expect(el.loadingA11yLabel).to.equal('Loading...');
  });

  it('renders the skeleton template while loading', async () => {
    const el = await fixture(html`<ac-test-component loading></ac-test-component>`);
    expect(el.shadowRoot.querySelector('.skeleton-loader')).to.exist;
  });

  describe('sanitizeHtml', () => {
    it('strips script tags by default', async () => {
      const el = await fixture(html`<ac-test-component></ac-test-component>`);
      const result = el.sanitizeHtml('<p>hi</p><script>alert(1)</script>');
      expect(result).to.equal('<p>hi</p>');
    });

    it('restricts output to an explicit allow-list of tags', async () => {
      const el = await fixture(html`<ac-test-component></ac-test-component>`);
      const result = el.sanitizeHtml('<p>hi <b>bold</b></p>', ['p']);
      expect(result).to.equal('<p>hi bold</p>');
    });

    it('strips tags rejected by a custom tagNameCheck predicate', async () => {
      const el = await fixture(html`<ac-test-component></ac-test-component>`);
      const result = el.sanitizeHtml('<p>hi</p><div>bye</div>', null, tag => tag !== 'div');
      expect(result).to.equal('<p>hi</p>');
    });
  });

  it('delegates scopedElementsFromClasses to ScopedElementsMixin', async () => {
    class Dep extends LitElement {
      static get is() {
        return 'ac-test-dep';
      }
    }
    const map = AcTestComponent.scopedElementsFromClasses([Dep]);
    expect(map).to.deep.equal({ 'ac-test-dep': Dep });
  });

  it('uses translations registered at build time for its own tag name', async () => {
    registerTranslations('ac-test-component', { 'es-PE': { hello: 'Hola' } });
    const el = await fixture(html`<ac-test-component></ac-test-component>`);
    el.locale = 'es-PE';
    expect(el.t('hello')).to.equal('Hola');
  });
});
