import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';
import { addTextTranslations } from '../index.js';

suite('ac-text-basic', () => {
  test('renders slotted content by default', async () => {
    const el = await fixture(html`<ac-text-basic>Hola</ac-text-basic>`);
    expect(el.textContent.trim()).to.equal('Hola');
  });

  test('defaults to ambient="default"', async () => {
    const el = await fixture(html`<ac-text-basic></ac-text-basic>`);
    expect(el.ambient).to.equal('default');
  });

  test('defaults to a <span>', async () => {
    const el = await fixture(html`<ac-text-basic>Hola</ac-text-basic>`);
    expect(el.shadowRoot.querySelector('[part="root"]').tagName).to.equal('SPAN');
  });

  test('renders the element given in `tag`', async () => {
    const el = await fixture(html`<ac-text-basic tag="h2">Título</ac-text-basic>`);
    expect(el.shadowRoot.querySelector('[part="root"]').tagName).to.equal('H2');
  });

  test('falls back to <span> for a tag outside the allow-list', async () => {
    const el = await fixture(html`<ac-text-basic tag="script">x</ac-text-basic>`);
    expect(el.shadowRoot.querySelector('[part="root"]').tagName).to.equal('SPAN');
  });

  test('defaults to size="md"', async () => {
    const el = await fixture(html`<ac-text-basic></ac-text-basic>`);
    expect(el.size).to.equal('md');
  });

  test('applies the size class', async () => {
    const el = await fixture(html`<ac-text-basic size="lg">x</ac-text-basic>`);
    expect(el.shadowRoot.querySelector('[part="root"]').classList.contains('ac-text--lg')).to.be
      .true;
  });

  test('falls back to the md size for an unknown size', async () => {
    const el = await fixture(html`<ac-text-basic size="huge">x</ac-text-basic>`);
    expect(el.shadowRoot.querySelector('[part="root"]').classList.contains('ac-text--md')).to.be
      .true;
  });

  test('applies the ambient class', async () => {
    const el = await fixture(html`<ac-text-basic ambient="primary">x</ac-text-basic>`);
    expect(el.shadowRoot.querySelector('[part="root"]').classList.contains('ac-text--primary')).to
      .be.true;
  });

  test('translates a key from the component locales.json', async () => {
    const el = await fixture(html`<ac-text-basic text="text-basic-label"></ac-text-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal('Hello');
  });

  test('re-translates when the locale changes', async () => {
    const el = await fixture(html`<ac-text-basic text="text-basic-label"></ac-text-basic>`);
    el.locale = 'es-PE';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal('Hola');
  });

  test('shows the literal when there is no translation for the key', async () => {
    const el = await fixture(html`<ac-text-basic text="Sin traducción"></ac-text-basic>`);
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal(
      'Sin traducción',
    );
  });

  test('translates with the `translations` property', async () => {
    const el = await fixture(html`<ac-text-basic text="prop-key"></ac-text-basic>`);
    el.locale = 'en-EN';
    el.translations = { 'en-EN': { 'prop-key': 'From prop' } };
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal('From prop');
  });

  test('translates with the app-level translations', async () => {
    addTextTranslations({ 'en-EN': { 'app-key': 'From app' } });
    const el = await fixture(html`<ac-text-basic text="app-key"></ac-text-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal('From app');
  });

  test('updates mounted instances when app-level translations are added', async () => {
    const el = await fixture(html`<ac-text-basic text="late-key"></ac-text-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    addTextTranslations({ 'en-EN': { 'late-key': 'Added later' } });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal('Added later');
  });

  test('prefers the `translations` property over app-level translations', async () => {
    addTextTranslations({ 'en-EN': { 'both-key': 'From app' } });
    const el = await fixture(html`<ac-text-basic text="both-key"></ac-text-basic>`);
    el.locale = 'en-EN';
    el.translations = { 'en-EN': { 'both-key': 'From prop' } };
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal('From prop');
  });

  test('interpolates `params` into the translation', async () => {
    addTextTranslations({ 'en-EN': { 'hello-key': 'Hello, {name}' } });
    const el = await fixture(html`<ac-text-basic text="hello-key"></ac-text-basic>`);
    el.locale = 'en-EN';
    el.params = { name: 'Renzo' };
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal(
      'Hello, Renzo',
    );
  });

  test('interpolates `params` set through the attribute as JSON', async () => {
    addTextTranslations({ 'en-EN': { 'count-key': '{count} items' } });
    const el = await fixture(
      html`<ac-text-basic text="count-key" params='{"count":3}'></ac-text-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="root"]').textContent.trim()).to.equal('3 items');
  });
});
