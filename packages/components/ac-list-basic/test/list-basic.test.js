import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

const ITEMS = [
  { id: 'account', text: 'Cuenta', description: 'Información personal', icon: 'user' },
  { id: 2, text: 'Preferencias', selected: true },
  { id: 'security', text: 'Seguridad', disabled: true },
];
const ITEM_CLICK = 'ac-list-basic-item-click';

const listOf = el => el.shadowRoot.querySelector('ul');
const itemLabels = el =>
  [...listOf(el).querySelectorAll('[part~="text"]')].map(label => label.textContent.trim());
const buttonsOf = el => listOf(el).querySelectorAll('li > button');
const slottedItems = el => [...listOf(el).querySelector('slot').assignedElements()];

suite('ac-list-basic', () => {
  test('defaults to an empty array of items', async () => {
    const el = await fixture(html`<ac-list-basic></ac-list-basic>`);
    expect(el.items).to.deep.equal([]);
  });

  test('defaults to selectable=false', async () => {
    const el = await fixture(html`<ac-list-basic></ac-list-basic>`);
    expect(el.selectable).to.be.false;
  });

  test('defaults to ambient="surface"', async () => {
    const el = await fixture(html`<ac-list-basic></ac-list-basic>`);
    expect(el.ambient).to.equal('surface');
  });

  test('reflects a changed ambient property to the attribute', async () => {
    const el = await fixture(html`<ac-list-basic></ac-list-basic>`);
    el.ambient = 'plain';
    await el.updateComplete;
    expect(el.getAttribute('ambient')).to.equal('plain');
  });

  test('renders items in the order of the array', async () => {
    const el = await fixture(html`<ac-list-basic .items=${ITEMS}></ac-list-basic>`);
    expect(itemLabels(el)).to.deep.equal(['Cuenta', 'Preferencias', 'Seguridad']);
  });

  test('accepts items as a JSON attribute', async () => {
    const el = await fixture(
      html`<ac-list-basic items='[{"id":"one","text":"Uno"}]'></ac-list-basic>`,
    );
    expect(itemLabels(el)).to.deep.equal(['Uno']);
  });

  test('accepts a JSON string assigned to the items property', async () => {
    const el = await fixture(html`<ac-list-basic></ac-list-basic>`);
    el.items = JSON.stringify(ITEMS.slice(0, 1));
    await el.updateComplete;
    expect(itemLabels(el)).to.deep.equal(['Cuenta']);
  });

  test('renders a description when supplied', async () => {
    const el = await fixture(html`<ac-list-basic .items=${ITEMS}></ac-list-basic>`);
    expect(listOf(el).querySelector('[part~="description"]').textContent.trim()).to.equal(
      'Información personal',
    );
  });

  test('omits the description when none is supplied', async () => {
    const el = await fixture(html`<ac-list-basic .items=${[ITEMS[1]]}></ac-list-basic>`);
    expect(listOf(el).querySelector('[part~="description"]')).to.not.exist;
  });

  test('renders a known icon as a decorative SVG', async () => {
    const el = await fixture(html`<ac-list-basic .items=${[ITEMS[0]]}></ac-list-basic>`);
    expect(listOf(el).querySelector('svg[aria-hidden="true"]')).to.exist;
  });

  test('omits unknown icons and the none icon', async () => {
    const el = await fixture(
      html`<ac-list-basic
        .items=${[
          { id: 'one', text: 'Uno', icon: 'unknown' },
          { id: 'two', text: 'Dos', icon: 'none' },
        ]}
      ></ac-list-basic>`,
    );
    expect(listOf(el).querySelector('svg')).to.not.exist;
  });

  test('uses the default slot for custom list items', async () => {
    const el = await fixture(html`<ac-list-basic><li>Contenido propio</li></ac-list-basic>`);
    expect(slottedItems(el)).to.deep.equal([el.querySelector('li')]);
  });

  test('prefers supplied items to the default slot', async () => {
    const el = await fixture(html`
      <ac-list-basic .items=${ITEMS}><li>Contenido propio</li></ac-list-basic>
    `);
    expect(el.querySelector('li').assignedSlot).to.be.null;
  });

  test('restores the default slot when the items array becomes empty', async () => {
    const el = await fixture(html`
      <ac-list-basic .items=${ITEMS}><li>Contenido propio</li></ac-list-basic>
    `);
    el.items = [];
    await el.updateComplete;
    expect(slottedItems(el)).to.deep.equal([el.querySelector('li')]);
  });

  test('falls back to the slot for invalid JSON in the items attribute', async () => {
    const el = await fixture(html`
      <ac-list-basic items="["><li>Contenido propio</li></ac-list-basic>
    `);
    expect(slottedItems(el)).to.deep.equal([el.querySelector('li')]);
  });

  test('falls back to the slot when items JSON does not represent an array', async () => {
    const el = await fixture(html`
      <ac-list-basic .items=${'{}'}><li>Contenido propio</li></ac-list-basic>
    `);
    expect(slottedItems(el)).to.deep.equal([el.querySelector('li')]);
  });

  test('retains native list semantics in a non-selectable list', async () => {
    const el = await fixture(html`<ac-list-basic .items=${ITEMS}></ac-list-basic>`);
    expect(el.shadowRoot.querySelectorAll('ul[role="list"] > li')).to.have.lengthOf(3);
  });

  test('omits buttons in a non-selectable list', async () => {
    const el = await fixture(html`<ac-list-basic .items=${ITEMS}></ac-list-basic>`);
    expect(listOf(el).querySelector('button')).to.not.exist;
  });

  test('renders a native button inside each list item when selectable is set', async () => {
    const el = await fixture(html`<ac-list-basic selectable .items=${ITEMS}></ac-list-basic>`);
    const rowButtons = el.shadowRoot.querySelectorAll(
      'ul[role="list"] > li > button[type="button"]',
    );
    expect(rowButtons).to.have.lengthOf(3);
  });

  test('focuses an enabled row button', async () => {
    const el = await fixture(html`<ac-list-basic selectable .items=${ITEMS}></ac-list-basic>`);
    const [enabled] = buttonsOf(el);
    enabled.focus();
    expect(el.shadowRoot.activeElement).to.equal(enabled);
  });

  test('sets the native disabled state for a disabled row', async () => {
    const el = await fixture(html`<ac-list-basic selectable .items=${ITEMS}></ac-list-basic>`);
    expect(buttonsOf(el)[2].disabled).to.be.true;
  });

  test('skips a disabled row when focus is requested', async () => {
    const el = await fixture(html`<ac-list-basic selectable .items=${ITEMS}></ac-list-basic>`);
    const [enabled, , disabled] = buttonsOf(el);
    enabled.focus();
    disabled.focus();
    expect(el.shadowRoot.activeElement).to.equal(enabled);
  });

  test('marks the selected row for styling', async () => {
    const el = await fixture(html`<ac-list-basic .items=${ITEMS}></ac-list-basic>`);
    const selectedLabel = listOf(el).querySelector('li[data-selected] [part~="text"]');
    expect(selectedLabel.textContent.trim()).to.equal('Preferencias');
  });

  test('exposes the selection state on each selectable button', async () => {
    const el = await fixture(html`<ac-list-basic selectable .items=${ITEMS}></ac-list-basic>`);
    expect([...buttonsOf(el)].map(button => button.getAttribute('aria-pressed'))).to.deep.equal([
      'false',
      'true',
      'false',
    ]);
  });

  test('dispatches ac-list-basic-item-click with the item ID and zero-based index', async () => {
    const el = await fixture(html`<ac-list-basic selectable .items=${ITEMS}></ac-list-basic>`);
    const clicked = oneEvent(el, ITEM_CLICK);
    buttonsOf(el)[1].click();
    expect((await clicked).detail).to.deep.equal({ id: 2, index: 1 });
  });

  test('lets ac-list-basic-item-click bubble to the parent', async () => {
    const wrapper = await fixture(html`
      <div><ac-list-basic selectable .items=${ITEMS}></ac-list-basic></div>
    `);
    const el = wrapper.querySelector('ac-list-basic');
    await el.updateComplete;
    const clicked = oneEvent(wrapper, ITEM_CLICK);
    buttonsOf(el)[0].click();
    expect((await clicked).target).to.equal(el);
  });

  test('sets composed on ac-list-basic-item-click', async () => {
    const el = await fixture(html`<ac-list-basic selectable .items=${ITEMS}></ac-list-basic>`);
    const clicked = oneEvent(el, ITEM_CLICK);
    buttonsOf(el)[0].click();
    expect((await clicked).composed).to.be.true;
  });

  test('emits no item-click event during the first render', async () => {
    const events = [];
    await fixture(html`
      <ac-list-basic
        selectable
        .items=${ITEMS}
        @ac-list-basic-item-click=${event => events.push(event)}
      ></ac-list-basic>
    `);
    expect(events).to.be.empty;
  });

  test('emits no item-click event when a disabled row is clicked', async () => {
    const el = await fixture(html`<ac-list-basic selectable .items=${ITEMS}></ac-list-basic>`);
    const events = [];
    el.addEventListener(ITEM_CLICK, event => events.push(event));
    buttonsOf(el)[2].click();
    expect(events).to.be.empty;
  });

  test('leaves selection to the consumer after a row is clicked', async () => {
    const el = await fixture(html`<ac-list-basic selectable .items=${ITEMS}></ac-list-basic>`);
    buttonsOf(el)[0].click();
    await el.updateComplete;
    expect(buttonsOf(el)[0].getAttribute('aria-pressed')).to.equal('false');
  });

  test('updates the row selection when the consumer replaces the items', async () => {
    const el = await fixture(html`<ac-list-basic selectable .items=${ITEMS}></ac-list-basic>`);
    el.items = [{ ...ITEMS[0], selected: true }];
    await el.updateComplete;
    expect(buttonsOf(el)[0].getAttribute('aria-pressed')).to.equal('true');
  });

  test('translates an item text key using the active locale', async () => {
    const el = await fixture(
      html`<ac-list-basic
        .items=${[{ id: 'profile', text: 'list-basic-profile' }]}
      ></ac-list-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(itemLabels(el)).to.deep.equal(['Profile']);
  });

  test('translates an item description key using the active locale', async () => {
    const el = await fixture(
      html`<ac-list-basic
        .items=${[
          {
            id: 'profile',
            text: 'list-basic-profile',
            description: 'list-basic-profile-description',
          },
        ]}
      ></ac-list-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(listOf(el).querySelector('[part~="description"]').textContent.trim()).to.equal(
      'Manage your personal information',
    );
  });
});
