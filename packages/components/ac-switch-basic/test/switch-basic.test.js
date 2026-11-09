import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

suite('ac-switch-basic', () => {
  test('renders an internal checkbox input', async () => {
    const el = await fixture(html`<ac-switch-basic>Wi-Fi</ac-switch-basic>`);
    expect(el.shadowRoot.querySelector('input[type="checkbox"]')).to.exist;
  });

  test('exposes the switch role on the internal input', async () => {
    const el = await fixture(html`<ac-switch-basic>Wi-Fi</ac-switch-basic>`);
    expect(el.shadowRoot.querySelector('input').getAttribute('role')).to.equal('switch');
  });

  test('renders slotted content by default', async () => {
    const el = await fixture(html`<ac-switch-basic>Wi-Fi</ac-switch-basic>`);
    expect(el.textContent.trim()).to.equal('Wi-Fi');
  });

  test('defaults to checked=false', async () => {
    const el = await fixture(html`<ac-switch-basic></ac-switch-basic>`);
    expect(el.checked).to.be.false;
  });

  test('defaults to disabled=false', async () => {
    const el = await fixture(html`<ac-switch-basic></ac-switch-basic>`);
    expect(el.disabled).to.be.false;
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-switch-basic></ac-switch-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('applies the ambient class', async () => {
    const el = await fixture(html`<ac-switch-basic ambient="secondary"></ac-switch-basic>`);
    expect(el.shadowRoot.querySelector('label').classList.contains('ac-switch--secondary')).to.be
      .true;
  });

  test('renders a translated label when `text` is a locale key', async () => {
    const el = await fixture(
      html`<ac-switch-basic text="switch-basic-notifications"></ac-switch-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-switch-basic__label').textContent.trim()).to.equal(
      'Receive notifications',
    );
  });

  test('sets name on the internal input', async () => {
    const el = await fixture(html`<ac-switch-basic name="wifi"></ac-switch-basic>`);
    expect(el.shadowRoot.querySelector('input').getAttribute('name')).to.equal('wifi');
  });

  test('checks the internal input when checked', async () => {
    const el = await fixture(html`<ac-switch-basic checked></ac-switch-basic>`);
    expect(el.shadowRoot.querySelector('input').checked).to.be.true;
  });

  test('reflects checked onto the host attribute', async () => {
    const el = await fixture(html`<ac-switch-basic checked></ac-switch-basic>`);
    expect(el.hasAttribute('checked')).to.be.true;
  });

  test('disables the internal input when disabled', async () => {
    const el = await fixture(html`<ac-switch-basic disabled></ac-switch-basic>`);
    expect(el.shadowRoot.querySelector('input').disabled).to.be.true;
  });

  test('turns on when the user clicks it', async () => {
    const el = await fixture(html`<ac-switch-basic></ac-switch-basic>`);
    el.shadowRoot.querySelector('input').click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
  });

  test('turns off when the user clicks it while on', async () => {
    const el = await fixture(html`<ac-switch-basic checked></ac-switch-basic>`);
    el.shadowRoot.querySelector('input').click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  test('dispatches ac-switch-basic-change with checked and value', async () => {
    const el = await fixture(html`<ac-switch-basic value="on"></ac-switch-basic>`);
    setTimeout(() => el.shadowRoot.querySelector('input').click());
    const event = await oneEvent(el, 'ac-switch-basic-change');
    expect(event.detail).to.deep.equal({ checked: true, value: 'on' });
  });

  test('ac-switch-basic-change bubbles and is composed', async () => {
    const el = await fixture(html`<ac-switch-basic></ac-switch-basic>`);
    setTimeout(() => el.shadowRoot.querySelector('input').click());
    const event = await oneEvent(el, 'ac-switch-basic-change');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });

  test('does not toggle when disabled', async () => {
    const el = await fixture(html`<ac-switch-basic disabled></ac-switch-basic>`);
    el.shadowRoot.querySelector('input').click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });
});
