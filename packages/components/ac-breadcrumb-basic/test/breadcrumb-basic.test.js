import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

const navigateEvent = 'ac-breadcrumb-basic-navigate';
const items = [
  { text: 'Inicio', href: '#breadcrumb-test-home' },
  { text: 'breadcrumb-basic-catalog', href: '#breadcrumb-test-catalog' },
  { text: 'Audio' },
  { text: 'Auriculares', href: '#breadcrumb-test-current' },
];

function renderBreadcrumb() {
  return fixture(html`<ac-breadcrumb-basic .items=${items}></ac-breadcrumb-basic>`);
}

function clickCatalogLink(el) {
  const link = el.shadowRoot.querySelector('a[href="#breadcrumb-test-catalog"]');
  link.addEventListener('click', event => event.preventDefault(), { once: true });

  const event = oneEvent(el, navigateEvent);
  link.click();
  return event;
}

suite('ac-breadcrumb-basic', () => {
  test('defaults to an empty items array', async () => {
    const el = await fixture(html`<ac-breadcrumb-basic></ac-breadcrumb-basic>`);
    expect(el.items).to.deep.equal([]);
  });

  test('does not render an empty navigation landmark', async () => {
    const el = await fixture(html`<ac-breadcrumb-basic></ac-breadcrumb-basic>`);
    expect(el.shadowRoot.querySelector('nav')).to.be.null;
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-breadcrumb-basic></ac-breadcrumb-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('reflects ambient changes as an attribute', async () => {
    const el = await renderBreadcrumb();
    el.ambient = 'secondary';
    await el.updateComplete;
    expect(el.getAttribute('ambient')).to.equal('secondary');
  });

  test('renders items in a native ordered list', async () => {
    const el = await renderBreadcrumb();
    expect(el.shadowRoot.querySelectorAll('nav > ol > li')).to.have.lengthOf(4);
  });

  test('accepts items as a JSON attribute', async () => {
    const el = await fixture(
      html`<ac-breadcrumb-basic
        items='[{"text":"Inicio","href":"/"},{"text":"Audio"}]'
      ></ac-breadcrumb-basic>`,
    );
    expect(el.shadowRoot.querySelector('[aria-current="page"]').textContent.trim()).to.equal(
      'Audio',
    );
  });

  test('accepts items as a JSON string property', async () => {
    const el = await fixture(html`<ac-breadcrumb-basic></ac-breadcrumb-basic>`);
    el.items = JSON.stringify([{ text: 'Inicio', href: '/' }, { text: 'Audio' }]);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[aria-current="page"]').textContent.trim()).to.equal(
      'Audio',
    );
  });

  test('translates the navigation landmark label', async () => {
    const el = await fixture(
      html`<ac-breadcrumb-basic locale="en-EN" .items=${items}></ac-breadcrumb-basic>`,
    );
    expect(el.shadowRoot.querySelector('nav').getAttribute('aria-label')).to.equal('Breadcrumb');
  });

  test('translates item text when the locale changes', async () => {
    const el = await fixture(
      html`<ac-breadcrumb-basic
        .items=${[{ text: 'breadcrumb-basic-home', href: '/' }, { text: 'Audio' }]}
      ></ac-breadcrumb-basic>`,
    );
    el.locale = 'pt-BR';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('a').textContent.trim()).to.equal('Início');
  });

  test('renders earlier items with href as native links', async () => {
    const el = await renderBreadcrumb();
    const links = [...el.shadowRoot.querySelectorAll('a')];
    expect(links.map(link => link.getAttribute('href'))).to.deep.equal([
      '#breadcrumb-test-home',
      '#breadcrumb-test-catalog',
    ]);
  });

  test('renders intermediate items without href as plain text', async () => {
    const el = await renderBreadcrumb();
    expect(el.shadowRoot.querySelector('li:nth-child(3) > span').textContent.trim()).to.equal(
      'Audio',
    );
  });

  test('marks the final item as the current page even if it has an href', async () => {
    const el = await renderBreadcrumb();
    expect(
      el.shadowRoot.querySelector('li:last-child > span[aria-current="page"]').textContent.trim(),
    ).to.equal('Auriculares');
  });

  test('only links participate in the keyboard tab order', async () => {
    const el = await renderBreadcrumb();
    const itemContents = [...el.shadowRoot.querySelectorAll('li > *')];
    expect(itemContents.map(item => item.tabIndex)).to.deep.equal([0, 0, -1, -1]);
  });

  test('does not notify navigation on the first render', async () => {
    let count = 0;
    await fixture(html`
      <ac-breadcrumb-basic
        .items=${items}
        @ac-breadcrumb-basic-navigate=${() => count++}
      ></ac-breadcrumb-basic>
    `);
    expect(count).to.equal(0);
  });

  test('does not notify navigation when clicking plain-text items', async () => {
    const el = await renderBreadcrumb();
    let count = 0;
    el.addEventListener(navigateEvent, () => count++);
    el.shadowRoot.querySelectorAll('li > span').forEach(item => item.click());
    expect(count).to.equal(0);
  });

  test('dispatches the activated link index and raw item data', async () => {
    const el = await renderBreadcrumb();
    const event = await clickCatalogLink(el);
    expect(event.detail).to.deep.equal({
      index: 1,
      item: { text: 'breadcrumb-basic-catalog', href: '#breadcrumb-test-catalog' },
    });
  });

  test('the navigation event bubbles', async () => {
    const el = await renderBreadcrumb();
    const event = await clickCatalogLink(el);
    expect(event.bubbles).to.be.true;
  });

  test('the navigation event is composed', async () => {
    const el = await renderBreadcrumb();
    const event = await clickCatalogLink(el);
    expect(event.composed).to.be.true;
  });

  test('preserves native hash navigation when clicking a link', async () => {
    const originalUrl = window.location.href;
    const originalState = window.history.state;
    const wrapper = await fixture(html`
      <div>
        <ac-breadcrumb-basic .items=${items}></ac-breadcrumb-basic>
        <div id="breadcrumb-test-home">Inicio</div>
      </div>
    `);
    const el = wrapper.querySelector('ac-breadcrumb-basic');
    await el.updateComplete;

    try {
      const hashChange = oneEvent(window, 'hashchange');
      el.shadowRoot.querySelector('a').click();
      await hashChange;
      expect(window.location.hash).to.equal('#breadcrumb-test-home');
    } finally {
      window.history.replaceState(originalState, '', originalUrl);
    }
  });
});
