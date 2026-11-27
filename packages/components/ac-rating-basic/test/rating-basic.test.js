import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

const CHANGE_EVENT = 'ac-rating-basic-change';
const groupOf = el => el.shadowRoot.querySelector('[role="radiogroup"]');
const radiosOf = el => [...el.shadowRoot.querySelectorAll('[role="radio"]')];
const checkedOf = el => el.shadowRoot.querySelectorAll('[role="radio"][aria-checked="true"]');
const filledCount = el => el.shadowRoot.querySelectorAll('.ac-rating-basic__star--filled').length;

function press(button, key) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  button.dispatchEvent(event);
  return event;
}

function trackChanges(el) {
  const events = [];
  el.addEventListener(CHANGE_EVENT, event => events.push(event));
  return events;
}

suite('ac-rating-basic', () => {
  const defaults = { value: 0, max: 5, readonly: false, name: '', ambient: 'primary' };

  for (const [property, value] of Object.entries(defaults)) {
    test(`defaults ${property} to ${JSON.stringify(value)}`, async () => {
      const el = await fixture(html`<ac-rating-basic></ac-rating-basic>`);
      expect(el[property]).to.equal(value);
    });
  }

  const reflected = [
    { property: 'value', value: 3, attribute: '3' },
    { property: 'max', value: 7, attribute: '7' },
    { property: 'readonly', value: true, attribute: '' },
    { property: 'ambient', value: 'secondary', attribute: 'secondary' },
  ];

  for (const { property, value, attribute } of reflected) {
    test(`reflects ${property} when set as a property`, async () => {
      const el = await fixture(html`<ac-rating-basic></ac-rating-basic>`);
      el[property] = value;
      await el.updateComplete;
      expect(el.getAttribute(property)).to.equal(attribute);
    });
  }

  test('exposes the field name from the name attribute', async () => {
    const el = await fixture(html`<ac-rating-basic name="product-rating"></ac-rating-basic>`);
    expect(el.name).to.equal('product-rating');
  });

  test('renders max native radio buttons inside a radiogroup', async () => {
    const el = await fixture(html`<ac-rating-basic max="4"></ac-rating-basic>`);
    const buttons = groupOf(el).querySelectorAll('button[type="button"][role="radio"]');
    expect(buttons.length).to.equal(4);
  });

  test('marks only the radio matching value as checked', async () => {
    const el = await fixture(html`<ac-rating-basic value="3"></ac-rating-basic>`);
    expect([...checkedOf(el)]).to.deep.equal([radiosOf(el)[2]]);
  });

  test('fills the stars up to the current value', async () => {
    const el = await fixture(html`<ac-rating-basic value="3"></ac-rating-basic>`);
    expect(filledCount(el)).to.equal(3);
  });

  test('has no checked radio at zero', async () => {
    const el = await fixture(html`<ac-rating-basic></ac-rating-basic>`);
    expect(checkedOf(el).length).to.equal(0);
  });

  test('makes only the first radio tabbable at zero', async () => {
    const el = await fixture(html`<ac-rating-basic></ac-rating-basic>`);
    expect(radiosOf(el).map(button => button.tabIndex)).to.deep.equal([0, -1, -1, -1, -1]);
  });

  test('makes only the selected radio tabbable when value is positive', async () => {
    const el = await fixture(html`<ac-rating-basic value="3"></ac-rating-basic>`);
    expect(radiosOf(el).map(button => button.tabIndex)).to.deep.equal([-1, -1, 0, -1, -1]);
  });

  test('truncates a fractional value to whole stars', async () => {
    const el = await fixture(html`<ac-rating-basic value="2.9"></ac-rating-basic>`);
    expect(el.value).to.equal(2);
  });

  test('clamps a negative value to zero', async () => {
    const el = await fixture(html`<ac-rating-basic value="-2"></ac-rating-basic>`);
    expect(el.value).to.equal(0);
  });

  test('clamps the current value when max decreases', async () => {
    const el = await fixture(html`<ac-rating-basic value="5"></ac-rating-basic>`);
    el.max = 3;
    await el.updateComplete;
    expect(el.value).to.equal(3);
  });

  test('defaults an invalid max to five stars', async () => {
    const el = await fixture(html`<ac-rating-basic max="invalid"></ac-rating-basic>`);
    expect(el.max).to.equal(5);
  });

  test('keeps at least one star for a non-positive max', async () => {
    const el = await fixture(html`<ac-rating-basic max="0"></ac-rating-basic>`);
    expect(el.max).to.equal(1);
  });
});

suite('ac-rating-basic: interaction', () => {
  test('sets value to the clicked star', async () => {
    const el = await fixture(html`<ac-rating-basic></ac-rating-basic>`);
    radiosOf(el)[3].click();
    await el.updateComplete;
    expect(el.value).to.equal(4);
  });

  test('dispatches a change with the clicked rating', async () => {
    const el = await fixture(html`<ac-rating-basic></ac-rating-basic>`);
    const events = trackChanges(el);
    radiosOf(el)[3].click();
    await el.updateComplete;
    expect(events.map(event => event.detail)).to.deep.equal([{ value: 4 }]);
  });

  for (const flag of ['bubbles', 'composed']) {
    test(`sets ${flag} on the change event`, async () => {
      const el = await fixture(html`<ac-rating-basic></ac-rating-basic>`);
      const events = trackChanges(el);
      radiosOf(el)[0].click();
      await el.updateComplete;
      expect(events[0][flag]).to.be.true;
    });
  }

  test('does not dispatch an event on first render with an initial value', async () => {
    const events = [];
    const el = await fixture(html`
      <ac-rating-basic
        value="3"
        @ac-rating-basic-change=${event => events.push(event)}
      ></ac-rating-basic>
    `);
    await el.updateComplete;
    expect(events).to.be.empty;
  });

  test('does not dispatch an event for a programmatic assignment', async () => {
    const el = await fixture(html`<ac-rating-basic></ac-rating-basic>`);
    const events = trackChanges(el);
    el.value = 3;
    await el.updateComplete;
    expect(events).to.be.empty;
  });

  test('does not dispatch an event when the selected star is clicked again', async () => {
    const el = await fixture(html`<ac-rating-basic value="3"></ac-rating-basic>`);
    const events = trackChanges(el);
    radiosOf(el)[2].click();
    await el.updateComplete;
    expect(events).to.be.empty;
  });

  test('previews a star on hover', async () => {
    const el = await fixture(html`<ac-rating-basic value="2"></ac-rating-basic>`);
    radiosOf(el)[3].dispatchEvent(new MouseEvent('mouseenter'));
    await el.updateComplete;
    expect(filledCount(el)).to.equal(4);
  });

  test('leaves the selected value unchanged during a preview', async () => {
    const el = await fixture(html`<ac-rating-basic value="2"></ac-rating-basic>`);
    radiosOf(el)[3].dispatchEvent(new MouseEvent('mouseenter'));
    await el.updateComplete;
    expect(el.value).to.equal(2);
  });

  test('restores the committed stars when the pointer leaves', async () => {
    const el = await fixture(html`<ac-rating-basic value="2"></ac-rating-basic>`);
    radiosOf(el)[3].dispatchEvent(new MouseEvent('mouseenter'));
    await el.updateComplete;
    groupOf(el).dispatchEvent(new MouseEvent('mouseleave'));
    await el.updateComplete;
    expect(filledCount(el)).to.equal(2);
  });

  test('does not dispatch an event on hover', async () => {
    const el = await fixture(html`<ac-rating-basic value="2"></ac-rating-basic>`);
    const events = trackChanges(el);
    radiosOf(el)[3].dispatchEvent(new MouseEvent('mouseenter'));
    await el.updateComplete;
    expect(events).to.be.empty;
  });
});

suite('ac-rating-basic: keyboard', () => {
  const moves = [
    { key: 'ArrowRight', from: 2, to: 3 },
    { key: 'ArrowUp', from: 2, to: 3 },
    { key: 'ArrowLeft', from: 2, to: 1 },
    { key: 'ArrowDown', from: 1, to: 0 },
    { key: 'Home', from: 2, to: 0 },
    { key: 'End', from: 2, to: 4 },
    { key: 'ArrowLeft', from: 0, to: 0 },
    { key: 'ArrowRight', from: 4, to: 4 },
    { key: 'ArrowRight', from: 0, to: 1 },
  ];

  for (const { key, from, to } of moves) {
    test(`handles ${key} from ${from}, setting value to ${to}`, async () => {
      const el = await fixture(html`<ac-rating-basic max="4" .value=${from}></ac-rating-basic>`);
      press(radiosOf(el)[Math.max(from, 1) - 1], key);
      await el.updateComplete;
      expect(el.value).to.equal(to);
    });
  }

  test('moves focus to the new selection with the keyboard', async () => {
    const el = await fixture(html`<ac-rating-basic value="2"></ac-rating-basic>`);
    const [, second, third] = radiosOf(el);
    second.focus();
    press(second, 'ArrowRight');
    await el.updateComplete;
    expect(el.shadowRoot.activeElement).to.equal(third);
  });

  test('restores the first radio as the tab stop when Home clears the rating', async () => {
    const el = await fixture(html`<ac-rating-basic value="3"></ac-rating-basic>`);
    press(radiosOf(el)[2], 'Home');
    await el.updateComplete;
    expect(radiosOf(el).map(button => button.tabIndex)).to.deep.equal([0, -1, -1, -1, -1]);
  });

  test('prevents default scrolling for handled keys', async () => {
    const el = await fixture(html`<ac-rating-basic></ac-rating-basic>`);
    expect(press(radiosOf(el)[0], 'ArrowDown').defaultPrevented).to.be.true;
  });

  test('dispatches a change with the keyboard rating', async () => {
    const el = await fixture(html`<ac-rating-basic value="2"></ac-rating-basic>`);
    const events = trackChanges(el);
    press(radiosOf(el)[1], 'Home');
    await el.updateComplete;
    expect(events.map(event => event.detail)).to.deep.equal([{ value: 0 }]);
  });

  test('does not dispatch a change when a key leaves the value unchanged', async () => {
    const el = await fixture(html`<ac-rating-basic></ac-rating-basic>`);
    const events = trackChanges(el);
    press(radiosOf(el)[0], 'ArrowLeft');
    await el.updateComplete;
    expect(events).to.be.empty;
  });
});

suite('ac-rating-basic: accessibility', () => {
  test('gives the radiogroup a translated accessible name', async () => {
    const el = await fixture(html`<ac-rating-basic locale="es-PE"></ac-rating-basic>`);
    expect(groupOf(el).getAttribute('aria-label')).to.equal('Calificación');
  });

  test('labels each radio with its star count in the active locale', async () => {
    const el = await fixture(html`<ac-rating-basic max="3" locale="en-EN"></ac-rating-basic>`);
    expect(radiosOf(el).map(button => button.getAttribute('aria-label'))).to.deep.equal([
      '1 star',
      '2 stars',
      '3 stars',
    ]);
  });

  test('describes the readonly rating as an image in the active locale', async () => {
    const el = await fixture(
      html`<ac-rating-basic value="4" readonly locale="pt-BR"></ac-rating-basic>`,
    );
    expect(el.shadowRoot.querySelector('[role="img"]').getAttribute('aria-label')).to.equal(
      'Avaliação: 4 de 5 estrelas',
    );
  });

  test('renders filled stars in readonly mode', async () => {
    const el = await fixture(html`<ac-rating-basic value="4" readonly></ac-rating-basic>`);
    expect(filledCount(el)).to.equal(4);
  });

  test('removes interactive controls when readonly is activated', async () => {
    const el = await fixture(html`<ac-rating-basic></ac-rating-basic>`);
    el.readonly = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('button, [tabindex], [role="radiogroup"], [role="radio"]'))
      .to.be.null;
  });
});
