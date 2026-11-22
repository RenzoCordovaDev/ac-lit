import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

suite('ac-amount-basic', () => {
  test('defaults to amount=0', async () => {
    const el = await fixture(html`<ac-amount-basic></ac-amount-basic>`);
    expect(el.amount).to.equal(0);
  });

  test('defaults to currency="PEN"', async () => {
    const el = await fixture(html`<ac-amount-basic></ac-amount-basic>`);
    expect(el.currency).to.equal('PEN');
  });

  test('defaults to size="md"', async () => {
    const el = await fixture(html`<ac-amount-basic></ac-amount-basic>`);
    expect(el.size).to.equal('md');
  });

  test('defaults to tag="span"', async () => {
    const el = await fixture(html`<ac-amount-basic></ac-amount-basic>`);
    expect(el.tag).to.equal('span');
  });

  test('defaults to ambient="default"', async () => {
    const el = await fixture(html`<ac-amount-basic></ac-amount-basic>`);
    expect(el.ambient).to.equal('default');
  });

  test('renders its text through an inner ac-text-basic', async () => {
    const el = await fixture(html`<ac-amount-basic></ac-amount-basic>`);
    expect(el.shadowRoot.querySelector('[part="root"]').tagName.toLowerCase()).to.equal(
      'ac-text-basic',
    );
  });

  test('formats the amount using the given currency', async () => {
    const el = await fixture(
      html`<ac-amount-basic amount="1234.5" currency="USD"></ac-amount-basic>`,
    );
    await el.updateComplete;
    const expected = new Intl.NumberFormat(el.locale, {
      style: 'currency',
      currency: 'USD',
    }).format(1234.5);
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal(expected);
  });

  test('formats the same amount differently for another currency', async () => {
    const el = await fixture(
      html`<ac-amount-basic amount="1234.5" currency="EUR"></ac-amount-basic>`,
    );
    await el.updateComplete;
    const expected = new Intl.NumberFormat(el.locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(1234.5);
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal(expected);
  });

  test('re-formats when `locale` changes', async () => {
    const el = await fixture(
      html`<ac-amount-basic amount="1234.5" currency="PEN"></ac-amount-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    const expected = new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'PEN' }).format(
      1234.5,
    );
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal(expected);
  });

  test('falls back to PEN when `currency` is not a valid ISO 4217 code', async () => {
    const el = await fixture(html`<ac-amount-basic amount="10" currency="NOPE"></ac-amount-basic>`);
    await el.updateComplete;
    const expected = new Intl.NumberFormat(el.locale, {
      style: 'currency',
      currency: 'PEN',
    }).format(10);
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal(expected);
  });

  test('forwards `size` to the inner ac-text-basic', async () => {
    const el = await fixture(html`<ac-amount-basic size="lg"></ac-amount-basic>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').getAttribute('size')).to.equal('lg');
  });

  test('forwards `tag` to the inner ac-text-basic', async () => {
    const el = await fixture(html`<ac-amount-basic tag="strong"></ac-amount-basic>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').getAttribute('tag')).to.equal('strong');
  });

  test('forwards `ambient` to the inner ac-text-basic', async () => {
    const el = await fixture(html`<ac-amount-basic ambient="primary"></ac-amount-basic>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').getAttribute('ambient')).to.equal(
      'primary',
    );
  });
});
