import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

suite('ac-carousel-slide-basic', () => {
  test('renders slotted content', async () => {
    const el = await fixture(html`<ac-carousel-slide-basic>Hola</ac-carousel-slide-basic>`);
    expect(el.textContent.trim()).to.equal('Hola');
  });

  test('defaults to active=false', async () => {
    const el = await fixture(html`<ac-carousel-slide-basic></ac-carousel-slide-basic>`);
    expect(el.active).to.equal(false);
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-carousel-slide-basic></ac-carousel-slide-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('is hidden from layout when inactive', async () => {
    const el = await fixture(html`<ac-carousel-slide-basic></ac-carousel-slide-basic>`);
    expect(getComputedStyle(el).display).to.equal('none');
  });

  test('is visible when active', async () => {
    const el = await fixture(html`<ac-carousel-slide-basic active></ac-carousel-slide-basic>`);
    expect(getComputedStyle(el).display).to.equal('block');
  });

  test('reflects active as an attribute', async () => {
    const el = await fixture(html`<ac-carousel-slide-basic></ac-carousel-slide-basic>`);
    el.active = true;
    await el.updateComplete;
    expect(el.hasAttribute('active')).to.equal(true);
  });

  test('does not know its index/total until the parent assigns them', async () => {
    const el = await fixture(html`<ac-carousel-slide-basic></ac-carousel-slide-basic>`);
    expect(el.index).to.equal(0);
  });

  test('builds its aria-label from index/total assigned by the parent', async () => {
    const el = await fixture(html`<ac-carousel-slide-basic></ac-carousel-slide-basic>`);
    el.index = 1;
    el.total = 3;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').getAttribute('aria-label')).to.equal(
      'Diapositiva 2 de 3',
    );
  });

  test('translates its aria-label', async () => {
    const el = await fixture(
      html`<ac-carousel-slide-basic locale="en-EN"></ac-carousel-slide-basic>`,
    );
    expect(el.shadowRoot.querySelector('[part="root"]').getAttribute('aria-label')).to.equal(
      'Slide 1 of 1',
    );
  });
});
