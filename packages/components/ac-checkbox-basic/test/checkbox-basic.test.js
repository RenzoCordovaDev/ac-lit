import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

suite('ac-checkbox-basic', () => {
  test('renders an internal <input type="checkbox">', async () => {
    const el = await fixture(html`<ac-checkbox-basic>Acepto</ac-checkbox-basic>`);
    expect(el.shadowRoot.querySelector('input[type="checkbox"]')).to.exist;
  });

  test('renders slotted content by default', async () => {
    const el = await fixture(html`<ac-checkbox-basic>Acepto</ac-checkbox-basic>`);
    expect(el.textContent.trim()).to.equal('Acepto');
  });

  test('defaults to checked=false', async () => {
    const el = await fixture(html`<ac-checkbox-basic></ac-checkbox-basic>`);
    expect(el.checked).to.be.false;
  });

  test('defaults to indeterminate=false', async () => {
    const el = await fixture(html`<ac-checkbox-basic></ac-checkbox-basic>`);
    expect(el.indeterminate).to.be.false;
  });

  test('defaults to disabled=false', async () => {
    const el = await fixture(html`<ac-checkbox-basic></ac-checkbox-basic>`);
    expect(el.disabled).to.be.false;
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-checkbox-basic></ac-checkbox-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('applies the ambient class', async () => {
    const el = await fixture(html`<ac-checkbox-basic ambient="secondary"></ac-checkbox-basic>`);
    expect(el.shadowRoot.querySelector('label').classList.contains('ac-checkbox--secondary')).to.be
      .true;
  });

  test('renders a translated label when `text` is a locale key', async () => {
    const el = await fixture(
      html`<ac-checkbox-basic text="checkbox-basic-accept-terms"></ac-checkbox-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-checkbox-basic__label').textContent.trim()).to.equal(
      'I accept the terms and conditions',
    );
  });

  test('sets name on the internal input', async () => {
    const el = await fixture(html`<ac-checkbox-basic name="terms"></ac-checkbox-basic>`);
    expect(el.shadowRoot.querySelector('input').getAttribute('name')).to.equal('terms');
  });

  test('sets value on the internal input', async () => {
    const el = await fixture(html`<ac-checkbox-basic value="accepted"></ac-checkbox-basic>`);
    expect(el.shadowRoot.querySelector('input').getAttribute('value')).to.equal('accepted');
  });

  test('checks the internal input when checked', async () => {
    const el = await fixture(html`<ac-checkbox-basic checked></ac-checkbox-basic>`);
    expect(el.shadowRoot.querySelector('input').checked).to.be.true;
  });

  test('reflects checked onto the host attribute', async () => {
    const el = await fixture(html`<ac-checkbox-basic checked></ac-checkbox-basic>`);
    expect(el.hasAttribute('checked')).to.be.true;
  });

  test('sets the indeterminate state on the internal input', async () => {
    const el = await fixture(html`<ac-checkbox-basic indeterminate></ac-checkbox-basic>`);
    expect(el.shadowRoot.querySelector('input').indeterminate).to.be.true;
  });

  test('disables the internal input when disabled', async () => {
    const el = await fixture(html`<ac-checkbox-basic disabled></ac-checkbox-basic>`);
    expect(el.shadowRoot.querySelector('input').disabled).to.be.true;
  });

  test('toggles checked when the user clicks it', async () => {
    const el = await fixture(html`<ac-checkbox-basic></ac-checkbox-basic>`);
    el.shadowRoot.querySelector('input').click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
  });

  test('unchecks when the user clicks a checked checkbox', async () => {
    const el = await fixture(html`<ac-checkbox-basic checked></ac-checkbox-basic>`);
    el.shadowRoot.querySelector('input').click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  test('clears indeterminate when the user clicks it', async () => {
    const el = await fixture(html`<ac-checkbox-basic indeterminate></ac-checkbox-basic>`);
    el.shadowRoot.querySelector('input').click();
    await el.updateComplete;
    expect(el.indeterminate).to.be.false;
  });

  test('dispatches ac-checkbox-basic-change with checked and value', async () => {
    const el = await fixture(html`<ac-checkbox-basic value="accepted"></ac-checkbox-basic>`);
    setTimeout(() => el.shadowRoot.querySelector('input').click());
    const event = await oneEvent(el, 'ac-checkbox-basic-change');
    expect(event.detail).to.deep.equal({ checked: true, value: 'accepted' });
  });

  test('ac-checkbox-basic-change bubbles and is composed', async () => {
    const el = await fixture(html`<ac-checkbox-basic></ac-checkbox-basic>`);
    setTimeout(() => el.shadowRoot.querySelector('input').click());
    const event = await oneEvent(el, 'ac-checkbox-basic-change');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });

  test('does not toggle when disabled', async () => {
    const el = await fixture(html`<ac-checkbox-basic disabled></ac-checkbox-basic>`);
    el.shadowRoot.querySelector('input').click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });
});
