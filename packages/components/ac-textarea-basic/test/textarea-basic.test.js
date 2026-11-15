import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

const textareaOf = el => el.shadowRoot.querySelector('textarea');

suite('ac-textarea-basic', () => {
  test('renders an internal <textarea>', async () => {
    const el = await fixture(html`<ac-textarea-basic></ac-textarea-basic>`);
    expect(textareaOf(el)).to.exist;
  });

  test('defaults rows to 4', async () => {
    const el = await fixture(html`<ac-textarea-basic></ac-textarea-basic>`);
    expect(textareaOf(el).rows).to.equal(4);
  });

  test('applies a custom rows value', async () => {
    const el = await fixture(html`<ac-textarea-basic rows="8"></ac-textarea-basic>`);
    expect(textareaOf(el).rows).to.equal(8);
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-textarea-basic></ac-textarea-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('applies the ambient class', async () => {
    const el = await fixture(html`<ac-textarea-basic ambient="secondary"></ac-textarea-basic>`);
    expect(
      el.shadowRoot
        .querySelector('.ac-textarea-basic')
        .classList.contains('ac-textarea--secondary'),
    ).to.be.true;
  });

  test('does not render a label without `label`', async () => {
    const el = await fixture(html`<ac-textarea-basic></ac-textarea-basic>`);
    expect(el.shadowRoot.querySelector('label')).to.not.exist;
  });

  test('renders the label text', async () => {
    const el = await fixture(html`<ac-textarea-basic label="Comentario"></ac-textarea-basic>`);
    expect(el.shadowRoot.querySelector('label').textContent.trim()).to.equal('Comentario');
  });

  test('associates the label with the textarea', async () => {
    const el = await fixture(html`<ac-textarea-basic label="Comentario"></ac-textarea-basic>`);
    expect(el.shadowRoot.querySelector('label').getAttribute('for')).to.equal(textareaOf(el).id);
  });

  test('marks a required field visually without exposing the asterisk', async () => {
    const el = await fixture(
      html`<ac-textarea-basic label="Comentario" required></ac-textarea-basic>`,
    );
    expect(
      el.shadowRoot.querySelector('.ac-textarea-basic__required').getAttribute('aria-hidden'),
    ).to.equal('true');
  });

  test('sets required on the internal textarea', async () => {
    const el = await fixture(html`<ac-textarea-basic required></ac-textarea-basic>`);
    expect(textareaOf(el).required).to.be.true;
  });

  test('uses a11y-label as aria-label when there is no visible label', async () => {
    const el = await fixture(html`<ac-textarea-basic a11y-label="Mensaje"></ac-textarea-basic>`);
    expect(textareaOf(el).getAttribute('aria-label')).to.equal('Mensaje');
  });

  test('does not set aria-label when a visible label exists', async () => {
    const el = await fixture(
      html`<ac-textarea-basic label="Comentario" a11y-label="Mensaje"></ac-textarea-basic>`,
    );
    expect(textareaOf(el).hasAttribute('aria-label')).to.be.false;
  });

  test('sets the value on the internal textarea', async () => {
    const el = await fixture(html`<ac-textarea-basic value="Hola"></ac-textarea-basic>`);
    expect(textareaOf(el).value).to.equal('Hola');
  });

  test('sets name on the internal textarea', async () => {
    const el = await fixture(html`<ac-textarea-basic name="bio"></ac-textarea-basic>`);
    expect(textareaOf(el).getAttribute('name')).to.equal('bio');
  });

  test('disables the internal textarea when disabled', async () => {
    const el = await fixture(html`<ac-textarea-basic disabled></ac-textarea-basic>`);
    expect(textareaOf(el).disabled).to.be.true;
  });

  test('sets readonly on the internal textarea', async () => {
    const el = await fixture(html`<ac-textarea-basic readonly></ac-textarea-basic>`);
    expect(textareaOf(el).readOnly).to.be.true;
  });

  test('renders the hint', async () => {
    const el = await fixture(html`<ac-textarea-basic hint="Una ayuda"></ac-textarea-basic>`);
    expect(el.shadowRoot.querySelector('#message').textContent.trim()).to.equal('Una ayuda');
  });

  test('describes the textarea by the hint', async () => {
    const el = await fixture(html`<ac-textarea-basic hint="Una ayuda"></ac-textarea-basic>`);
    expect(textareaOf(el).getAttribute('aria-describedby')).to.equal('message');
  });

  test('does not describe the textarea without hint or error', async () => {
    const el = await fixture(html`<ac-textarea-basic></ac-textarea-basic>`);
    expect(textareaOf(el).hasAttribute('aria-describedby')).to.be.false;
  });

  test('is not invalid by default', async () => {
    const el = await fixture(html`<ac-textarea-basic></ac-textarea-basic>`);
    expect(textareaOf(el).getAttribute('aria-invalid')).to.equal('false');
  });

  test('marks the textarea invalid when there is an error', async () => {
    const el = await fixture(html`<ac-textarea-basic error="Falta"></ac-textarea-basic>`);
    expect(textareaOf(el).getAttribute('aria-invalid')).to.equal('true');
  });

  test('announces the error with role="alert"', async () => {
    const el = await fixture(html`<ac-textarea-basic error="Falta"></ac-textarea-basic>`);
    expect(el.shadowRoot.querySelector('#message').getAttribute('role')).to.equal('alert');
  });

  test('shows the error instead of the hint', async () => {
    const el = await fixture(
      html`<ac-textarea-basic hint="Ayuda" error="Falta"></ac-textarea-basic>`,
    );
    expect(el.shadowRoot.querySelector('#message').textContent.trim()).to.equal('Falta');
  });

  test('updates `value` as the user types', async () => {
    const el = await fixture(html`<ac-textarea-basic></ac-textarea-basic>`);
    textareaOf(el).value = 'hola';
    textareaOf(el).dispatchEvent(new Event('input'));
    expect(el.value).to.equal('hola');
  });

  test('dispatches ac-textarea-basic-input with the value', async () => {
    const el = await fixture(html`<ac-textarea-basic></ac-textarea-basic>`);
    setTimeout(() => {
      textareaOf(el).value = 'hola';
      textareaOf(el).dispatchEvent(new Event('input'));
    });
    const event = await oneEvent(el, 'ac-textarea-basic-input');
    expect(event.detail).to.deep.equal({ value: 'hola' });
  });

  test('dispatches ac-textarea-basic-change with the value', async () => {
    const el = await fixture(html`<ac-textarea-basic></ac-textarea-basic>`);
    setTimeout(() => {
      textareaOf(el).value = 'hola';
      textareaOf(el).dispatchEvent(new Event('change'));
    });
    const event = await oneEvent(el, 'ac-textarea-basic-change');
    expect(event.detail).to.deep.equal({ value: 'hola' });
  });

  test('ac-textarea-basic-input bubbles and is composed', async () => {
    const el = await fixture(html`<ac-textarea-basic></ac-textarea-basic>`);
    setTimeout(() => textareaOf(el).dispatchEvent(new Event('input')));
    const event = await oneEvent(el, 'ac-textarea-basic-input');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });

  test('focus() moves the focus to the internal textarea', async () => {
    const el = await fixture(html`<ac-textarea-basic></ac-textarea-basic>`);
    el.focus();
    expect(el.shadowRoot.activeElement).to.equal(textareaOf(el));
  });
});
