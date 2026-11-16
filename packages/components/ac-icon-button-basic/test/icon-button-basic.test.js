import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

suite('ac-icon-button-basic', () => {
  test('renders an internal <button> element', async () => {
    const el = await fixture(html`<ac-icon-button-basic name="close"></ac-icon-button-basic>`);
    expect(el.shadowRoot.querySelector('button')).to.exist;
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-icon-button-basic></ac-icon-button-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('defaults to size="md"', async () => {
    const el = await fixture(html`<ac-icon-button-basic></ac-icon-button-basic>`);
    expect(el.size).to.equal('md');
  });

  test('defaults to disabled=false', async () => {
    const el = await fixture(html`<ac-icon-button-basic></ac-icon-button-basic>`);
    expect(el.disabled).to.be.false;
  });

  test('uses `a11yLabel` as aria-label when it is set', async () => {
    const el = await fixture(
      html`<ac-icon-button-basic name="close" a11y-label="Cerrar"></ac-icon-button-basic>`,
    );
    const button = el.shadowRoot.querySelector('button');
    expect(button.getAttribute('aria-label')).to.equal('Cerrar');
  });

  test('falls back to `name` as aria-label when `a11yLabel` is empty', async () => {
    const el = await fixture(html`<ac-icon-button-basic name="close"></ac-icon-button-basic>`);
    const button = el.shadowRoot.querySelector('button');
    expect(button.getAttribute('aria-label')).to.equal('close');
  });

  test('applies the class for a valid `ambient`', async () => {
    const el = await fixture(html`<ac-icon-button-basic ambient="danger"></ac-icon-button-basic>`);
    const button = el.shadowRoot.querySelector('button');
    expect(button.getAttribute('class')).to.include('ac-icon-button--danger');
  });

  test('falls back to ambient="primary" when `ambient` is invalid', async () => {
    const el = await fixture(
      html`<ac-icon-button-basic ambient="not-a-real-ambient"></ac-icon-button-basic>`,
    );
    const button = el.shadowRoot.querySelector('button');
    expect(button.getAttribute('class')).to.include('ac-icon-button--primary');
  });

  test('falls back to size="md" when `size` is invalid', async () => {
    const el = await fixture(html`<ac-icon-button-basic size="xl"></ac-icon-button-basic>`);
    const icon = el.shadowRoot.querySelector('ac-icon-basic');
    expect(icon.getAttribute('size')).to.equal('md');
  });

  test('disables the internal <button> when `disabled` is set', async () => {
    const el = await fixture(html`<ac-icon-button-basic disabled></ac-icon-button-basic>`);
    const button = el.shadowRoot.querySelector('button');
    expect(button.disabled).to.be.true;
  });

  test('propagates `name` to the internal <ac-icon-basic>', async () => {
    const el = await fixture(html`<ac-icon-button-basic name="search"></ac-icon-button-basic>`);
    const icon = el.shadowRoot.querySelector('ac-icon-basic');
    expect(icon.getAttribute('name')).to.equal('search');
  });

  test('propagates `size` to the internal <ac-icon-basic>', async () => {
    const el = await fixture(html`<ac-icon-button-basic size="lg"></ac-icon-button-basic>`);
    const icon = el.shadowRoot.querySelector('ac-icon-basic');
    expect(icon.getAttribute('size')).to.equal('lg');
  });
});
