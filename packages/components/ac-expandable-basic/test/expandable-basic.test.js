import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing';
import '../index.js';

const headerOf = el => el.shadowRoot.querySelector('button');
const panelOf = el => el.shadowRoot.querySelector('[part="panel"]');

suite('ac-expandable-basic', () => {
  test('renders a header button', async () => {
    const el = await fixture(html`<ac-expandable-basic header="Título"></ac-expandable-basic>`);
    expect(headerOf(el)).to.exist;
  });

  test('defaults to closed', async () => {
    const el = await fixture(html`<ac-expandable-basic></ac-expandable-basic>`);
    expect(el.open).to.be.false;
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-expandable-basic></ac-expandable-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('applies the ambient class', async () => {
    const el = await fixture(html`<ac-expandable-basic ambient="secondary"></ac-expandable-basic>`);
    expect(
      el.shadowRoot
        .querySelector('.ac-expandable-basic')
        .classList.contains('ac-expandable--secondary'),
    ).to.be.true;
  });

  test('renders the header text', async () => {
    const el = await fixture(html`<ac-expandable-basic header="Título"></ac-expandable-basic>`);
    expect(headerOf(el).textContent.trim()).to.equal('Título');
  });

  test('translates the header when it is a locale key', async () => {
    const el = await fixture(
      html`<ac-expandable-basic header="expandable-basic-details"></ac-expandable-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(headerOf(el).textContent.trim()).to.equal('More details');
  });

  test('renders slotted content in the panel', async () => {
    const el = await fixture(
      html`<ac-expandable-basic open><p>Contenido</p></ac-expandable-basic>`,
    );
    expect(el.querySelector('p').assignedSlot).to.exist;
  });

  test('accepts a custom header through the header slot', async () => {
    const el = await fixture(html`
      <ac-expandable-basic><span slot="header">A medida</span></ac-expandable-basic>
    `);
    expect(el.querySelector('[slot="header"]').assignedSlot).to.exist;
  });

  test('exposes aria-expanded="false" when closed', async () => {
    const el = await fixture(html`<ac-expandable-basic></ac-expandable-basic>`);
    expect(headerOf(el).getAttribute('aria-expanded')).to.equal('false');
  });

  test('exposes aria-expanded="true" when open', async () => {
    const el = await fixture(html`<ac-expandable-basic open></ac-expandable-basic>`);
    expect(headerOf(el).getAttribute('aria-expanded')).to.equal('true');
  });

  test('links the header to the panel with aria-controls', async () => {
    const el = await fixture(html`<ac-expandable-basic></ac-expandable-basic>`);
    expect(headerOf(el).getAttribute('aria-controls')).to.equal(panelOf(el).id);
  });

  test('labels the panel region with the header', async () => {
    const el = await fixture(html`<ac-expandable-basic></ac-expandable-basic>`);
    expect(panelOf(el).getAttribute('aria-labelledby')).to.equal(headerOf(el).id);
  });

  test('makes the panel inert while closed', async () => {
    const el = await fixture(html`<ac-expandable-basic></ac-expandable-basic>`);
    expect(panelOf(el).hasAttribute('inert')).to.be.true;
  });

  test('makes the panel interactive while open', async () => {
    const el = await fixture(html`<ac-expandable-basic open></ac-expandable-basic>`);
    expect(panelOf(el).hasAttribute('inert')).to.be.false;
  });

  test('reflects open onto the host attribute', async () => {
    const el = await fixture(html`<ac-expandable-basic open></ac-expandable-basic>`);
    expect(el.hasAttribute('open')).to.be.true;
  });

  test('opens when the header is clicked', async () => {
    const el = await fixture(html`<ac-expandable-basic></ac-expandable-basic>`);
    headerOf(el).click();
    await el.updateComplete;
    expect(el.open).to.be.true;
  });

  test('closes when the header is clicked while open', async () => {
    const el = await fixture(html`<ac-expandable-basic open></ac-expandable-basic>`);
    headerOf(el).click();
    await el.updateComplete;
    expect(el.open).to.be.false;
  });

  test('show() opens the panel', async () => {
    const el = await fixture(html`<ac-expandable-basic></ac-expandable-basic>`);
    el.show();
    await el.updateComplete;
    expect(el.open).to.be.true;
  });

  test('hide() closes the panel', async () => {
    const el = await fixture(html`<ac-expandable-basic open></ac-expandable-basic>`);
    el.hide();
    await el.updateComplete;
    expect(el.open).to.be.false;
  });

  test('disables the header button when disabled', async () => {
    const el = await fixture(html`<ac-expandable-basic disabled></ac-expandable-basic>`);
    expect(headerOf(el).disabled).to.be.true;
  });

  test('does not open when disabled', async () => {
    const el = await fixture(html`<ac-expandable-basic disabled></ac-expandable-basic>`);
    headerOf(el).click();
    await el.updateComplete;
    expect(el.open).to.be.false;
  });

  test('dispatches ac-expandable-basic-toggle with open=true when opened', async () => {
    const el = await fixture(html`<ac-expandable-basic></ac-expandable-basic>`);
    setTimeout(() => headerOf(el).click());
    const event = await oneEvent(el, 'ac-expandable-basic-toggle');
    expect(event.detail).to.deep.equal({ open: true });
  });

  test('dispatches ac-expandable-basic-toggle with open=false when closed', async () => {
    const el = await fixture(html`<ac-expandable-basic open></ac-expandable-basic>`);
    setTimeout(() => headerOf(el).click());
    const event = await oneEvent(el, 'ac-expandable-basic-toggle');
    expect(event.detail).to.deep.equal({ open: false });
  });

  test('ac-expandable-basic-toggle bubbles and is composed', async () => {
    const el = await fixture(html`<ac-expandable-basic></ac-expandable-basic>`);
    setTimeout(() => headerOf(el).click());
    const event = await oneEvent(el, 'ac-expandable-basic-toggle');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });

  test('does not dispatch a toggle event for its initial open state', async () => {
    let dispatched = false;
    const wrapper = await fixture(html`<div></div>`);
    wrapper.addEventListener('ac-expandable-basic-toggle', () => {
      dispatched = true;
    });
    const el = document.createElement('ac-expandable-basic');
    el.setAttribute('open', '');
    wrapper.appendChild(el);
    await el.updateComplete;
    await aTimeout(0);
    expect(dispatched).to.be.false;
  });
});

suite('ac-expandable-basic: group', () => {
  const renderGroup = (groupName, openIndex) =>
    fixture(html`
      <div>
        <ac-expandable-basic group=${groupName} ?open=${openIndex === 0}></ac-expandable-basic>
        <ac-expandable-basic group=${groupName} ?open=${openIndex === 1}></ac-expandable-basic>
        <ac-expandable-basic group=${groupName} ?open=${openIndex === 2}></ac-expandable-basic>
      </div>
    `);

  test('closes the other panels of the group when one opens', async () => {
    const container = await renderGroup('g-open-one', 0);
    const [first, second] = container.querySelectorAll('ac-expandable-basic');
    second.open = true;
    await second.updateComplete;
    await first.updateComplete;
    expect(first.open).to.be.false;
  });

  test('keeps the opened panel open', async () => {
    const container = await renderGroup('g-keep-open', 0);
    const [, second] = container.querySelectorAll('ac-expandable-basic');
    second.open = true;
    await second.updateComplete;
    expect(second.open).to.be.true;
  });

  test('closes the others when the user clicks a closed panel', async () => {
    const container = await renderGroup('g-click', 0);
    const [first, second] = container.querySelectorAll('ac-expandable-basic');
    second.shadowRoot.querySelector('button').click();
    await second.updateComplete;
    await first.updateComplete;
    expect(first.open).to.be.false;
  });

  test('dispatches a toggle event for the panel closed by the group', async () => {
    const container = await renderGroup('g-event', 0);
    const [first, second] = container.querySelectorAll('ac-expandable-basic');
    setTimeout(() => {
      second.open = true;
    });
    const event = await oneEvent(first, 'ac-expandable-basic-toggle');
    expect(event.detail).to.deep.equal({ open: false });
  });

  test('allows only one panel open when several start open in the same group', async () => {
    const container = await fixture(html`
      <div>
        <ac-expandable-basic group="g-initial" open></ac-expandable-basic>
        <ac-expandable-basic group="g-initial" open></ac-expandable-basic>
      </div>
    `);
    const panels = [...container.querySelectorAll('ac-expandable-basic')];
    await Promise.all(panels.map(panel => panel.updateComplete));
    await aTimeout(0);
    expect(panels.filter(panel => panel.open).length).to.equal(1);
  });

  test('does not affect panels of another group', async () => {
    const container = await fixture(html`
      <div>
        <ac-expandable-basic group="g-a" open></ac-expandable-basic>
        <ac-expandable-basic group="g-b"></ac-expandable-basic>
      </div>
    `);
    const [first, second] = container.querySelectorAll('ac-expandable-basic');
    second.open = true;
    await second.updateComplete;
    await first.updateComplete;
    expect(first.open).to.be.true;
  });

  test('does not affect panels without a group', async () => {
    const container = await fixture(html`
      <div>
        <ac-expandable-basic open></ac-expandable-basic>
        <ac-expandable-basic></ac-expandable-basic>
      </div>
    `);
    const [first, second] = container.querySelectorAll('ac-expandable-basic');
    second.open = true;
    await second.updateComplete;
    await first.updateComplete;
    expect(first.open).to.be.true;
  });

  test('stops coordinating a panel once it is removed from the DOM', async () => {
    const container = await renderGroup('g-removed', 0);
    const [first, second] = container.querySelectorAll('ac-expandable-basic');
    first.remove();
    second.open = true;
    await second.updateComplete;
    await aTimeout(0);
    expect(first.open).to.be.true;
  });
});
