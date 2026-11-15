import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

const labelOf = el => el.shadowRoot.querySelector('.ac-spinner-basic__label');

suite('ac-spinner-basic', () => {
  test('defaults size to "md"', async () => {
    const el = await fixture(html`<ac-spinner-basic></ac-spinner-basic>`);
    expect(el.size).to.equal('md');
  });

  test('falls back to "md" with an invalid size', async () => {
    const el = await fixture(html`<ac-spinner-basic size="huge"></ac-spinner-basic>`);
    expect(el._size).to.equal('md');
  });

  test('defaults ambient to "primary"', async () => {
    const el = await fixture(html`<ac-spinner-basic></ac-spinner-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('renders role="status" on the root', async () => {
    const el = await fixture(html`<ac-spinner-basic></ac-spinner-basic>`);
    expect(el.shadowRoot.querySelector('[part="root"]').getAttribute('role')).to.equal('status');
  });

  test('renders the default translated loading label', async () => {
    const el = await fixture(html`<ac-spinner-basic></ac-spinner-basic>`);
    expect(labelOf(el).textContent.trim()).to.equal('Cargando…');
  });

  test('translates a custom `a11y-label`', async () => {
    const el = await fixture(
      html`<ac-spinner-basic a11y-label="spinner-basic-saving"></ac-spinner-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(labelOf(el).textContent.trim()).to.equal('Saving changes…');
  });

  test('reflects `size` as an attribute', async () => {
    const el = await fixture(html`<ac-spinner-basic size="lg"></ac-spinner-basic>`);
    expect(el.getAttribute('size')).to.equal('lg');
  });
});
