import { fixture, expect, html, aTimeout } from '@open-wc/testing';
import '../index.js';

suite('ac-divider-basic', () => {
  test('defaults to orientation="horizontal"', async () => {
    const el = await fixture(html`<ac-divider-basic></ac-divider-basic>`);
    expect(el.orientation).to.equal('horizontal');
  });

  test('falls back to "horizontal" for an invalid orientation', async () => {
    const el = await fixture(html`<ac-divider-basic orientation="diagonal"></ac-divider-basic>`);
    expect(el._orientation).to.equal('horizontal');
  });

  test('renders role="separator" on the root element', async () => {
    const el = await fixture(html`<ac-divider-basic></ac-divider-basic>`);
    const root = el.shadowRoot.querySelector('[part="root"]');
    expect(root.getAttribute('role')).to.equal('separator');
  });

  test('aria-orientation reflects the current orientation', async () => {
    const el = await fixture(html`<ac-divider-basic orientation="vertical"></ac-divider-basic>`);
    const root = el.shadowRoot.querySelector('[part="root"]');
    expect(root.getAttribute('aria-orientation')).to.equal('vertical');
  });

  test('without slotted content, the label wrapper is not shown', async () => {
    const el = await fixture(html`<ac-divider-basic></ac-divider-basic>`);
    await aTimeout(0);
    const root = el.shadowRoot.querySelector('[part="root"]');
    expect(root.classList.contains('ac-divider-basic--with-label')).to.be.false;
  });

  test('with slotted content, the label wrapper is shown', async () => {
    const el = await fixture(html`<ac-divider-basic>o</ac-divider-basic>`);
    await aTimeout(0);
    const root = el.shadowRoot.querySelector('[part="root"]');
    expect(root.classList.contains('ac-divider-basic--with-label')).to.be.true;
  });
});
