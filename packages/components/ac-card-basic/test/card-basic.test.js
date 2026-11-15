import { fixture, expect, html, aTimeout } from '@open-wc/testing';
import '../index.js';

const footerOf = el => el.shadowRoot.querySelector('[part="footer"]');
const headerOf = el => el.shadowRoot.querySelector('[part="header"]');

suite('ac-card-basic', () => {
  test('renders slotted content by default', async () => {
    const el = await fixture(html`<ac-card-basic>Hola</ac-card-basic>`);
    expect(el.textContent.trim()).to.equal('Hola');
  });

  test('defaults ambient to "surface"', async () => {
    const el = await fixture(html`<ac-card-basic></ac-card-basic>`);
    expect(el.ambient).to.equal('surface');
  });

  test('falls back to "surface" with an invalid ambient', async () => {
    const el = await fixture(html`<ac-card-basic ambient="not-a-real-ambient"></ac-card-basic>`);
    expect(el._ambient).to.equal('surface');
  });

  test('does not render a header without headerText', async () => {
    const el = await fixture(html`<ac-card-basic></ac-card-basic>`);
    expect(headerOf(el)).to.not.exist;
  });

  test('renders the translated headerText when set', async () => {
    const el = await fixture(html`<ac-card-basic header-text="Título"></ac-card-basic>`);
    expect(headerOf(el).textContent.trim()).to.equal('Título');
  });

  test('hides the footer when its slot has no content', async () => {
    const el = await fixture(html`<ac-card-basic>Hola</ac-card-basic>`);
    await aTimeout(0);
    expect(footerOf(el).classList.contains('ac-card-basic__footer--empty')).to.be.true;
  });

  test('shows the footer once its slot gets content', async () => {
    const el = await fixture(
      html`<ac-card-basic><button slot="footer">Ok</button></ac-card-basic>`,
    );
    await aTimeout(0);
    expect(footerOf(el).classList.contains('ac-card-basic__footer--empty')).to.be.false;
  });
});
