import { fixture, expect, html, oneEvent, aTimeout, waitUntil } from '@open-wc/testing';
import '../index.js';

const dialogOf = el => el.shadowRoot.querySelector('dialog');
const closeButtonOf = el => el.shadowRoot.querySelector('[part="close"]');
const buttonOf = (el, part) => el.shadowRoot.querySelector(`ac-button-basic[part="${part}"]`);

const waitClosed = el =>
  waitUntil(() => !dialogOf(el).open, 'the dialog should close', { timeout: 2000 });

const openModal = async (attributes = {}) => {
  const el = await fixture(html`<ac-modal-basic header="Título"></ac-modal-basic>`);
  for (const [name, value] of Object.entries(attributes)) {
    el.setAttribute(name, value === true ? '' : value);
  }
  el.open = true;
  await el.updateComplete;
  return el;
};

const collectEvents = (el, name) => {
  const events = [];
  el.addEventListener(name, event => events.push(event));
  return events;
};

suite('ac-modal-basic', () => {
  test('renders a native <dialog>', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    expect(dialogOf(el)).to.exist;
  });

  test('is closed by default', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    expect(dialogOf(el).open).to.be.false;
  });

  test('defaults to size="offset"', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    expect(el.size).to.equal('offset');
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('defaults to persistent=false', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    expect(el.persistent).to.be.false;
  });

  test('opens the dialog when `open` is set', async () => {
    const el = await openModal();
    expect(dialogOf(el).open).to.be.true;
  });

  test('opens the dialog when `open` is present at creation', async () => {
    const el = await fixture(html`<ac-modal-basic open></ac-modal-basic>`);
    expect(dialogOf(el).open).to.be.true;
  });

  test('reflects open onto the host attribute', async () => {
    const el = await openModal();
    expect(el.hasAttribute('open')).to.be.true;
  });

  test('show() opens the modal', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    el.show();
    await el.updateComplete;
    expect(dialogOf(el).open).to.be.true;
  });

  test('hide() closes the dialog after the exit animation', async () => {
    const el = await openModal();
    el.hide();
    await waitClosed(el);
    expect(dialogOf(el).open).to.be.false;
  });

  test('marks the dialog as closing while the exit animation runs', async () => {
    const el = await openModal();
    el.hide();
    await el.updateComplete;
    expect(dialogOf(el).classList.contains('ac-modal-basic--closing')).to.be.true;
  });

  test('removes the closing class once the dialog is closed', async () => {
    const el = await openModal();
    el.hide();
    await waitClosed(el);
    expect(dialogOf(el).classList.contains('ac-modal-basic--closing')).to.be.false;
  });

  test('stays open when it is reopened during the exit animation', async () => {
    const el = await openModal();
    el.hide();
    await el.updateComplete;
    el.show();
    await el.updateComplete;
    await aTimeout(800);
    expect(dialogOf(el).open).to.be.true;
  });

  test('uses a default translated title without `header`', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal('Título');
  });

  test('translates the default title with the active locale', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal('Title');
  });

  test('renders the `header` property as the title', async () => {
    const el = await fixture(html`<ac-modal-basic header="Mi título"></ac-modal-basic>`);
    expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal('Mi título');
  });

  test('names the dialog after its title', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    expect(dialogOf(el).getAttribute('aria-labelledby')).to.equal(
      el.shadowRoot.querySelector('h2').id,
    );
  });

  test('renders slotted content in the body', async () => {
    const el = await fixture(html`<ac-modal-basic><p>Contenido</p></ac-modal-basic>`);
    expect(el.querySelector('p').assignedSlot).to.exist;
  });

  test('makes the body a focusable labelled region', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    const body = el.shadowRoot.querySelector('[part="body"]');
    expect([body.getAttribute('role'), body.tabIndex]).to.deep.equal(['region', 0]);
  });

  test('renders a translated close button', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(closeButtonOf(el).getAttribute('aria-label')).to.equal('Close');
  });

  test('hides the close button with `hide-close`', async () => {
    const el = await fixture(html`<ac-modal-basic hide-close></ac-modal-basic>`);
    expect(closeButtonOf(el)).to.not.exist;
  });

  test('does not render a footer without footer properties', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    expect(el.shadowRoot.querySelector('footer')).to.not.exist;
  });

  test('renders a footer when a primary text is set', async () => {
    const el = await fixture(html`<ac-modal-basic primary-text="Guardar"></ac-modal-basic>`);
    expect(el.shadowRoot.querySelector('footer')).to.exist;
  });

  test('renders the primary button with its text', async () => {
    const el = await fixture(html`<ac-modal-basic primary-text="Guardar"></ac-modal-basic>`);
    expect(buttonOf(el, 'primary').getAttribute('text')).to.equal('Guardar');
  });

  test('translates the primary text when it is a locale key', async () => {
    const el = await fixture(
      html`<ac-modal-basic primary-text="modal-basic-accept"></ac-modal-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(buttonOf(el, 'primary').getAttribute('text')).to.equal('Accept');
  });

  test('uses the modal ambient on the primary button', async () => {
    const el = await fixture(
      html`<ac-modal-basic ambient="secondary" primary-text="Ok"></ac-modal-basic>`,
    );
    expect(buttonOf(el, 'primary').getAttribute('ambient')).to.equal('secondary');
  });

  test('renders the secondary button with the primary-alt ambient', async () => {
    const el = await fixture(html`<ac-modal-basic secondary-text="Cancelar"></ac-modal-basic>`);
    expect(buttonOf(el, 'secondary').getAttribute('ambient')).to.equal('primary-alt');
  });

  test('does not render buttons that have no text', async () => {
    const el = await fixture(html`<ac-modal-basic primary-text="Guardar"></ac-modal-basic>`);
    expect(buttonOf(el, 'secondary')).to.not.exist;
  });

  test('disables the primary button with `primary-disabled`', async () => {
    const el = await fixture(
      html`<ac-modal-basic primary-text="Guardar" primary-disabled></ac-modal-basic>`,
    );
    expect(buttonOf(el, 'primary').hasAttribute('disabled')).to.be.true;
  });

  test('disables the secondary button with `secondary-disabled`', async () => {
    const el = await fixture(
      html`<ac-modal-basic secondary-text="Cancelar" secondary-disabled></ac-modal-basic>`,
    );
    expect(buttonOf(el, 'secondary').hasAttribute('disabled')).to.be.true;
  });

  test('renders the link with its text and href', async () => {
    const el = await fixture(
      html`<ac-modal-basic link-text="Saber más" link-href="#more"></ac-modal-basic>`,
    );
    const link = el.shadowRoot.querySelector('ac-link-basic');
    expect([link.getAttribute('text'), link.getAttribute('href')]).to.deep.equal([
      'Saber más',
      '#more',
    ]);
  });
});

suite('ac-modal-basic: events', () => {
  test('dispatches ac-modal-basic-open when it opens', async () => {
    const el = await fixture(html`<ac-modal-basic></ac-modal-basic>`);
    setTimeout(() => {
      el.open = true;
    });
    const event = await oneEvent(el, 'ac-modal-basic-open');
    expect(event.detail).to.be.true;
  });

  test('does not dispatch ac-modal-basic-open for its initial open state', async () => {
    const host = await fixture(html`<div></div>`);
    let dispatched = false;
    host.addEventListener('ac-modal-basic-open', () => {
      dispatched = true;
    });
    const el = document.createElement('ac-modal-basic');
    el.setAttribute('open', '');
    host.appendChild(el);
    await el.updateComplete;
    await aTimeout(0);
    expect(dispatched).to.be.false;
  });

  test('dispatches ac-modal-basic-close with reason "api" for hide()', async () => {
    const el = await openModal();
    setTimeout(() => el.hide());
    const event = await oneEvent(el, 'ac-modal-basic-close');
    expect(event.detail).to.deep.equal({ reason: 'api' });
  });

  test('dispatches ac-modal-basic-close-click and closes with the close button', async () => {
    const el = await openModal();
    const clicks = collectEvents(el, 'ac-modal-basic-close-click');
    closeButtonOf(el).click();
    await waitClosed(el);
    expect(clicks.length).to.equal(1);
  });

  test('closes with reason "close-button" when the close button is clicked', async () => {
    const el = await openModal();
    setTimeout(() => closeButtonOf(el).click());
    const event = await oneEvent(el, 'ac-modal-basic-close');
    expect(event.detail).to.deep.equal({ reason: 'close-button' });
  });

  test('closes with reason "escape" on the cancel event', async () => {
    const el = await openModal();
    setTimeout(() => dialogOf(el).dispatchEvent(new Event('cancel', { cancelable: true })));
    const event = await oneEvent(el, 'ac-modal-basic-close');
    expect(event.detail).to.deep.equal({ reason: 'escape' });
  });

  test('prevents the native immediate close on the cancel event', async () => {
    const el = await openModal();
    const cancel = new Event('cancel', { cancelable: true });
    dialogOf(el).dispatchEvent(cancel);
    expect(cancel.defaultPrevented).to.be.true;
  });

  test('ignores the cancel event when persistent', async () => {
    const el = await openModal({ persistent: true });
    dialogOf(el).dispatchEvent(new Event('cancel', { cancelable: true }));
    await aTimeout(600);
    expect(dialogOf(el).open).to.be.true;
  });

  test('closes with reason "backdrop" when the dialog itself is clicked', async () => {
    const el = await openModal();
    setTimeout(() => dialogOf(el).click());
    const event = await oneEvent(el, 'ac-modal-basic-close');
    expect(event.detail).to.deep.equal({ reason: 'backdrop' });
  });

  test('does not close when the panel is clicked', async () => {
    const el = await openModal();
    el.shadowRoot.querySelector('.ac-modal-basic__panel').click();
    await aTimeout(600);
    expect(dialogOf(el).open).to.be.true;
  });

  test('ignores a backdrop click when persistent', async () => {
    const el = await openModal({ persistent: true });
    dialogOf(el).click();
    await aTimeout(600);
    expect(dialogOf(el).open).to.be.true;
  });

  test('syncs `open` when the browser closes the dialog by itself', async () => {
    const el = await openModal();
    dialogOf(el).close();
    await aTimeout(0);
    expect(el.open).to.be.false;
  });

  test('dispatches ac-modal-basic-close with reason "native" for a native close', async () => {
    const el = await openModal();
    setTimeout(() => dialogOf(el).close());
    const event = await oneEvent(el, 'ac-modal-basic-close');
    expect(event.detail).to.deep.equal({ reason: 'native' });
  });

  test('dispatches ac-modal-basic-primary-click when the primary button is clicked', async () => {
    const el = await openModal({ 'primary-text': 'Guardar' });
    setTimeout(() => buttonOf(el, 'primary').shadowRoot.querySelector('button').click());
    const event = await oneEvent(el, 'ac-modal-basic-primary-click');
    expect(event.detail).to.be.true;
  });

  test('dispatches ac-modal-basic-secondary-click when the secondary button is clicked', async () => {
    const el = await openModal({ 'secondary-text': 'Cancelar' });
    setTimeout(() => buttonOf(el, 'secondary').shadowRoot.querySelector('button').click());
    const event = await oneEvent(el, 'ac-modal-basic-secondary-click');
    expect(event.detail).to.be.true;
  });

  test('dispatches ac-modal-basic-link-click with the href', async () => {
    const el = await openModal({ 'link-text': 'Más', 'link-href': '#more' });
    setTimeout(() =>
      el.shadowRoot.querySelector('ac-link-basic').shadowRoot.querySelector('a').click(),
    );
    const event = await oneEvent(el, 'ac-modal-basic-link-click');
    expect(event.detail).to.deep.equal({ href: '#more' });
  });

  test('does not leak the inner ac-button-basic-click event', async () => {
    const el = await openModal({ 'primary-text': 'Guardar' });
    let leaked = false;
    document.addEventListener('ac-button-basic-click', () => (leaked = true), { once: true });
    buttonOf(el, 'primary').shadowRoot.querySelector('button').click();
    await aTimeout(0);
    expect(leaked).to.be.false;
  });

  test('modal events bubble and are composed', async () => {
    const el = await openModal();
    setTimeout(() => closeButtonOf(el).click());
    const event = await oneEvent(el, 'ac-modal-basic-close-click');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });
});
