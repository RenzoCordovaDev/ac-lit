import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

suite('ac-badge-basic', () => {
  test('renders an internal <span> element', async () => {
    const el = await fixture(html`<ac-badge-basic>Beta</ac-badge-basic>`);
    expect(el.shadowRoot.querySelector('span')).to.exist;
  });

  test('renders slotted content by default', async () => {
    const el = await fixture(html`<ac-badge-basic>Beta</ac-badge-basic>`);
    expect(el.textContent.trim()).to.equal('Beta');
  });

  test('defaults to variant="neutral"', async () => {
    const el = await fixture(html`<ac-badge-basic></ac-badge-basic>`);
    expect(el.variant).to.equal('neutral');
  });

  test('reflects variant as an attribute', async () => {
    const el = await fixture(html`<ac-badge-basic variant="danger">Error</ac-badge-basic>`);
    expect(el.getAttribute('variant')).to.equal('danger');
  });

  test('applies the variant class to the internal span', async () => {
    const el = await fixture(html`<ac-badge-basic variant="danger">Error</ac-badge-basic>`);
    const span = el.shadowRoot.querySelector('span');
    expect(span.classList.contains('ac-badge--danger')).to.be.true;
  });

  test('renders a translated label when `text` is a locale key', async () => {
    const el = await fixture(html`<ac-badge-basic text="badge-basic-new"></ac-badge-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('span').textContent.trim()).to.equal('New');
  });

  test('is not focusable (no tabindex)', async () => {
    const el = await fixture(html`<ac-badge-basic>Nuevo</ac-badge-basic>`);
    const span = el.shadowRoot.querySelector('span');
    expect(span.hasAttribute('tabindex')).to.be.false;
  });

  test('has no interactive role', async () => {
    const el = await fixture(html`<ac-badge-basic>Nuevo</ac-badge-basic>`);
    const span = el.shadowRoot.querySelector('span');
    expect(span.getAttribute('role')).to.be.null;
  });
});
