import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

describe('ac-badge-basic', () => {
  it('renders slotted content by default', async () => {
    const el = await fixture(html`<ac-badge-basic>Beta</ac-badge-basic>`);
    expect(el.shadowRoot.querySelector('span')).to.exist;
    expect(el.textContent.trim()).to.equal('Beta');
  });

  it('defaults to variant="neutral"', async () => {
    const el = await fixture(html`<ac-badge-basic></ac-badge-basic>`);
    expect(el.variant).to.equal('neutral');
  });

  it('reflects variant as an attribute', async () => {
    const el = await fixture(html`<ac-badge-basic variant="danger">Error</ac-badge-basic>`);
    expect(el.getAttribute('variant')).to.equal('danger');
    expect(el.shadowRoot.querySelector('span').classList.contains('ac-badge--danger')).to.be.true;
  });

  it('renders a translated label when `text` is a locale key', async () => {
    const el = await fixture(html`<ac-badge-basic text="badge-basic-new"></ac-badge-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('span').textContent.trim()).to.equal('New');
  });

  it('has no interactive affordance (no button/link role, no tabindex)', async () => {
    const el = await fixture(html`<ac-badge-basic>Nuevo</ac-badge-basic>`);
    const span = el.shadowRoot.querySelector('span');
    expect(span.hasAttribute('tabindex')).to.be.false;
    expect(span.getAttribute('role')).to.be.null;
  });
});
