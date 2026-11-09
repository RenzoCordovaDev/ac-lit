import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

const inputOf = el => el.shadowRoot.querySelector('input');

const drag = (el, value) => {
  const input = inputOf(el);
  input.value = String(value);
  input.dispatchEvent(new Event('input'));
};

const commit = (el, value) => {
  const input = inputOf(el);
  input.value = String(value);
  input.dispatchEvent(new Event('change'));
};

suite('ac-slider-basic', () => {
  test('renders an internal <input type="range">', async () => {
    const el = await fixture(html`<ac-slider-basic></ac-slider-basic>`);
    expect(inputOf(el).type).to.equal('range');
  });

  test('defaults to min=0, max=100, step=1 and value=0', async () => {
    const el = await fixture(html`<ac-slider-basic></ac-slider-basic>`);
    expect([el.min, el.max, el.step, el.value]).to.deep.equal([0, 100, 1, 0]);
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-slider-basic></ac-slider-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('applies the ambient class', async () => {
    const el = await fixture(html`<ac-slider-basic ambient="secondary"></ac-slider-basic>`);
    expect(
      el.shadowRoot.querySelector('.ac-slider-basic').classList.contains('ac-slider--secondary'),
    ).to.be.true;
  });

  test('passes min, max and step to the internal input', async () => {
    const el = await fixture(html`<ac-slider-basic min="10" max="50" step="5"></ac-slider-basic>`);
    expect([inputOf(el).min, inputOf(el).max, inputOf(el).step]).to.deep.equal(['10', '50', '5']);
  });

  test('sets the value on the internal input', async () => {
    const el = await fixture(html`<ac-slider-basic value="30"></ac-slider-basic>`);
    expect(inputOf(el).value).to.equal('30');
  });

  test('honours a custom min/max range when setting the value', async () => {
    const el = await fixture(
      html`<ac-slider-basic min="16" max="30" value="22"></ac-slider-basic>`,
    );
    expect(inputOf(el).value).to.equal('22');
  });

  test('clamps a value above max', async () => {
    const el = await fixture(html`<ac-slider-basic value="500"></ac-slider-basic>`);
    expect(inputOf(el).value).to.equal('100');
  });

  test('clamps a value below min', async () => {
    const el = await fixture(html`<ac-slider-basic min="10" value="2"></ac-slider-basic>`);
    expect(inputOf(el).value).to.equal('10');
  });

  test('falls back to min for a non-numeric value', async () => {
    const el = await fixture(html`<ac-slider-basic value="abc"></ac-slider-basic>`);
    expect(inputOf(el).value).to.equal('0');
  });

  test('fills the track up to the current percentage', async () => {
    const el = await fixture(html`<ac-slider-basic value="25"></ac-slider-basic>`);
    expect(inputOf(el).style.getPropertyValue('--ac-slider-percent')).to.equal('25%');
  });

  test('computes the percentage relative to min and max', async () => {
    const el = await fixture(
      html`<ac-slider-basic min="0" max="200" value="50"></ac-slider-basic>`,
    );
    expect(inputOf(el).style.getPropertyValue('--ac-slider-percent')).to.equal('25%');
  });

  test('does not render a header without label or show-value', async () => {
    const el = await fixture(html`<ac-slider-basic></ac-slider-basic>`);
    expect(el.shadowRoot.querySelector('.ac-slider-basic__header')).to.not.exist;
  });

  test('renders the label associated with the input', async () => {
    const el = await fixture(html`<ac-slider-basic label="Volumen"></ac-slider-basic>`);
    expect(el.shadowRoot.querySelector('label').getAttribute('for')).to.equal(inputOf(el).id);
  });

  test('translates the label when it is a locale key', async () => {
    const el = await fixture(html`<ac-slider-basic label="slider-basic-volume"></ac-slider-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('label').textContent.trim()).to.equal('Volume');
  });

  test('uses a11y-label as aria-label when there is no visible label', async () => {
    const el = await fixture(html`<ac-slider-basic a11y-label="Zoom"></ac-slider-basic>`);
    expect(inputOf(el).getAttribute('aria-label')).to.equal('Zoom');
  });

  test('shows the current value with show-value', async () => {
    const el = await fixture(html`<ac-slider-basic value="40" show-value></ac-slider-basic>`);
    expect(el.shadowRoot.querySelector('output').textContent.trim()).to.equal('40');
  });

  test('appends the suffix to the shown value', async () => {
    const el = await fixture(
      html`<ac-slider-basic value="40" show-value suffix="%"></ac-slider-basic>`,
    );
    expect(el.shadowRoot.querySelector('output').textContent.trim()).to.equal('40%');
  });

  test('hides the visual value from assistive technology', async () => {
    const el = await fixture(html`<ac-slider-basic show-value></ac-slider-basic>`);
    expect(el.shadowRoot.querySelector('output').getAttribute('aria-hidden')).to.equal('true');
  });

  test('exposes the suffix in aria-valuetext', async () => {
    const el = await fixture(html`<ac-slider-basic value="40" suffix="%"></ac-slider-basic>`);
    expect(inputOf(el).getAttribute('aria-valuetext')).to.equal('40%');
  });

  test('renders the hint and describes the input by it', async () => {
    const el = await fixture(html`<ac-slider-basic hint="Una ayuda"></ac-slider-basic>`);
    expect(inputOf(el).getAttribute('aria-describedby')).to.equal('hint');
  });

  test('disables the internal input when disabled', async () => {
    const el = await fixture(html`<ac-slider-basic disabled></ac-slider-basic>`);
    expect(inputOf(el).disabled).to.be.true;
  });

  test('updates `value` while dragging', async () => {
    const el = await fixture(html`<ac-slider-basic></ac-slider-basic>`);
    drag(el, 70);
    expect(el.value).to.equal(70);
  });

  test('updates the shown value while dragging', async () => {
    const el = await fixture(html`<ac-slider-basic show-value></ac-slider-basic>`);
    drag(el, 70);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('output').textContent.trim()).to.equal('70');
  });

  test('dispatches ac-slider-basic-input with a numeric value', async () => {
    const el = await fixture(html`<ac-slider-basic></ac-slider-basic>`);
    setTimeout(() => drag(el, 70));
    const event = await oneEvent(el, 'ac-slider-basic-input');
    expect(event.detail).to.deep.equal({ value: 70 });
  });

  test('dispatches ac-slider-basic-change with a numeric value', async () => {
    const el = await fixture(html`<ac-slider-basic></ac-slider-basic>`);
    setTimeout(() => commit(el, 30));
    const event = await oneEvent(el, 'ac-slider-basic-change');
    expect(event.detail).to.deep.equal({ value: 30 });
  });

  test('ac-slider-basic-change bubbles and is composed', async () => {
    const el = await fixture(html`<ac-slider-basic></ac-slider-basic>`);
    setTimeout(() => commit(el, 30));
    const event = await oneEvent(el, 'ac-slider-basic-change');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });

  test('focus() moves the focus to the internal input', async () => {
    const el = await fixture(html`<ac-slider-basic></ac-slider-basic>`);
    el.focus();
    expect(el.shadowRoot.activeElement).to.equal(inputOf(el));
  });
});
