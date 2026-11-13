import { fixture, expect, html, oneEvent, aTimeout, waitUntil } from '@open-wc/testing';
import '../index.js';

const dialogOf = el => el.shadowRoot.querySelector('dialog');
const backButtonOf = el => el.shadowRoot.querySelector('[part="back"]');

const waitClosed = el =>
  waitUntil(() => !dialogOf(el).open, 'the dialog should close', { timeout: 2000 });

const openContainer = async (attributes = {}) => {
  const el = await fixture(html`<ac-transition-container></ac-transition-container>`);
  for (const [name, value] of Object.entries(attributes)) {
    el.setAttribute(name, value === true ? '' : value);
  }
  el.visible = true;
  await el.updateComplete;
  return el;
};

const collectEvents = (el, name) => {
  const events = [];
  el.addEventListener(name, event => events.push(event));
  return events;
};

suite('ac-transition-container', () => {
  test('is not visible by default', async () => {
    const el = await fixture(html`<ac-transition-container></ac-transition-container>`);
    expect(el.visible).to.be.false;
  });

  test('defaults headerType to "first-level-initial"', async () => {
    const el = await fixture(html`<ac-transition-container></ac-transition-container>`);
    expect(el.headerType).to.equal('first-level-initial');
  });

  test('falls back to "first-level-initial" with an invalid headerType', async () => {
    const el = await fixture(
      html`<ac-transition-container header-type="not-a-real-type"></ac-transition-container>`,
    );
    expect(el.headerType).to.equal('first-level-initial');
  });

  test('show() makes the dialog visible', async () => {
    const el = await fixture(html`<ac-transition-container></ac-transition-container>`);
    el.show();
    await el.updateComplete;
    expect(dialogOf(el).open).to.be.true;
  });

  test('hide() closes the dialog after the exit animation', async () => {
    const el = await openContainer();
    el.hide();
    await waitClosed(el);
    expect(dialogOf(el).open).to.be.false;
  });

  test('does not render the back icon with "first-level-initial"', async () => {
    const el = await fixture(html`<ac-transition-container></ac-transition-container>`);
    expect(backButtonOf(el)).to.not.exist;
  });

  test('renders the back icon with "first-level-sequential"', async () => {
    const el = await fixture(
      html`<ac-transition-container
        header-type="first-level-sequential"
      ></ac-transition-container>`,
    );
    expect(backButtonOf(el)).to.exist;
  });

  test('clicking the back icon dispatches ac-transition-container-header-back-icon-click', async () => {
    const el = await openContainer({ 'header-type': 'first-level-sequential' });
    setTimeout(() => backButtonOf(el).click());
    const event = await oneEvent(el, 'ac-transition-container-header-back-icon-click');
    expect(event.detail).to.be.true;
  });

  test('clicking the back icon does not close the container', async () => {
    const el = await openContainer({ 'header-type': 'first-level-sequential' });
    backButtonOf(el).click();
    await aTimeout(0);
    expect(el.visible).to.be.true;
  });

  test('uses a default translated title without `header-text`', async () => {
    const el = await fixture(html`<ac-transition-container></ac-transition-container>`);
    expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal('Título');
  });

  test('renders the `header-text` property as the title', async () => {
    const el = await fixture(
      html`<ac-transition-container header-text="Mi título"></ac-transition-container>`,
    );
    expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal('Mi título');
  });

  test('renders slotted content in the body', async () => {
    const el = await fixture(
      html`<ac-transition-container><p>Contenido</p></ac-transition-container>`,
    );
    expect(el.querySelector('p').assignedSlot).to.exist;
  });
});

suite('ac-transition-container: events', () => {
  test('dispatches ac-transition-container-open when it becomes visible', async () => {
    const el = await fixture(html`<ac-transition-container></ac-transition-container>`);
    setTimeout(() => {
      el.visible = true;
    });
    const event = await oneEvent(el, 'ac-transition-container-open');
    expect(event.detail).to.be.true;
  });

  test('does not dispatch ac-transition-container-open for its initial visible state', async () => {
    const host = await fixture(html`<div></div>`);
    let dispatched = false;
    host.addEventListener('ac-transition-container-open', () => {
      dispatched = true;
    });
    const el = document.createElement('ac-transition-container');
    el.setAttribute('visible', '');
    host.appendChild(el);
    await el.updateComplete;
    await aTimeout(0);
    expect(dispatched).to.be.false;
  });

  test('dispatches ac-transition-container-close with reason "api" for hide()', async () => {
    const el = await openContainer();
    setTimeout(() => el.hide());
    const event = await oneEvent(el, 'ac-transition-container-close');
    expect(event.detail).to.deep.equal({ reason: 'api' });
  });

  test('closes with reason "escape" on the cancel event', async () => {
    const el = await openContainer();
    setTimeout(() => dialogOf(el).dispatchEvent(new Event('cancel', { cancelable: true })));
    const event = await oneEvent(el, 'ac-transition-container-close');
    expect(event.detail).to.deep.equal({ reason: 'escape' });
  });

  test('ignores the cancel event when persistent', async () => {
    const el = await openContainer({ persistent: true });
    dialogOf(el).dispatchEvent(new Event('cancel', { cancelable: true }));
    await aTimeout(600);
    expect(dialogOf(el).open).to.be.true;
  });

  test('syncs `visible` when the browser closes the dialog by itself', async () => {
    const el = await openContainer();
    dialogOf(el).close();
    await aTimeout(0);
    expect(el.visible).to.be.false;
  });

  test('container events bubble and are composed', async () => {
    const el = await openContainer({ 'header-type': 'first-level-sequential' });
    const clicks = collectEvents(el, 'ac-transition-container-header-back-icon-click');
    backButtonOf(el).click();
    await aTimeout(0);
    expect([clicks[0].bubbles, clicks[0].composed]).to.deep.equal([true, true]);
  });
});
