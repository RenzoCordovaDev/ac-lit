import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import '../index.js';

const inputEvent = 'ac-search-input-basic-input';
const searchEvent = 'ac-search-input-basic-search';
const clearEvent = 'ac-search-input-basic-clear';

const inputOf = el => el.shadowRoot.querySelector('input');
const clearButtonOf = el => el.shadowRoot.querySelector('button');

function typeValue(el, value) {
  const input = inputOf(el);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
}

function pressEnter(el, isComposing = false) {
  inputOf(el).dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, isComposing }),
  );
}

function recordEvents(el, ...names) {
  const events = [];
  for (const name of names) {
    el.addEventListener(name, event => events.push(event));
  }
  return events;
}

suite('ac-search-input-basic', () => {
  for (const [property, value] of Object.entries({
    value: '',
    name: '',
    placeholder: '',
    label: '',
    a11yLabel: '',
    disabled: false,
    ambient: 'primary',
    debounce: 300,
  })) {
    test(`defaults \`${property}\` to ${JSON.stringify(value)}`, async () => {
      const el = await fixture(html`<ac-search-input-basic></ac-search-input-basic>`);
      expect(el[property]).to.equal(value);
    });
  }

  test('reflects ambient changes as an attribute', async () => {
    const el = await fixture(html`<ac-search-input-basic></ac-search-input-basic>`);
    el.ambient = 'secondary';
    await el.updateComplete;
    expect(el.getAttribute('ambient')).to.equal('secondary');
  });

  test('renders a native search input', async () => {
    const el = await fixture(html`<ac-search-input-basic></ac-search-input-basic>`);
    expect(inputOf(el).type).to.equal('search');
  });

  test('sets the initial value on the native input', async () => {
    const el = await fixture(html`<ac-search-input-basic value="hola"></ac-search-input-basic>`);
    expect(inputOf(el).value).to.equal('hola');
  });

  test('updates the native input when value changes programmatically', async () => {
    const el = await fixture(html`<ac-search-input-basic></ac-search-input-basic>`);
    el.value = 'hola';
    await el.updateComplete;
    expect(inputOf(el).value).to.equal('hola');
  });

  test('sets name on the native input', async () => {
    const el = await fixture(html`<ac-search-input-basic name="q"></ac-search-input-basic>`);
    expect(inputOf(el).name).to.equal('q');
  });

  test('disables the native input when disabled', async () => {
    const el = await fixture(html`<ac-search-input-basic disabled></ac-search-input-basic>`);
    expect(inputOf(el).disabled).to.be.true;
  });

  test('disables the clear button when disabled', async () => {
    const el = await fixture(
      html`<ac-search-input-basic value="hola" disabled></ac-search-input-basic>`,
    );
    expect(clearButtonOf(el).disabled).to.be.true;
  });

  test('translates the placeholder', async () => {
    const el = await fixture(
      html`<ac-search-input-basic
        placeholder="search-input-basic-placeholder"
        locale="en-EN"
      ></ac-search-input-basic>`,
    );
    expect(inputOf(el).placeholder).to.equal('Search…');
  });

  test('translates the visible label', async () => {
    const el = await fixture(
      html`<ac-search-input-basic
        label="search-input-basic-label"
        locale="en-EN"
      ></ac-search-input-basic>`,
    );
    expect(el.shadowRoot.querySelector('label').textContent.trim()).to.equal('Search');
  });

  test('associates the visible label with the native input', async () => {
    const el = await fixture(html`<ac-search-input-basic label="Buscar"></ac-search-input-basic>`);
    expect(inputOf(el).labels[0]).to.equal(el.shadowRoot.querySelector('label'));
  });

  test('uses the visible label as the accessible name when both labels are supplied', async () => {
    const el = await fixture(
      html`<ac-search-input-basic
        label="Buscar"
        a11y-label="Buscar productos"
      ></ac-search-input-basic>`,
    );
    expect(inputOf(el).hasAttribute('aria-label')).to.be.false;
  });

  test('provides a translated accessible name by default', async () => {
    const el = await fixture(html`<ac-search-input-basic locale="en-EN"></ac-search-input-basic>`);
    expect(inputOf(el).getAttribute('aria-label')).to.equal('Search');
  });

  test('accepts a custom accessible name from a11y-label', async () => {
    const el = await fixture(
      html`<ac-search-input-basic a11y-label="Buscar productos"></ac-search-input-basic>`,
    );
    expect(inputOf(el).getAttribute('aria-label')).to.equal('Buscar productos');
  });

  test('marks the magnifying glass as decorative', async () => {
    const el = await fixture(html`<ac-search-input-basic></ac-search-input-basic>`);
    expect(el.shadowRoot.querySelector('svg').getAttribute('aria-hidden')).to.equal('true');
  });

  test('omits the clear button for an empty value', async () => {
    const el = await fixture(html`<ac-search-input-basic></ac-search-input-basic>`);
    expect(clearButtonOf(el)).to.be.null;
  });

  test('renders a native clear button when typing a value', async () => {
    const el = await fixture(html`<ac-search-input-basic></ac-search-input-basic>`);
    typeValue(el, 'hola');
    await el.updateComplete;
    expect(clearButtonOf(el).type).to.equal('button');
  });

  test('translates the accessible name of the clear button', async () => {
    const el = await fixture(
      html`<ac-search-input-basic value="hola" locale="en-EN"></ac-search-input-basic>`,
    );
    expect(clearButtonOf(el).getAttribute('aria-label')).to.equal('Clear search');
  });

  test('delegates focus() to the native input', async () => {
    const el = await fixture(html`<ac-search-input-basic></ac-search-input-basic>`);
    el.focus();
    expect(el.shadowRoot.activeElement).to.equal(inputOf(el));
  });

  test('updates value on input', async () => {
    const el = await fixture(html`<ac-search-input-basic></ac-search-input-basic>`);
    typeValue(el, 'hola');
    expect(el.value).to.equal('hola');
  });

  test('emits the input event immediately for each edit', async () => {
    const el = await fixture(html`<ac-search-input-basic></ac-search-input-basic>`);
    const events = recordEvents(el, inputEvent);
    typeValue(el, 'h');
    typeValue(el, 'ho');
    expect(events.map(event => event.detail)).to.deep.equal([{ value: 'h' }, { value: 'ho' }]);
  });

  test('waits before emitting a search event on input', async () => {
    const el = await fixture(html`<ac-search-input-basic></ac-search-input-basic>`);
    const events = recordEvents(el, searchEvent);
    typeValue(el, 'hola');
    expect(events).to.be.empty;
  });

  test('debounces search and emits the latest value once', async () => {
    const el = await fixture(html`<ac-search-input-basic debounce="20"></ac-search-input-basic>`);
    const events = recordEvents(el, searchEvent);
    typeValue(el, 'h');
    typeValue(el, 'ho');
    await aTimeout(40);
    expect(events.map(event => event.detail)).to.deep.equal([{ value: 'ho' }]);
  });

  test('emits a search immediately on Enter', async () => {
    const el = await fixture(html`<ac-search-input-basic value="hola"></ac-search-input-basic>`);
    const events = recordEvents(el, searchEvent);
    pressEnter(el);
    expect(events.map(event => event.detail)).to.deep.equal([{ value: 'hola' }]);
  });

  test('cancels the pending debounced search on Enter', async () => {
    const el = await fixture(html`<ac-search-input-basic debounce="20"></ac-search-input-basic>`);
    const events = recordEvents(el, searchEvent);
    typeValue(el, 'hola');
    pressEnter(el);
    await aTimeout(40);
    expect(events).to.have.length(1);
  });

  test('does not search when Enter confirms text composition', async () => {
    const el = await fixture(html`<ac-search-input-basic value="検索"></ac-search-input-basic>`);
    const events = recordEvents(el, searchEvent);
    pressEnter(el, true);
    expect(events).to.be.empty;
  });

  test('clears the native value when the clear button is activated', async () => {
    const el = await fixture(html`<ac-search-input-basic value="hola"></ac-search-input-basic>`);
    clearButtonOf(el).click();
    await el.updateComplete;
    expect(inputOf(el).value).to.equal('');
  });

  test('removes the clear button after clearing', async () => {
    const el = await fixture(html`<ac-search-input-basic value="hola"></ac-search-input-basic>`);
    clearButtonOf(el).click();
    await el.updateComplete;
    expect(clearButtonOf(el)).to.be.null;
  });

  test('returns focus to the native input after clearing', async () => {
    const el = await fixture(html`<ac-search-input-basic value="hola"></ac-search-input-basic>`);
    clearButtonOf(el).focus();
    clearButtonOf(el).click();
    await el.updateComplete;
    expect(el.shadowRoot.activeElement).to.equal(inputOf(el));
  });

  test('clearing emits input, search and clear immediately and in order', async () => {
    const el = await fixture(html`<ac-search-input-basic value="hola"></ac-search-input-basic>`);
    const events = recordEvents(el, inputEvent, searchEvent, clearEvent);
    clearButtonOf(el).click();
    expect(events.map(event => [event.type, event.detail])).to.deep.equal([
      [inputEvent, { value: '' }],
      [searchEvent, { value: '' }],
      [clearEvent, {}],
    ]);
  });

  test('all three public events bubble and are composed', async () => {
    const el = await fixture(html`<ac-search-input-basic value="hola"></ac-search-input-basic>`);
    const events = recordEvents(el.parentElement, inputEvent, searchEvent, clearEvent);
    clearButtonOf(el).click();
    expect(events.map(event => [event.bubbles, event.composed])).to.deep.equal([
      [true, true],
      [true, true],
      [true, true],
    ]);
  });

  test('cancels the pending debounced search when clearing', async () => {
    const el = await fixture(html`<ac-search-input-basic debounce="20"></ac-search-input-basic>`);
    const events = recordEvents(el, searchEvent);
    typeValue(el, 'hola');
    await el.updateComplete;
    clearButtonOf(el).click();
    await aTimeout(40);
    expect(events.map(event => event.detail)).to.deep.equal([{ value: '' }]);
  });

  test('discards a pending search across disconnect and reconnect', async () => {
    const el = await fixture(html`<ac-search-input-basic debounce="20"></ac-search-input-basic>`);
    const container = el.parentElement;
    const events = recordEvents(el, searchEvent);
    typeValue(el, 'hola');
    el.remove();
    container.append(el);
    await aTimeout(40);
    expect(events).to.be.empty;
  });

  test('does not emit public events for an initial value', async () => {
    const events = [];
    const record = event => events.push(event.type);
    await fixture(
      html`<ac-search-input-basic
        value="hola"
        debounce="20"
        @ac-search-input-basic-input=${record}
        @ac-search-input-basic-search=${record}
        @ac-search-input-basic-clear=${record}
      ></ac-search-input-basic>`,
    );
    await aTimeout(40);
    expect(events).to.be.empty;
  });

  test('does not emit public events for a programmatic value change', async () => {
    const el = await fixture(html`<ac-search-input-basic debounce="20"></ac-search-input-basic>`);
    const events = recordEvents(el, inputEvent, searchEvent, clearEvent);
    el.value = 'hola';
    await el.updateComplete;
    await aTimeout(40);
    expect(events).to.be.empty;
  });
});
