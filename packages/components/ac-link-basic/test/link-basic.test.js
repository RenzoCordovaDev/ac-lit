import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

suite('ac-link-basic', () => {
  test('renders an internal <a> element', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs">Ver documentación</ac-link-basic>`);
    expect(el.shadowRoot.querySelector('a')).to.exist;
  });

  test('renders slotted content by default', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs">Ver documentación</ac-link-basic>`);
    expect(el.textContent.trim()).to.equal('Ver documentación');
  });

  test('defaults to variant="primary"', async () => {
    const el = await fixture(html`<ac-link-basic></ac-link-basic>`);
    expect(el.variant).to.equal('primary');
  });

  test('defaults to target="_self"', async () => {
    const el = await fixture(html`<ac-link-basic></ac-link-basic>`);
    expect(el.target).to.equal('_self');
  });

  test('defaults to disabled=false', async () => {
    const el = await fixture(html`<ac-link-basic></ac-link-basic>`);
    expect(el.disabled).to.be.false;
  });

  test('renders a translated label when `text` is a locale key', async () => {
    const el = await fixture(html`<ac-link-basic text="link-basic-learn-more"></ac-link-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('a').textContent.trim()).to.equal('Learn more');
  });

  test('reflects href onto the internal <a>', async () => {
    const el = await fixture(
      html`<ac-link-basic href="https://ac-lit.dev" target="_blank">Visitar</ac-link-basic>`,
    );
    expect(el.shadowRoot.querySelector('a').getAttribute('href')).to.equal('https://ac-lit.dev');
  });

  test('reflects target onto the internal <a>', async () => {
    const el = await fixture(
      html`<ac-link-basic href="https://ac-lit.dev" target="_blank">Visitar</ac-link-basic>`,
    );
    expect(el.shadowRoot.querySelector('a').getAttribute('target')).to.equal('_blank');
  });

  test('adds rel="noopener noreferrer" when target="_blank"', async () => {
    const el = await fixture(html`<ac-link-basic href="#" target="_blank"></ac-link-basic>`);
    expect(el.shadowRoot.querySelector('a').getAttribute('rel')).to.equal('noopener noreferrer');
  });

  test('does not add rel when target is not "_blank"', async () => {
    const el = await fixture(html`<ac-link-basic href="#"></ac-link-basic>`);
    expect(el.shadowRoot.querySelector('a').hasAttribute('rel')).to.be.false;
  });

  test('falls back to target="_self" for an unknown target value', async () => {
    const el = await fixture(html`<ac-link-basic href="#" target="_evil"></ac-link-basic>`);
    expect(el.shadowRoot.querySelector('a').getAttribute('target')).to.equal('_self');
  });

  test('removes href when disabled', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs" disabled>Ver</ac-link-basic>`);
    expect(el.shadowRoot.querySelector('a').hasAttribute('href')).to.be.false;
  });

  test('sets aria-disabled="true" when disabled', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs" disabled>Ver</ac-link-basic>`);
    expect(el.shadowRoot.querySelector('a').getAttribute('aria-disabled')).to.equal('true');
  });

  test('sets tabindex="-1" when disabled', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs" disabled>Ver</ac-link-basic>`);
    expect(el.shadowRoot.querySelector('a').getAttribute('tabindex')).to.equal('-1');
  });

  test('dispatches ac-link-basic-click on click', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs">Ver</ac-link-basic>`);
    const anchor = el.shadowRoot.querySelector('a');

    setTimeout(() => anchor.click());
    const event = await oneEvent(el, 'ac-link-basic-click');

    expect(event).to.exist;
  });

  test('ac-link-basic-click bubbles', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs">Ver</ac-link-basic>`);
    const anchor = el.shadowRoot.querySelector('a');

    setTimeout(() => anchor.click());
    const event = await oneEvent(el, 'ac-link-basic-click');

    expect(event.bubbles).to.be.true;
  });

  test('ac-link-basic-click is composed', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs">Ver</ac-link-basic>`);
    const anchor = el.shadowRoot.querySelector('a');

    setTimeout(() => anchor.click());
    const event = await oneEvent(el, 'ac-link-basic-click');

    expect(event.composed).to.be.true;
  });

  test('does not dispatch ac-link-basic-click when disabled', async () => {
    const el = await fixture(html`<ac-link-basic href="#docs" disabled>Ver</ac-link-basic>`);
    const anchor = el.shadowRoot.querySelector('a');

    let dispatched = false;
    el.addEventListener('ac-link-basic-click', () => (dispatched = true));
    anchor.click();

    expect(dispatched).to.be.false;
  });
});
