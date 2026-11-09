import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing';
import '../index.js';

const OPTIONS = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'annual', label: 'Anual' },
  { value: 'lifetime', label: 'De por vida', disabled: true },
];

const selectOf = el => el.shadowRoot.querySelector('select');
const optionLabels = el =>
  [...selectOf(el).querySelectorAll('option')].map(option => option.textContent.trim());

const choose = (el, value) => {
  const select = selectOf(el);
  select.value = value;
  select.dispatchEvent(new Event('change'));
};

suite('ac-select-basic', () => {
  test('renders an internal <select>', async () => {
    const el = await fixture(html`<ac-select-basic></ac-select-basic>`);
    expect(selectOf(el)).to.exist;
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-select-basic></ac-select-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('applies the ambient class', async () => {
    const el = await fixture(html`<ac-select-basic ambient="secondary"></ac-select-basic>`);
    expect(
      el.shadowRoot.querySelector('.ac-select-basic').classList.contains('ac-select--secondary'),
    ).to.be.true;
  });

  test('renders one option per entry in `options`', async () => {
    const el = await fixture(html`<ac-select-basic .options=${OPTIONS}></ac-select-basic>`);
    expect(optionLabels(el)).to.deep.equal(['Mensual', 'Anual', 'De por vida']);
  });

  test('accepts `options` as a JSON attribute', async () => {
    const el = await fixture(
      html`<ac-select-basic options='[{"value":"a","label":"Uno"}]'></ac-select-basic>`,
    );
    expect(optionLabels(el)).to.deep.equal(['Uno']);
  });

  test('accepts plain strings in `options`', async () => {
    const el = await fixture(html`<ac-select-basic .options=${['Uno', 'Dos']}></ac-select-basic>`);
    expect(optionLabels(el)).to.deep.equal(['Uno', 'Dos']);
  });

  test('uses the string itself as the value of a plain-string option', async () => {
    const el = await fixture(html`<ac-select-basic .options=${['Uno', 'Dos']}></ac-select-basic>`);
    expect(selectOf(el).querySelectorAll('option')[1].value).to.equal('Dos');
  });

  test('disables an option flagged as disabled', async () => {
    const el = await fixture(html`<ac-select-basic .options=${OPTIONS}></ac-select-basic>`);
    expect(selectOf(el).querySelectorAll('option')[2].disabled).to.be.true;
  });

  test('reads <option> children through the slot', async () => {
    const el = await fixture(html`
      <ac-select-basic>
        <option value="pe">Perú</option>
        <option value="co">Colombia</option>
      </ac-select-basic>
    `);
    await aTimeout(0);
    await el.updateComplete;
    expect(optionLabels(el)).to.deep.equal(['Perú', 'Colombia']);
  });

  test('preselects the slotted option marked as selected', async () => {
    const el = await fixture(html`
      <ac-select-basic>
        <option value="pe">Perú</option>
        <option value="co" selected>Colombia</option>
      </ac-select-basic>
    `);
    await aTimeout(0);
    await el.updateComplete;
    expect(el.value).to.equal('co');
  });

  test('prefers `options` over slotted <option> children', async () => {
    const el = await fixture(html`
      <ac-select-basic .options=${['Propiedad']}>
        <option value="x">Slot</option>
      </ac-select-basic>
    `);
    await aTimeout(0);
    await el.updateComplete;
    expect(optionLabels(el)).to.deep.equal(['Propiedad']);
  });

  test('selects the option matching `value`', async () => {
    const el = await fixture(
      html`<ac-select-basic value="annual" .options=${OPTIONS}></ac-select-basic>`,
    );
    expect(selectOf(el).value).to.equal('annual');
  });

  test('keeps the select in sync when `value` changes programmatically', async () => {
    const el = await fixture(html`<ac-select-basic .options=${OPTIONS}></ac-select-basic>`);
    choose(el, 'monthly');
    el.value = 'annual';
    await el.updateComplete;
    expect(selectOf(el).value).to.equal('annual');
  });

  test('renders a placeholder option when `placeholder` is set', async () => {
    const el = await fixture(
      html`<ac-select-basic placeholder="Elige" .options=${OPTIONS}></ac-select-basic>`,
    );
    expect(optionLabels(el)[0]).to.equal('Elige');
  });

  test('selects the placeholder while there is no value', async () => {
    const el = await fixture(
      html`<ac-select-basic placeholder="Elige" .options=${OPTIONS}></ac-select-basic>`,
    );
    expect(selectOf(el).value).to.equal('');
  });

  test('translates the placeholder when it is a locale key', async () => {
    const el = await fixture(
      html`<ac-select-basic placeholder="select-basic-placeholder"></ac-select-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(optionLabels(el)[0]).to.equal('Choose an option');
  });

  test('translates option labels that are locale keys', async () => {
    const el = await fixture(
      html`<ac-select-basic
        .options=${[{ value: 'm', label: 'select-basic-option-monthly' }]}
      ></ac-select-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(optionLabels(el)).to.deep.equal(['Monthly']);
  });

  test('renders the label and associates it with the select', async () => {
    const el = await fixture(html`<ac-select-basic label="Plan"></ac-select-basic>`);
    expect(el.shadowRoot.querySelector('label').getAttribute('for')).to.equal(selectOf(el).id);
  });

  test('does not render a label without `label`', async () => {
    const el = await fixture(html`<ac-select-basic></ac-select-basic>`);
    expect(el.shadowRoot.querySelector('label')).to.not.exist;
  });

  test('uses a11y-label as aria-label when there is no visible label', async () => {
    const el = await fixture(html`<ac-select-basic a11y-label="Idioma"></ac-select-basic>`);
    expect(selectOf(el).getAttribute('aria-label')).to.equal('Idioma');
  });

  test('marks a required field visually without exposing the asterisk', async () => {
    const el = await fixture(html`<ac-select-basic label="Plan" required></ac-select-basic>`);
    expect(
      el.shadowRoot.querySelector('.ac-select-basic__required').getAttribute('aria-hidden'),
    ).to.equal('true');
  });

  test('disables the internal select when disabled', async () => {
    const el = await fixture(html`<ac-select-basic disabled></ac-select-basic>`);
    expect(selectOf(el).disabled).to.be.true;
  });

  test('renders the hint and describes the select by it', async () => {
    const el = await fixture(html`<ac-select-basic hint="Una ayuda"></ac-select-basic>`);
    expect(selectOf(el).getAttribute('aria-describedby')).to.equal('message');
  });

  test('marks the select invalid and announces the error', async () => {
    const el = await fixture(html`<ac-select-basic error="Falta"></ac-select-basic>`);
    expect([
      selectOf(el).getAttribute('aria-invalid'),
      el.shadowRoot.querySelector('#message').getAttribute('role'),
    ]).to.deep.equal(['true', 'alert']);
  });

  test('shows the error instead of the hint', async () => {
    const el = await fixture(html`<ac-select-basic hint="Ayuda" error="Falta"></ac-select-basic>`);
    expect(el.shadowRoot.querySelector('#message').textContent.trim()).to.equal('Falta');
  });

  test('updates `value` when the user chooses an option', async () => {
    const el = await fixture(html`<ac-select-basic .options=${OPTIONS}></ac-select-basic>`);
    choose(el, 'annual');
    expect(el.value).to.equal('annual');
  });

  test('dispatches ac-select-basic-change with value and label', async () => {
    const el = await fixture(html`<ac-select-basic .options=${OPTIONS}></ac-select-basic>`);
    setTimeout(() => choose(el, 'annual'));
    const event = await oneEvent(el, 'ac-select-basic-change');
    expect(event.detail).to.deep.equal({ value: 'annual', label: 'Anual' });
  });

  test('ac-select-basic-change bubbles and is composed', async () => {
    const el = await fixture(html`<ac-select-basic .options=${OPTIONS}></ac-select-basic>`);
    setTimeout(() => choose(el, 'annual'));
    const event = await oneEvent(el, 'ac-select-basic-change');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });

  test('focus() moves the focus to the internal select', async () => {
    const el = await fixture(html`<ac-select-basic></ac-select-basic>`);
    el.focus();
    expect(el.shadowRoot.activeElement).to.equal(selectOf(el));
  });
});
