import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

suite('ac-footer-basic', () => {
  test('defaults to ambient="surface"', async () => {
    const el = await fixture(html`<ac-footer-basic></ac-footer-basic>`);
    expect(el.ambient).to.equal('surface');
  });

  test('reflects ambient changes as an attribute', async () => {
    const el = await fixture(html`<ac-footer-basic></ac-footer-basic>`);
    el.ambient = 'plain';
    await el.updateComplete;
    expect(el.getAttribute('ambient')).to.equal('plain');
  });

  test('uses a solid background in the surface ambient', async () => {
    const el = await fixture(html`<ac-footer-basic></ac-footer-basic>`);
    const footer = el.shadowRoot.querySelector('footer');
    expect(getComputedStyle(footer).backgroundColor).to.equal('rgb(68, 67, 61)');
  });

  test('uses a transparent background in the plain ambient', async () => {
    const el = await fixture(html`<ac-footer-basic ambient="plain"></ac-footer-basic>`);
    const footer = el.shadowRoot.querySelector('footer');
    expect(getComputedStyle(footer).backgroundColor).to.equal('rgba(0, 0, 0, 0)');
  });

  test('renders a native footer as its root', async () => {
    const el = await fixture(html`<ac-footer-basic></ac-footer-basic>`);
    expect(el.shadowRoot.querySelector('footer[part="root"]')).to.exist;
  });

  test('assigns columns to the main slot in DOM order', async () => {
    const el = await fixture(html`
      <ac-footer-basic>
        <div>Recursos</div>
        <div>Contacto</div>
        <p slot="bottom">Copyright</p>
      </ac-footer-basic>
    `);
    const slot = el.shadowRoot.querySelector('[part="main"] slot');
    expect(slot.assignedElements().map(column => column.textContent)).to.deep.equal([
      'Recursos',
      'Contacto',
    ]);
  });

  test('assigns legal information to the bottom slot', async () => {
    const el = await fixture(html`
      <ac-footer-basic>
        <div>Recursos</div>
        <p slot="bottom">Copyright</p>
      </ac-footer-basic>
    `);
    const slot = el.shadowRoot.querySelector('[part="bottom"] slot');
    expect(slot.assignedElements()).to.deep.equal([el.querySelector('[slot="bottom"]')]);
  });

  test('separates the bottom slot with a divider when content is assigned', async () => {
    const el = await fixture(html`
      <ac-footer-basic>
        <div>Recursos</div>
        <p slot="bottom">Copyright</p>
      </ac-footer-basic>
    `);
    const bottom = el.shadowRoot.querySelector('[part="bottom"]');
    expect(getComputedStyle(bottom).borderBlockStartStyle).to.equal('solid');
  });

  test('leaves no empty strip when the bottom slot is unused', async () => {
    const el = await fixture(html`<ac-footer-basic><div>Recursos</div></ac-footer-basic>`);
    const bottom = el.shadowRoot.querySelector('[part="bottom"]');
    expect(bottom.getBoundingClientRect().height).to.equal(0);
  });

  test('places columns side by side in a wide container', async () => {
    const el = await fixture(html`
      <ac-footer-basic style="width: 640px">
        <div>Recursos</div>
        <div>Contacto</div>
      </ac-footer-basic>
    `);
    const [first, second] = el.children;
    expect(first.getBoundingClientRect().top).to.equal(second.getBoundingClientRect().top);
  });

  test('stacks columns in DOM order in a narrow container', async () => {
    const el = await fixture(html`
      <ac-footer-basic style="width: 320px">
        <div>Recursos</div>
        <div>Contacto</div>
        <p slot="bottom">Copyright</p>
      </ac-footer-basic>
    `);
    const tops = [...el.children].map(child => child.getBoundingClientRect().top);
    expect(tops).to.deep.equal([...new Set(tops)].sort((a, b) => a - b));
  });

  test('preserves the native tab stop of a slotted link', async () => {
    const el = await fixture(html`
      <ac-footer-basic><a href="#contacto">Contacto</a></ac-footer-basic>
    `);
    expect(el.querySelector('a').tabIndex).to.equal(0);
  });

  test('does not introduce a tab stop on the footer', async () => {
    const el = await fixture(html`<ac-footer-basic></ac-footer-basic>`);
    expect(el.shadowRoot.querySelector('footer').tabIndex).to.equal(-1);
  });

  for (const [locale, label] of [
    ['es-PE', 'Información del sitio'],
    ['en-EN', 'Site information'],
    ['pt-BR', 'Informações do site'],
  ]) {
    test(`translates the accessible name in ${locale}`, async () => {
      const el = await fixture(html`<ac-footer-basic locale=${locale}></ac-footer-basic>`);
      expect(el.shadowRoot.querySelector('footer').getAttribute('aria-label')).to.equal(label);
    });
  }
});
