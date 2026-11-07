import { LitElement, html } from 'lit';
import { fixture, expect, nextFrame } from '@open-wc/testing';
import { IntlMixin } from './intl-mixin.js';

class AcTestI18n extends IntlMixin(LitElement) {
  static get is() {
    return 'ac-test-i18n';
  }
  render() {
    return html`${this.t('greeting', { name: 'Ada' })}`;
  }
}
customElements.define(AcTestI18n.is, AcTestI18n);

describe('IntlMixin', () => {
  it('returns the key itself when no translation is loaded', async () => {
    const el = await fixture(html`<ac-test-i18n></ac-test-i18n>`);
    expect(el.t('greeting')).to.equal('greeting');
  });

  it('translates and interpolates params for the current locale', async () => {
    const el = await fixture(html`<ac-test-i18n></ac-test-i18n>`);
    el.loadTranslations({ 'es-PE': { greeting: 'Hola {name}' } });
    el.locale = 'es-PE';
    expect(el.t('greeting', { name: 'Ada' })).to.equal('Hola Ada');
  });

  it('propagates setLocale globally to other mounted instances', async () => {
    const a = await fixture(html`<ac-test-i18n></ac-test-i18n>`);
    const b = await fixture(html`<ac-test-i18n></ac-test-i18n>`);

    a.setLocale('en-EN');
    await nextFrame();

    expect(a.getLocale()).to.equal('en-EN');
    expect(b.getLocale()).to.equal('en-EN');
  });
});
