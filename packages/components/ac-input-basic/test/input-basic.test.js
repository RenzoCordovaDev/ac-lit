import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

const inputOf = el => el.shadowRoot.querySelector('input');
const iconOf = el => el.shadowRoot.querySelector('ac-icon-basic');

suite('ac-input-basic', () => {
  test('renders an internal <input>', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    expect(inputOf(el)).to.exist;
  });

  test('defaults to type="text"', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    expect(inputOf(el).type).to.equal('text');
  });

  test('applies an allowed type', async () => {
    const el = await fixture(html`<ac-input-basic type="email"></ac-input-basic>`);
    expect(inputOf(el).type).to.equal('email');
  });

  test('falls back to text for a type outside the allow-list', async () => {
    const el = await fixture(html`<ac-input-basic type="file"></ac-input-basic>`);
    expect(inputOf(el).type).to.equal('text');
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('applies the ambient class', async () => {
    const el = await fixture(html`<ac-input-basic ambient="secondary"></ac-input-basic>`);
    expect(el.shadowRoot.querySelector('.ac-input-basic').classList.contains('ac-input--secondary'))
      .to.be.true;
  });

  test('does not render a label without `label`', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    expect(el.shadowRoot.querySelector('label')).to.not.exist;
  });

  test('renders the label text', async () => {
    const el = await fixture(html`<ac-input-basic label="Nombre"></ac-input-basic>`);
    expect(el.shadowRoot.querySelector('label').textContent.trim()).to.equal('Nombre');
  });

  test('associates the label with the input', async () => {
    const el = await fixture(html`<ac-input-basic label="Nombre"></ac-input-basic>`);
    expect(el.shadowRoot.querySelector('label').getAttribute('for')).to.equal(inputOf(el).id);
  });

  test('translates the label when it is a locale key', async () => {
    const el = await fixture(
      html`<ac-input-basic label="input-basic-email-label"></ac-input-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('label').textContent.trim()).to.equal('Email');
  });

  test('translates the placeholder when it is a locale key', async () => {
    const el = await fixture(
      html`<ac-input-basic placeholder="input-basic-email-placeholder"></ac-input-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(inputOf(el).placeholder).to.equal('name@company.com');
  });

  test('marks a required field visually without exposing the asterisk', async () => {
    const el = await fixture(html`<ac-input-basic label="Nombre" required></ac-input-basic>`);
    expect(
      el.shadowRoot.querySelector('.ac-input-basic__required').getAttribute('aria-hidden'),
    ).to.equal('true');
  });

  test('sets required on the internal input', async () => {
    const el = await fixture(html`<ac-input-basic required></ac-input-basic>`);
    expect(inputOf(el).required).to.be.true;
  });

  test('uses a11y-label as aria-label when there is no visible label', async () => {
    const el = await fixture(html`<ac-input-basic a11y-label="Buscar"></ac-input-basic>`);
    expect(inputOf(el).getAttribute('aria-label')).to.equal('Buscar');
  });

  test('does not set aria-label when a visible label exists', async () => {
    const el = await fixture(
      html`<ac-input-basic label="Nombre" a11y-label="Buscar"></ac-input-basic>`,
    );
    expect(inputOf(el).hasAttribute('aria-label')).to.be.false;
  });

  test('sets the value on the internal input', async () => {
    const el = await fixture(html`<ac-input-basic value="Ana"></ac-input-basic>`);
    expect(inputOf(el).value).to.equal('Ana');
  });

  test('sets name on the internal input', async () => {
    const el = await fixture(html`<ac-input-basic name="email"></ac-input-basic>`);
    expect(inputOf(el).getAttribute('name')).to.equal('email');
  });

  test('disables the internal input when disabled', async () => {
    const el = await fixture(html`<ac-input-basic disabled></ac-input-basic>`);
    expect(inputOf(el).disabled).to.be.true;
  });

  test('sets readonly on the internal input', async () => {
    const el = await fixture(html`<ac-input-basic readonly></ac-input-basic>`);
    expect(inputOf(el).readOnly).to.be.true;
  });

  test('renders the hint', async () => {
    const el = await fixture(html`<ac-input-basic hint="Una ayuda"></ac-input-basic>`);
    expect(el.shadowRoot.querySelector('#message').textContent.trim()).to.equal('Una ayuda');
  });

  test('describes the input by the hint', async () => {
    const el = await fixture(html`<ac-input-basic hint="Una ayuda"></ac-input-basic>`);
    expect(inputOf(el).getAttribute('aria-describedby')).to.equal('message');
  });

  test('does not describe the input without hint or error', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    expect(inputOf(el).hasAttribute('aria-describedby')).to.be.false;
  });

  test('is not invalid by default', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    expect(inputOf(el).getAttribute('aria-invalid')).to.equal('false');
  });

  test('marks the input invalid when there is an error', async () => {
    const el = await fixture(html`<ac-input-basic error="Falta"></ac-input-basic>`);
    expect(inputOf(el).getAttribute('aria-invalid')).to.equal('true');
  });

  test('announces the error with role="alert"', async () => {
    const el = await fixture(html`<ac-input-basic error="Falta"></ac-input-basic>`);
    expect(el.shadowRoot.querySelector('#message').getAttribute('role')).to.equal('alert');
  });

  test('shows the error instead of the hint', async () => {
    const el = await fixture(html`<ac-input-basic hint="Ayuda" error="Falta"></ac-input-basic>`);
    expect(el.shadowRoot.querySelector('#message').textContent.trim()).to.equal('Falta');
  });

  test('translates the error when it is a locale key', async () => {
    const el = await fixture(
      html`<ac-input-basic error="input-basic-email-error"></ac-input-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('#message').textContent.trim()).to.equal(
      'Enter a valid email.',
    );
  });

  test('updates `value` as the user types', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    inputOf(el).value = 'hola';
    inputOf(el).dispatchEvent(new Event('input'));
    expect(el.value).to.equal('hola');
  });

  test('dispatches ac-input-basic-input with the value', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    setTimeout(() => {
      inputOf(el).value = 'hola';
      inputOf(el).dispatchEvent(new Event('input'));
    });
    const event = await oneEvent(el, 'ac-input-basic-input');
    expect(event.detail).to.deep.equal({ value: 'hola' });
  });

  test('dispatches ac-input-basic-change with the value', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    setTimeout(() => {
      inputOf(el).value = 'hola';
      inputOf(el).dispatchEvent(new Event('change'));
    });
    const event = await oneEvent(el, 'ac-input-basic-change');
    expect(event.detail).to.deep.equal({ value: 'hola' });
  });

  test('ac-input-basic-input bubbles and is composed', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    setTimeout(() => inputOf(el).dispatchEvent(new Event('input')));
    const event = await oneEvent(el, 'ac-input-basic-input');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });

  test('focus() moves the focus to the internal input', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    el.focus();
    expect(el.shadowRoot.activeElement).to.equal(inputOf(el));
  });

  test('does not render an icon with the default type="text"', async () => {
    const el = await fixture(html`<ac-input-basic></ac-input-basic>`);
    expect(iconOf(el)).to.not.exist;
  });

  test('does not render an icon for type="password"', async () => {
    const el = await fixture(html`<ac-input-basic type="password"></ac-input-basic>`);
    expect(iconOf(el)).to.not.exist;
  });

  test('does not render an icon for type="search"', async () => {
    const el = await fixture(html`<ac-input-basic type="search"></ac-input-basic>`);
    expect(iconOf(el)).to.not.exist;
  });

  test('does not render an icon for type="tel"', async () => {
    const el = await fixture(html`<ac-input-basic type="tel"></ac-input-basic>`);
    expect(iconOf(el)).to.not.exist;
  });

  test('does not render an icon for type="url"', async () => {
    const el = await fixture(html`<ac-input-basic type="url"></ac-input-basic>`);
    expect(iconOf(el)).to.not.exist;
  });

  test('type="password" keeps the native input type unchanged', async () => {
    const el = await fixture(html`<ac-input-basic type="password"></ac-input-basic>`);
    expect(inputOf(el).type).to.equal('password');
  });

  test('type="search" keeps the native input type unchanged', async () => {
    const el = await fixture(html`<ac-input-basic type="search"></ac-input-basic>`);
    expect(inputOf(el).type).to.equal('search');
  });

  test('type="tel" keeps the native input type unchanged', async () => {
    const el = await fixture(html`<ac-input-basic type="tel"></ac-input-basic>`);
    expect(inputOf(el).type).to.equal('tel');
  });

  test('type="url" keeps the native input type unchanged', async () => {
    const el = await fixture(html`<ac-input-basic type="url"></ac-input-basic>`);
    expect(inputOf(el).type).to.equal('url');
  });

  test('renders the "currency" icon for type="amount"', async () => {
    const el = await fixture(html`<ac-input-basic type="amount"></ac-input-basic>`);
    expect(iconOf(el).getAttribute('name')).to.equal('currency');
  });

  test('type="amount" falls back to text on the native input (not a valid native type)', async () => {
    const el = await fixture(html`<ac-input-basic type="amount"></ac-input-basic>`);
    expect(inputOf(el).type).to.equal('text');
  });

  test('renders the "calendar" icon for type="date"', async () => {
    const el = await fixture(html`<ac-input-basic type="date"></ac-input-basic>`);
    expect(iconOf(el).getAttribute('name')).to.equal('calendar');
  });

  test('type="date" falls back to text on the native input (not a valid native type)', async () => {
    const el = await fixture(html`<ac-input-basic type="date"></ac-input-basic>`);
    expect(inputOf(el).type).to.equal('text');
  });

  test('renders the "hash" icon for type="number"', async () => {
    const el = await fixture(html`<ac-input-basic type="number"></ac-input-basic>`);
    expect(iconOf(el).getAttribute('name')).to.equal('hash');
  });

  test('type="number" keeps the native input type unchanged', async () => {
    const el = await fixture(html`<ac-input-basic type="number"></ac-input-basic>`);
    expect(inputOf(el).type).to.equal('number');
  });

  test('renders the "email" icon for type="email"', async () => {
    const el = await fixture(html`<ac-input-basic type="email"></ac-input-basic>`);
    expect(iconOf(el).getAttribute('name')).to.equal('email');
  });

  test('uses the suggested placeholder for type="amount" when none is set', async () => {
    const el = await fixture(html`<ac-input-basic type="amount"></ac-input-basic>`);
    expect(inputOf(el).placeholder).to.equal('0.00');
  });

  test('uses the suggested placeholder for type="date" when none is set', async () => {
    const el = await fixture(html`<ac-input-basic type="date"></ac-input-basic>`);
    expect(inputOf(el).placeholder).to.equal('DD/MM/AAAA');
  });

  test("the consumer's own placeholder always wins over the suggested one", async () => {
    const el = await fixture(
      html`<ac-input-basic type="amount" placeholder="Ej. 150.50"></ac-input-basic>`,
    );
    expect(inputOf(el).placeholder).to.equal('Ej. 150.50');
  });

  test('type="password" has no suggested placeholder', async () => {
    const el = await fixture(html`<ac-input-basic type="password"></ac-input-basic>`);
    expect(inputOf(el).placeholder).to.equal('');
  });
});
