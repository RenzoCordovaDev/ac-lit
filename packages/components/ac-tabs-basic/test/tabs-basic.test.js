import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing';
import '../index.js';

const TABS = [
  { id: 'one', label: 'Uno' },
  { id: 'two', label: 'Dos' },
  { id: 'three', label: 'Tres', disabled: true },
  { id: 'four', label: 'Cuatro' },
];

const tabEls = el => [...el.shadowRoot.querySelectorAll('[role="tab"]')];
const tabOf = (el, id) => el.shadowRoot.querySelector(`[role="tab"][data-id="${id}"]`);
const panelOf = (el, id) => el.shadowRoot.querySelector(`#panel-${id}`);
const press = (el, id, key) =>
  tabOf(el, id).dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
  );

const renderTabs = (attrs = '') =>
  fixture(
    html`<ac-tabs-basic .tabs=${TABS}>
      <div slot="one">Panel uno</div>
      <div slot="two">Panel dos</div>
      <div slot="three">Panel tres</div>
      <div slot="four">Panel cuatro</div>
    </ac-tabs-basic>`,
  ).then(el => {
    if (attrs)
      attrs.split(' ').forEach(pair => {
        const [name, value] = pair.split('=');
        el.setAttribute(name, value ?? '');
      });
    return el.updateComplete.then(() => el);
  });

suite('ac-tabs-basic', () => {
  test('renders a tablist', async () => {
    const el = await renderTabs();
    expect(el.shadowRoot.querySelector('[role="tablist"]')).to.exist;
  });

  test('renders one tab per entry in `tabs`', async () => {
    const el = await renderTabs();
    expect(tabEls(el).map(tab => tab.textContent.trim())).to.deep.equal([
      'Uno',
      'Dos',
      'Tres',
      'Cuatro',
    ]);
  });

  test('accepts `tabs` as a JSON attribute', async () => {
    const el = await fixture(html`<ac-tabs-basic tabs='[{"id":"a","label":"A"}]'></ac-tabs-basic>`);
    expect(tabEls(el).length).to.equal(1);
  });

  test('accepts plain strings in `tabs`', async () => {
    const el = await fixture(html`<ac-tabs-basic .tabs=${['uno', 'dos']}></ac-tabs-basic>`);
    expect(tabEls(el).map(tab => tab.dataset.id)).to.deep.equal(['uno', 'dos']);
  });

  test('renders no tabs by default', async () => {
    const el = await fixture(html`<ac-tabs-basic></ac-tabs-basic>`);
    expect(tabEls(el).length).to.equal(0);
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-tabs-basic></ac-tabs-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('applies the ambient class', async () => {
    const el = await fixture(html`<ac-tabs-basic ambient="secondary"></ac-tabs-basic>`);
    expect(el.shadowRoot.querySelector('.ac-tabs-basic').classList.contains('ac-tabs--secondary'))
      .to.be.true;
  });

  test('translates tab labels that are locale keys', async () => {
    const el = await fixture(
      html`<ac-tabs-basic .tabs=${[{ id: 'p', label: 'tabs-basic-profile' }]}></ac-tabs-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(tabOf(el, 'p').textContent.trim()).to.equal('Profile');
  });

  test('names the tablist with a11y-label', async () => {
    const el = await fixture(html`<ac-tabs-basic a11y-label="Ajustes"></ac-tabs-basic>`);
    expect(el.shadowRoot.querySelector('[role="tablist"]').getAttribute('aria-label')).to.equal(
      'Ajustes',
    );
  });

  test('selects the first enabled tab by default', async () => {
    const el = await renderTabs();
    expect(tabOf(el, 'one').getAttribute('aria-selected')).to.equal('true');
  });

  test('selects the tab given in `selected`', async () => {
    const el = await renderTabs('selected=two');
    expect(tabOf(el, 'two').getAttribute('aria-selected')).to.equal('true');
  });

  test('falls back to the first enabled tab when `selected` is unknown', async () => {
    const el = await renderTabs('selected=nope');
    expect(tabOf(el, 'one').getAttribute('aria-selected')).to.equal('true');
  });

  test('falls back to the first enabled tab when `selected` is disabled', async () => {
    const el = await renderTabs('selected=three');
    expect(tabOf(el, 'one').getAttribute('aria-selected')).to.equal('true');
  });

  test('marks the other tabs as not selected', async () => {
    const el = await renderTabs();
    expect(tabOf(el, 'two').getAttribute('aria-selected')).to.equal('false');
  });

  test('uses roving tabindex: 0 for the selected tab', async () => {
    const el = await renderTabs();
    expect(tabOf(el, 'one').tabIndex).to.equal(0);
  });

  test('uses roving tabindex: -1 for the other tabs', async () => {
    const el = await renderTabs();
    expect(tabOf(el, 'two').tabIndex).to.equal(-1);
  });

  test('disables a tab flagged as disabled', async () => {
    const el = await renderTabs();
    expect(tabOf(el, 'three').disabled).to.be.true;
  });

  test('links each tab to its panel with aria-controls', async () => {
    const el = await renderTabs();
    expect(tabOf(el, 'one').getAttribute('aria-controls')).to.equal(panelOf(el, 'one').id);
  });

  test('labels each panel with its tab', async () => {
    const el = await renderTabs();
    expect(panelOf(el, 'one').getAttribute('aria-labelledby')).to.equal(tabOf(el, 'one').id);
  });

  test('gives each panel the tabpanel role', async () => {
    const el = await renderTabs();
    expect(panelOf(el, 'one').getAttribute('role')).to.equal('tabpanel');
  });

  test('shows only the panel of the selected tab', async () => {
    const el = await renderTabs();
    expect(panelOf(el, 'one').hidden).to.be.false;
  });

  test('hides the panels of the other tabs', async () => {
    const el = await renderTabs();
    expect(panelOf(el, 'two').hidden).to.be.true;
  });

  test('routes slotted content to the panel with the same name', async () => {
    const el = await renderTabs();
    expect(el.querySelector('[slot="one"]').assignedSlot.parentElement.id).to.equal('panel-one');
  });

  test('makes the panels focusable', async () => {
    const el = await renderTabs();
    expect(panelOf(el, 'one').tabIndex).to.equal(0);
  });
});

suite('ac-tabs-basic: interaction', () => {
  test('selects a tab when it is clicked', async () => {
    const el = await renderTabs();
    tabOf(el, 'two').click();
    await el.updateComplete;
    expect(el.selected).to.equal('two');
  });

  test('shows the panel of the clicked tab', async () => {
    const el = await renderTabs();
    tabOf(el, 'two').click();
    await el.updateComplete;
    expect(panelOf(el, 'two').hidden).to.be.false;
  });

  test('hides the panel of the previous tab', async () => {
    const el = await renderTabs();
    tabOf(el, 'two').click();
    await el.updateComplete;
    expect(panelOf(el, 'one').hidden).to.be.true;
  });

  test('dispatches ac-tabs-basic-change with the tab id', async () => {
    const el = await renderTabs();
    setTimeout(() => tabOf(el, 'two').click());
    const event = await oneEvent(el, 'ac-tabs-basic-change');
    expect(event.detail).to.deep.equal({ id: 'two' });
  });

  test('ac-tabs-basic-change bubbles and is composed', async () => {
    const el = await renderTabs();
    setTimeout(() => tabOf(el, 'two').click());
    const event = await oneEvent(el, 'ac-tabs-basic-change');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });

  test('does not dispatch a change when the active tab is clicked again', async () => {
    const el = await renderTabs();
    let dispatched = false;
    el.addEventListener('ac-tabs-basic-change', () => {
      dispatched = true;
    });
    tabOf(el, 'one').click();
    await aTimeout(0);
    expect(dispatched).to.be.false;
  });

  test('does not dispatch a change when `selected` is set programmatically', async () => {
    const el = await renderTabs();
    let dispatched = false;
    el.addEventListener('ac-tabs-basic-change', () => {
      dispatched = true;
    });
    el.selected = 'two';
    await el.updateComplete;
    expect(dispatched).to.be.false;
  });

  test('ArrowRight selects the next enabled tab', async () => {
    const el = await renderTabs();
    press(el, 'one', 'ArrowRight');
    await el.updateComplete;
    expect(el.selected).to.equal('two');
  });

  test('ArrowRight skips disabled tabs', async () => {
    const el = await renderTabs('selected=two');
    press(el, 'two', 'ArrowRight');
    await el.updateComplete;
    expect(el.selected).to.equal('four');
  });

  test('ArrowRight wraps from the last tab to the first', async () => {
    const el = await renderTabs('selected=four');
    press(el, 'four', 'ArrowRight');
    await el.updateComplete;
    expect(el.selected).to.equal('one');
  });

  test('ArrowLeft selects the previous enabled tab', async () => {
    const el = await renderTabs('selected=four');
    press(el, 'four', 'ArrowLeft');
    await el.updateComplete;
    expect(el.selected).to.equal('two');
  });

  test('ArrowLeft wraps from the first tab to the last', async () => {
    const el = await renderTabs();
    press(el, 'one', 'ArrowLeft');
    await el.updateComplete;
    expect(el.selected).to.equal('four');
  });

  test('Home selects the first enabled tab', async () => {
    const el = await renderTabs('selected=four');
    press(el, 'four', 'Home');
    await el.updateComplete;
    expect(el.selected).to.equal('one');
  });

  test('End selects the last enabled tab', async () => {
    const el = await renderTabs();
    press(el, 'one', 'End');
    await el.updateComplete;
    expect(el.selected).to.equal('four');
  });

  test('moves the focus to the newly selected tab with the keyboard', async () => {
    const el = await renderTabs();
    tabOf(el, 'one').focus();
    press(el, 'one', 'ArrowRight');
    await el.updateComplete;
    await aTimeout(0);
    expect(el.shadowRoot.activeElement).to.equal(tabOf(el, 'two'));
  });

  test('prevents the default scrolling of arrow keys', async () => {
    const el = await renderTabs();
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });
    tabOf(el, 'one').dispatchEvent(event);
    expect(event.defaultPrevented).to.be.true;
  });

  test('ignores other keys', async () => {
    const el = await renderTabs();
    press(el, 'one', 'a');
    await el.updateComplete;
    expect(el.selected).to.equal('');
  });

  test('dispatches ac-tabs-basic-change when navigating with the keyboard', async () => {
    const el = await renderTabs();
    setTimeout(() => press(el, 'one', 'End'));
    const event = await oneEvent(el, 'ac-tabs-basic-change');
    expect(event.detail).to.deep.equal({ id: 'four' });
  });

  test('focus() moves the focus to the selected tab', async () => {
    const el = await renderTabs('selected=two');
    el.focus();
    expect(el.shadowRoot.activeElement).to.equal(tabOf(el, 'two'));
  });
});
