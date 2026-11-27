import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

suite('ac-header-basic', () => {
  test('renders a native header', async () => {
    const el = await fixture(html`<ac-header-basic></ac-header-basic>`);
    expect(el.shadowRoot.querySelector('header')).to.exist;
  });

  test('defaults to ambient="surface"', async () => {
    const el = await fixture(html`<ac-header-basic></ac-header-basic>`);
    expect(el.ambient).to.equal('surface');
  });

  test('defaults to sticky=false', async () => {
    const el = await fixture(html`<ac-header-basic></ac-header-basic>`);
    expect(el.sticky).to.be.false;
  });

  test('defaults to divider=true', async () => {
    const el = await fixture(html`<ac-header-basic></ac-header-basic>`);
    expect(el.divider).to.be.true;
  });

  test('reflects a change to ambient as an attribute', async () => {
    const el = await fixture(html`<ac-header-basic></ac-header-basic>`);
    el.ambient = 'transparent';
    await el.updateComplete;
    expect(el.getAttribute('ambient')).to.equal('transparent');
  });

  test('paints a solid surface by default', async () => {
    const el = await fixture(html`<ac-header-basic></ac-header-basic>`);
    const header = el.shadowRoot.querySelector('header');
    expect(getComputedStyle(header).backgroundColor).to.not.equal('rgba(0, 0, 0, 0)');
  });

  test('has a transparent background in the transparent ambient', async () => {
    const el = await fixture(html`<ac-header-basic ambient="transparent"></ac-header-basic>`);
    const header = el.shadowRoot.querySelector('header');
    expect(getComputedStyle(header).backgroundColor).to.equal('rgba(0, 0, 0, 0)');
  });

  test('reflects sticky when enabled through its property', async () => {
    const el = await fixture(html`<ac-header-basic></ac-header-basic>`);
    el.sticky = true;
    await el.updateComplete;
    expect(el.hasAttribute('sticky')).to.be.true;
  });

  test('stays at the top of its scroll container with sticky enabled', async () => {
    const scrollport = await fixture(html`
      <div style="block-size: 8rem; overflow: auto">
        <div style="block-size: 2rem"></div>
        <ac-header-basic sticky><span slot="start">Title</span></ac-header-basic>
        <div style="block-size: 20rem"></div>
      </div>
    `);
    const el = scrollport.querySelector('ac-header-basic');
    await el.updateComplete;
    scrollport.scrollTop = 96;
    expect(el.getBoundingClientRect().top).to.be.closeTo(scrollport.getBoundingClientRect().top, 1);
  });

  test('reflects sticky when disabled through its property', async () => {
    const el = await fixture(html`<ac-header-basic sticky></ac-header-basic>`);
    el.sticky = false;
    await el.updateComplete;
    expect(el.hasAttribute('sticky')).to.be.false;
  });

  test('renders a bottom divider by default', async () => {
    const el = await fixture(html`<ac-header-basic></ac-header-basic>`);
    const header = el.shadowRoot.querySelector('header');
    expect(parseFloat(getComputedStyle(header).borderBottomWidth)).to.be.greaterThan(0);
  });

  test('removes the divider attribute when its property is false', async () => {
    const el = await fixture(html`<ac-header-basic></ac-header-basic>`);
    el.divider = false;
    await el.updateComplete;
    expect(el.hasAttribute('divider')).to.be.false;
  });

  test('removes the bottom divider when the attribute is removed', async () => {
    const el = await fixture(html`<ac-header-basic divider></ac-header-basic>`);
    el.removeAttribute('divider');
    await el.updateComplete;
    const header = el.shadowRoot.querySelector('header');
    expect(getComputedStyle(header).borderBottomWidth).to.equal('0px');
  });

  test('renders the title in the start slot', async () => {
    const el = await fixture(
      html`<ac-header-basic><span slot="start">Title</span></ac-header-basic>`,
    );
    const slot = el.shadowRoot.querySelector('slot[name="start"]');
    expect(slot.assignedElements()).to.deep.equal([el.querySelector('span')]);
  });

  test('renders content in the default slot', async () => {
    const el = await fixture(html`
      <ac-header-basic><input type="search" aria-label="Search" /></ac-header-basic>
    `);
    const slot = el.shadowRoot.querySelector('slot:not([name])');
    expect(slot.assignedElements()).to.deep.equal([el.querySelector('input')]);
  });

  test('renders actions in the end slot', async () => {
    const el = await fixture(html`
      <ac-header-basic><button slot="end" type="button">Save</button></ac-header-basic>
    `);
    const slot = el.shadowRoot.querySelector('slot[name="end"]');
    expect(slot.assignedElements()).to.deep.equal([el.querySelector('button')]);
  });

  test('aligns actions to the end when the default slot is empty', async () => {
    const el = await fixture(html`
      <ac-header-basic style="inline-size: 24rem; direction: ltr">
        <span slot="start">Title</span>
        <button slot="end" type="button">Save</button>
      </ac-header-basic>
    `);
    const header = el.shadowRoot.querySelector('header');
    const rightInset = parseFloat(getComputedStyle(header).paddingRight);
    const expectedRight = header.getBoundingClientRect().right - rightInset;
    expect(el.querySelector('button').getBoundingClientRect().right).to.be.closeTo(
      expectedRight,
      1,
    );
  });

  test('preserves the focus behavior of a slotted native button', async () => {
    const el = await fixture(html`
      <ac-header-basic><button slot="end" type="button">Save</button></ac-header-basic>
    `);
    const button = el.querySelector('button');
    button.focus();
    expect(document.activeElement).to.equal(button);
  });

  test('does not add a tab stop to the native header', async () => {
    const el = await fixture(html`<ac-header-basic></ac-header-basic>`);
    expect(el.shadowRoot.querySelector('header').tabIndex).to.equal(-1);
  });
});
