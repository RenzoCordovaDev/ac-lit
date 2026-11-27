import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

suite('ac-container-basic', () => {
  test('renders content through the default slot', async () => {
    const el = await fixture(html`<ac-container-basic><p>Entrega</p></ac-container-basic>`);
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot.assignedElements()).to.deep.equal([el.querySelector('p')]);
  });

  test('defaults to ambient="surface"', async () => {
    const el = await fixture(html`<ac-container-basic></ac-container-basic>`);
    expect(el.ambient).to.equal('surface');
  });

  test('defaults to padding="md"', async () => {
    const el = await fixture(html`<ac-container-basic></ac-container-basic>`);
    expect(el.padding).to.equal('md');
  });

  test('reflects ambient changes to the host attribute', async () => {
    const el = await fixture(html`<ac-container-basic></ac-container-basic>`);
    el.ambient = 'outlined';
    await el.updateComplete;
    expect(el.getAttribute('ambient')).to.equal('outlined');
  });

  test('reflects padding changes to the host attribute', async () => {
    const el = await fixture(html`<ac-container-basic></ac-container-basic>`);
    el.padding = 'lg';
    await el.updateComplete;
    expect(el.getAttribute('padding')).to.equal('lg');
  });

  test('uses the surface color token for ambient="surface"', async () => {
    const el = await fixture(html`
      <ac-container-basic ambient="surface" style="--color-surface: rgb(38, 40, 42)">
      </ac-container-basic>
    `);
    expect(getComputedStyle(el.shadowRoot.querySelector('[part="root"]')).backgroundColor).to.equal(
      'rgb(38, 40, 42)',
    );
  });

  test('uses the elevation token for ambient="surface"', async () => {
    const el = await fixture(html`
      <ac-container-basic style="--elev-1: black 0 2px 8px"></ac-container-basic>
    `);
    expect(getComputedStyle(el.shadowRoot.querySelector('[part="root"]')).boxShadow).to.equal(
      'rgb(0, 0, 0) 0px 2px 8px 0px',
    );
  });

  test('uses a transparent background for ambient="outlined" in the light theme', async () => {
    const wrapper = await fixture(html`
      <div data-theme="light"><ac-container-basic ambient="outlined"></ac-container-basic></div>
    `);
    const root = wrapper.firstElementChild.shadowRoot.querySelector('[part="root"]');
    expect(getComputedStyle(root).backgroundColor).to.equal('rgba(0, 0, 0, 0)');
  });

  test('draws a border for ambient="outlined"', async () => {
    const el = await fixture(html`<ac-container-basic ambient="outlined"></ac-container-basic>`);
    expect(getComputedStyle(el.shadowRoot.querySelector('[part="root"]')).borderTopStyle).to.equal(
      'solid',
    );
  });

  test('falls back to the surface color for unsupported ambients', async () => {
    const el = await fixture(html`
      <ac-container-basic ambient="unknown" style="--color-surface: rgb(38, 40, 42)">
      </ac-container-basic>
    `);
    expect(getComputedStyle(el.shadowRoot.querySelector('[part="root"]')).backgroundColor).to.equal(
      'rgb(38, 40, 42)',
    );
  });

  for (const [padding, expected] of [
    ['sm', '12px'],
    ['md', '16px'],
    ['lg', '24px'],
    ['unknown', '16px'],
  ]) {
    test(`uses ${expected} when padding="${padding}"`, async () => {
      const el = await fixture(html`
        <ac-container-basic
          padding=${padding}
          style="--space-3: 12px; --space-4: 16px; --space-6: 24px"
        ></ac-container-basic>
      `);
      expect(getComputedStyle(el.shadowRoot.querySelector('[part="root"]')).padding).to.equal(
        expected,
      );
    });
  }

  test('uses a generic div for the panel', async () => {
    const el = await fixture(html`<ac-container-basic></ac-container-basic>`);
    expect(el.shadowRoot.querySelector('div[part="root"]:not([role])')).to.exist;
  });

  test('does not add a tab stop to the host', async () => {
    const el = await fixture(html`<ac-container-basic></ac-container-basic>`);
    expect(el.tabIndex).to.equal(-1);
  });

  test('preserves focus on slotted controls', async () => {
    const el = await fixture(
      html`<ac-container-basic><button>Continuar</button></ac-container-basic>`,
    );
    const button = el.querySelector('button');
    button.focus();
    expect(document.activeElement).to.equal(button);
  });
});
