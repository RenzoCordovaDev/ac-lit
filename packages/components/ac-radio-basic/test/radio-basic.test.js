import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

suite('ac-radio-basic', () => {
  test('renders an internal <input type="radio">', async () => {
    const el = await fixture(html`<ac-radio-basic>Opción A</ac-radio-basic>`);
    expect(el.shadowRoot.querySelector('input[type="radio"]')).to.exist;
  });

  test('renders slotted content by default', async () => {
    const el = await fixture(html`<ac-radio-basic>Opción A</ac-radio-basic>`);
    expect(el.textContent.trim()).to.equal('Opción A');
  });

  test('defaults to checked=false', async () => {
    const el = await fixture(html`<ac-radio-basic></ac-radio-basic>`);
    expect(el.checked).to.be.false;
  });

  test('defaults to disabled=false', async () => {
    const el = await fixture(html`<ac-radio-basic></ac-radio-basic>`);
    expect(el.disabled).to.be.false;
  });

  test('renders a translated label when `text` is a locale key', async () => {
    const el = await fixture(html`<ac-radio-basic text="radio-basic-option"></ac-radio-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-radio-basic__label').textContent.trim()).to.equal(
      'Option',
    );
  });

  test('sets name on the internal input', async () => {
    const el = await fixture(html`<ac-radio-basic name="plan"></ac-radio-basic>`);
    expect(el.shadowRoot.querySelector('input').getAttribute('name')).to.equal('plan');
  });

  test('sets value on the internal input', async () => {
    const el = await fixture(html`<ac-radio-basic value="monthly"></ac-radio-basic>`);
    expect(el.shadowRoot.querySelector('input').getAttribute('value')).to.equal('monthly');
  });

  test('reflects checked onto the host attribute when checked', async () => {
    const el = await fixture(html`<ac-radio-basic checked></ac-radio-basic>`);
    expect(el.hasAttribute('checked')).to.be.true;
  });

  test('disables the internal input when disabled', async () => {
    const el = await fixture(html`<ac-radio-basic disabled></ac-radio-basic>`);
    expect(el.shadowRoot.querySelector('input').disabled).to.be.true;
  });

  test('dispatches ac-radio-basic-change when the user clicks it', async () => {
    const el = await fixture(html`<ac-radio-basic name="plan" value="monthly"></ac-radio-basic>`);
    const input = el.shadowRoot.querySelector('input');

    setTimeout(() => input.click());
    const event = await oneEvent(el, 'ac-radio-basic-change');

    expect(event).to.exist;
  });

  test('ac-radio-basic-change detail.checked is true after clicking', async () => {
    const el = await fixture(html`<ac-radio-basic name="plan" value="monthly"></ac-radio-basic>`);
    const input = el.shadowRoot.querySelector('input');

    setTimeout(() => input.click());
    const event = await oneEvent(el, 'ac-radio-basic-change');

    expect(event.detail.checked).to.be.true;
  });

  test('ac-radio-basic-change detail.value matches the value property', async () => {
    const el = await fixture(html`<ac-radio-basic name="plan" value="monthly"></ac-radio-basic>`);
    const input = el.shadowRoot.querySelector('input');

    setTimeout(() => input.click());
    const event = await oneEvent(el, 'ac-radio-basic-change');

    expect(event.detail.value).to.equal('monthly');
  });

  test('ac-radio-basic-change bubbles', async () => {
    const el = await fixture(html`<ac-radio-basic name="plan" value="monthly"></ac-radio-basic>`);
    const input = el.shadowRoot.querySelector('input');

    setTimeout(() => input.click());
    const event = await oneEvent(el, 'ac-radio-basic-change');

    expect(event.bubbles).to.be.true;
  });

  test('ac-radio-basic-change is composed', async () => {
    const el = await fixture(html`<ac-radio-basic name="plan" value="monthly"></ac-radio-basic>`);
    const input = el.shadowRoot.querySelector('input');

    setTimeout(() => input.click());
    const event = await oneEvent(el, 'ac-radio-basic-change');

    expect(event.composed).to.be.true;
  });

  test('does not dispatch ac-radio-basic-change when disabled', async () => {
    const el = await fixture(html`<ac-radio-basic name="plan" disabled></ac-radio-basic>`);
    const input = el.shadowRoot.querySelector('input');

    let dispatched = false;
    el.addEventListener('ac-radio-basic-change', () => (dispatched = true));
    input.click();

    expect(dispatched).to.be.false;
  });

  test('checking one radio unchecks another radio with the same name', async () => {
    const wrapper = await fixture(html`
      <div>
        <ac-radio-basic name="group-a" value="a" checked></ac-radio-basic>
        <ac-radio-basic name="group-a" value="b"></ac-radio-basic>
      </div>
    `);
    const [first, second] = wrapper.querySelectorAll('ac-radio-basic');

    second.shadowRoot.querySelector('input').click();

    expect(first.checked).to.be.false;
  });

  test('checking one radio does not affect a radio with a different name', async () => {
    const wrapper = await fixture(html`
      <div>
        <ac-radio-basic name="group-a" value="a" checked></ac-radio-basic>
        <ac-radio-basic name="group-b" value="b"></ac-radio-basic>
      </div>
    `);
    const [first, second] = wrapper.querySelectorAll('ac-radio-basic');

    second.shadowRoot.querySelector('input').click();

    expect(first.checked).to.be.true;
  });
});
