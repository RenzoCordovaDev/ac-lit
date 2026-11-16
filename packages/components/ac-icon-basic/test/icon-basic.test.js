import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

const svgOf = el => el.shadowRoot.querySelector('svg');

suite('ac-icon-basic', () => {
  test('renders the path of a known icon name', async () => {
    const el = await fixture(html`<ac-icon-basic name="check"></ac-icon-basic>`);
    expect(svgOf(el).querySelector('path').getAttribute('d')).to.equal('M5 13l4 4L19 7');
  });

  test('falls back to a simple circle with an unknown name', async () => {
    const el = await fixture(html`<ac-icon-basic name="nombre-inexistente"></ac-icon-basic>`);
    expect(svgOf(el).querySelector('circle')).to.exist;
  });

  test('defaults size to "md"', async () => {
    const el = await fixture(html`<ac-icon-basic></ac-icon-basic>`);
    expect(el._size).to.equal('md');
  });

  test('falls back to "md" with an invalid size', async () => {
    const el = await fixture(html`<ac-icon-basic size="huge"></ac-icon-basic>`);
    expect(el._size).to.equal('md');
  });

  test('is aria-hidden when `a11yLabel` is empty (decorative by default)', async () => {
    const el = await fixture(html`<ac-icon-basic name="check"></ac-icon-basic>`);
    expect(svgOf(el).getAttribute('aria-hidden')).to.equal('true');
  });

  test('gets role="img" when `a11yLabel` is set', async () => {
    const el = await fixture(
      html`<ac-icon-basic name="check" a11y-label="Completado"></ac-icon-basic>`,
    );
    expect(svgOf(el).getAttribute('role')).to.equal('img');
  });

  test('gets aria-label from `a11yLabel` when set', async () => {
    const el = await fixture(
      html`<ac-icon-basic name="check" a11y-label="Completado"></ac-icon-basic>`,
    );
    expect(svgOf(el).getAttribute('aria-label')).to.equal('Completado');
  });

  test('is not aria-hidden when `a11yLabel` is set', async () => {
    const el = await fixture(
      html`<ac-icon-basic name="check" a11y-label="Completado"></ac-icon-basic>`,
    );
    expect(svgOf(el).hasAttribute('aria-hidden')).to.be.false;
  });
});
