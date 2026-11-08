import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

suite('ac-button-basic', () => {
  test('renders slotted content by default', async () => {
    const el = await fixture(html`<ac-button-basic>Click me</ac-button-basic>`);
    expect(el.textContent.trim()).to.equal('Click me');
  });

  test('renders an internal <button> element', async () => {
    const el = await fixture(html`<ac-button-basic>Click me</ac-button-basic>`);
    expect(el.shadowRoot.querySelector('button')).to.exist;
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-button-basic></ac-button-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('defaults to disabled=false', async () => {
    const el = await fixture(html`<ac-button-basic></ac-button-basic>`);
    expect(el.disabled).to.be.false;
  });

  test('defaults to loading=false', async () => {
    const el = await fixture(html`<ac-button-basic></ac-button-basic>`);
    expect(el.loading).to.be.false;
  });

  test('renders a translated label when `text` is a locale key', async () => {
    const el = await fixture(html`<ac-button-basic text="button-basic-submit"></ac-button-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('button').textContent.trim()).to.equal('Submit');
  });

  test('shows a skeleton while loading', async () => {
    const el = await fixture(html`<ac-button-basic loading>Click me</ac-button-basic>`);
    expect(el.shadowRoot.querySelector('.skeleton')).to.exist;
  });

  test('disables the internal button while loading', async () => {
    const el = await fixture(html`<ac-button-basic loading>Click me</ac-button-basic>`);
    const button = el.shadowRoot.querySelector('button');
    expect(button.disabled).to.be.true;
  });

  test('sets aria-busy="true" while loading', async () => {
    const el = await fixture(html`<ac-button-basic loading>Click me</ac-button-basic>`);
    const button = el.shadowRoot.querySelector('button');
    expect(button.getAttribute('aria-busy')).to.equal('true');
  });

  test('dispatches ac-button-basic-click on click', async () => {
    const el = await fixture(html`<ac-button-basic>Click me</ac-button-basic>`);
    const button = el.shadowRoot.querySelector('button');

    setTimeout(() => button.click());
    const event = await oneEvent(el, 'ac-button-basic-click');

    expect(event).to.exist;
  });

  test('ac-button-basic-click bubbles', async () => {
    const el = await fixture(html`<ac-button-basic>Click me</ac-button-basic>`);
    const button = el.shadowRoot.querySelector('button');

    setTimeout(() => button.click());
    const event = await oneEvent(el, 'ac-button-basic-click');

    expect(event.bubbles).to.be.true;
  });

  test('ac-button-basic-click is composed', async () => {
    const el = await fixture(html`<ac-button-basic>Click me</ac-button-basic>`);
    const button = el.shadowRoot.querySelector('button');

    setTimeout(() => button.click());
    const event = await oneEvent(el, 'ac-button-basic-click');

    expect(event.composed).to.be.true;
  });

  test('does not dispatch ac-button-basic-click when disabled', async () => {
    const el = await fixture(html`<ac-button-basic disabled>Click me</ac-button-basic>`);
    const button = el.shadowRoot.querySelector('button');

    let dispatched = false;
    el.addEventListener('ac-button-basic-click', () => (dispatched = true));
    button.click();

    expect(dispatched).to.be.false;
  });
});
