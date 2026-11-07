import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

describe('ac-button-basic', () => {
  it('renders slotted content by default', async () => {
    const el = await fixture(html`<ac-button-basic>Click me</ac-button-basic>`);
    expect(el.shadowRoot.querySelector('button')).to.exist;
    expect(el.textContent.trim()).to.equal('Click me');
  });

  it('defaults to variant="primary" and not disabled/loading', async () => {
    const el = await fixture(html`<ac-button-basic></ac-button-basic>`);
    expect(el.variant).to.equal('primary');
    expect(el.disabled).to.be.false;
    expect(el.loading).to.be.false;
  });

  it('renders a translated label when `text` is a locale key', async () => {
    const el = await fixture(html`<ac-button-basic text="button-basic-submit"></ac-button-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('button').textContent.trim()).to.equal('Submit');
  });

  it('shows a skeleton and disables the button while loading', async () => {
    const el = await fixture(html`<ac-button-basic loading>Click me</ac-button-basic>`);
    const button = el.shadowRoot.querySelector('button');
    expect(el.shadowRoot.querySelector('.skeleton')).to.exist;
    expect(button.disabled).to.be.true;
    expect(button.getAttribute('aria-busy')).to.equal('true');
  });

  it('dispatches ac-button-basic-click on click', async () => {
    const el = await fixture(html`<ac-button-basic>Click me</ac-button-basic>`);
    const button = el.shadowRoot.querySelector('button');

    setTimeout(() => button.click());
    const event = await oneEvent(el, 'ac-button-basic-click');

    expect(event).to.exist;
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.true;
  });

  it('does not dispatch ac-button-basic-click when disabled', async () => {
    const el = await fixture(html`<ac-button-basic disabled>Click me</ac-button-basic>`);
    const button = el.shadowRoot.querySelector('button');

    let dispatched = false;
    el.addEventListener('ac-button-basic-click', () => (dispatched = true));
    button.click();

    expect(dispatched).to.be.false;
  });
});
