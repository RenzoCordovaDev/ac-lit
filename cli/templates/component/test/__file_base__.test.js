import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

suite('__tag__', () => {
  test('renders slotted content by default', async () => {
    const el = await fixture(html`<__tag__>Hola</__tag__>`);
    expect(el.textContent.trim()).to.equal('Hola');
  });

  test('defaults to ambient="default"', async () => {
    const el = await fixture(html`<__tag__></__tag__>`);
    expect(el.ambient).to.equal('default');
  });

  test('renders a translated label when `text` is a locale key', async () => {
    const el = await fixture(html`<__tag__ text="__file_base__-label"></__tag__>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('span').textContent.trim()).to.equal('Hello');
  });
});
