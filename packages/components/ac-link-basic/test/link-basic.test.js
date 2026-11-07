import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

describe('ac-link-basic', () => {
  it('renders slotted content by default', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs">Ver documentación</ac-link-basic>`);
    expect(el.shadowRoot.querySelector('a')).to.exist;
    expect(el.textContent.trim()).to.equal('Ver documentación');
  });

  it('defaults to variant="primary", target="_self" and not disabled', async () => {
    const el = await fixture(html`<ac-link-basic></ac-link-basic>`);
    expect(el.variant).to.equal('primary');
    expect(el.target).to.equal('_self');
    expect(el.disabled).to.be.false;
  });

  it('renders a translated label when `text` is a locale key', async () => {
    const el = await fixture(html`<ac-link-basic text="link-basic-learn-more"></ac-link-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('a').textContent.trim()).to.equal('Learn more');
  });

  it('reflects href and target onto the internal <a>', async () => {
    const el = await fixture(
      html`<ac-link-basic href="https://ac-lit.dev" target="_blank">Visitar</ac-link-basic>`,
    );
    const anchor = el.shadowRoot.querySelector('a');
    expect(anchor.getAttribute('href')).to.equal('https://ac-lit.dev');
    expect(anchor.getAttribute('target')).to.equal('_blank');
  });

  it('adds rel="noopener noreferrer" only when target="_blank"', async () => {
    const blank = await fixture(html`<ac-link-basic href="#" target="_blank"></ac-link-basic>`);
    expect(blank.shadowRoot.querySelector('a').getAttribute('rel')).to.equal('noopener noreferrer');

    const self = await fixture(html`<ac-link-basic href="#"></ac-link-basic>`);
    expect(self.shadowRoot.querySelector('a').hasAttribute('rel')).to.be.false;
  });

  it('falls back to target="_self" for an unknown target value', async () => {
    const el = await fixture(html`<ac-link-basic href="#" target="_evil"></ac-link-basic>`);
    expect(el.shadowRoot.querySelector('a').getAttribute('target')).to.equal('_self');
  });

  it('removes href and sets aria-disabled/tabindex when disabled', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs" disabled>Ver</ac-link-basic>`);
    const anchor = el.shadowRoot.querySelector('a');
    expect(anchor.hasAttribute('href')).to.be.false;
    expect(anchor.getAttribute('aria-disabled')).to.equal('true');
    expect(anchor.getAttribute('tabindex')).to.equal('-1');
  });

  it('dispatches ac-link-basic-click on click', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs">Ver</ac-link-basic>`);
    const anchor = el.shadowRoot.querySelector('a');

    setTimeout(() => anchor.click());
    const event = await oneEvent(el, 'ac-link-basic-click');

    expect(event).to.exist;
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.true;
  });

  it('does not dispatch ac-link-basic-click when disabled', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs" disabled>Ver</ac-link-basic>`);
    const anchor = el.shadowRoot.querySelector('a');

    let dispatched = false;
    el.addEventListener('ac-link-basic-click', () => (dispatched = true));
    anchor.click();

    expect(dispatched).to.be.false;
  });
});
