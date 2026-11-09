import { fixture, expect, html, oneEvent, aTimeout, waitUntil } from '@open-wc/testing';
import '../index.js';

const popoverOf = el => el.shadowRoot.querySelector('[popover]');
const isShown = el => popoverOf(el).matches(':popover-open');
const liveOf = el => el.shadowRoot.querySelector('.ac-toast-basic__live');
const closeButtonOf = el => el.shadowRoot.querySelector('[part="close"]');
const offsetOf = el => el.style.getPropertyValue('--ac-toast-offset');

const waitHidden = el => waitUntil(() => !isShown(el), 'the toast should hide', { timeout: 3000 });

const collectEvents = (el, name) => {
  const events = [];
  el.addEventListener(name, event => events.push(event));
  return events;
};

suite('ac-toast-basic', () => {
  test('renders a popover element', async () => {
    const el = await fixture(html`<ac-toast-basic></ac-toast-basic>`);
    expect(popoverOf(el)).to.exist;
  });

  test('is hidden by default', async () => {
    const el = await fixture(html`<ac-toast-basic></ac-toast-basic>`);
    expect(isShown(el)).to.be.false;
  });

  test('defaults to duration=4000, position="bottom" and ambient="neutral"', async () => {
    const el = await fixture(html`<ac-toast-basic></ac-toast-basic>`);
    expect([el.duration, el.position, el.ambient]).to.deep.equal([4000, 'bottom', 'neutral']);
  });

  test('shows the toast when `open` is set', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0"></ac-toast-basic>`);
    el.open = true;
    await el.updateComplete;
    expect(isShown(el)).to.be.true;
  });

  test('shows the toast when `open` is present at creation', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0" open></ac-toast-basic>`);
    expect(isShown(el)).to.be.true;
  });

  test('reflects open onto the host attribute', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0" open></ac-toast-basic>`);
    expect(el.hasAttribute('open')).to.be.true;
  });

  test('show() shows the toast', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0"></ac-toast-basic>`);
    el.show();
    await el.updateComplete;
    expect(isShown(el)).to.be.true;
  });

  test('hide() hides the toast after the exit animation', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0" open></ac-toast-basic>`);
    el.hide();
    await waitHidden(el);
    expect(isShown(el)).to.be.false;
  });

  test('marks the toast as closing while the exit animation runs', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0" open></ac-toast-basic>`);
    el.hide();
    await el.updateComplete;
    expect(popoverOf(el).classList.contains('ac-toast-basic--closing')).to.be.true;
  });

  test('stays visible when it is shown again during the exit animation', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0" open></ac-toast-basic>`);
    el.hide();
    await el.updateComplete;
    el.show();
    await el.updateComplete;
    await aTimeout(800);
    expect(isShown(el)).to.be.true;
  });

  test('renders the `message` property', async () => {
    const el = await fixture(html`<ac-toast-basic message="Hola"></ac-toast-basic>`);
    expect(el.shadowRoot.querySelector('[part="message"]').textContent.trim()).to.equal('Hola');
  });

  test('renders slotted content when there is no `message`', async () => {
    const el = await fixture(html`<ac-toast-basic><b>Contenido</b></ac-toast-basic>`);
    expect(el.querySelector('b').assignedSlot).to.exist;
  });

  test('translates the message when it is a locale key', async () => {
    const el = await fixture(html`<ac-toast-basic message="toast-basic-saved"></ac-toast-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="message"]').textContent.trim()).to.equal(
      'Changes saved',
    );
  });

  test('applies the ambient class', async () => {
    const el = await fixture(html`<ac-toast-basic ambient="success"></ac-toast-basic>`);
    expect(popoverOf(el).classList.contains('ac-toast--success')).to.be.true;
  });

  test('falls back to neutral for an unknown ambient', async () => {
    const el = await fixture(html`<ac-toast-basic ambient="primary"></ac-toast-basic>`);
    expect(popoverOf(el).classList.contains('ac-toast--neutral')).to.be.true;
  });

  test('reflects the position onto the host attribute', async () => {
    const el = await fixture(html`<ac-toast-basic position="top"></ac-toast-basic>`);
    expect(el.getAttribute('position')).to.equal('top');
  });

  test('announces the message from a polite live region', async () => {
    const el = await fixture(
      html`<ac-toast-basic duration="0" open message="Hola"></ac-toast-basic>`,
    );
    expect([liveOf(el).getAttribute('role'), liveOf(el).textContent.trim()]).to.deep.equal([
      'status',
      'Hola',
    ]);
  });

  test('announces a danger toast as an alert', async () => {
    const el = await fixture(
      html`<ac-toast-basic duration="0" open ambient="danger" message="Error"></ac-toast-basic>`,
    );
    expect(liveOf(el).getAttribute('role')).to.equal('alert');
  });

  test('keeps the live region empty while closed', async () => {
    const el = await fixture(html`<ac-toast-basic message="Hola"></ac-toast-basic>`);
    expect(liveOf(el).textContent.trim()).to.equal('');
  });

  test('hides the visual message from assistive technology', async () => {
    const el = await fixture(html`<ac-toast-basic message="Hola"></ac-toast-basic>`);
    expect(el.shadowRoot.querySelector('[part="message"]').getAttribute('aria-hidden')).to.equal(
      'true',
    );
  });

  test('renders a translated close button', async () => {
    const el = await fixture(html`<ac-toast-basic></ac-toast-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(closeButtonOf(el).getAttribute('aria-label')).to.equal('Dismiss notification');
  });

  test('hides the close button with `hide-close`', async () => {
    const el = await fixture(html`<ac-toast-basic hide-close></ac-toast-basic>`);
    expect(closeButtonOf(el)).to.not.exist;
  });

  test('does not render an action button without `action-text`', async () => {
    const el = await fixture(html`<ac-toast-basic></ac-toast-basic>`);
    expect(el.shadowRoot.querySelector('[part="action"]')).to.not.exist;
  });

  test('renders a translated action button', async () => {
    const el = await fixture(
      html`<ac-toast-basic action-text="toast-basic-undo"></ac-toast-basic>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="action"]').textContent.trim()).to.equal('Undo');
  });
});

suite('ac-toast-basic: auto close', () => {
  test('closes by itself after `duration`', async () => {
    const el = await fixture(html`<ac-toast-basic duration="150" open></ac-toast-basic>`);
    await waitHidden(el);
    expect(el.open).to.be.false;
  });

  test('does not close by itself when duration is 0', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0" open></ac-toast-basic>`);
    await aTimeout(500);
    expect(el.open).to.be.true;
  });

  test('pauses the timer while the pointer is over the toast', async () => {
    const el = await fixture(html`<ac-toast-basic duration="150" open></ac-toast-basic>`);
    popoverOf(el).dispatchEvent(new PointerEvent('pointerenter'));
    await aTimeout(500);
    expect(el.open).to.be.true;
  });

  test('resumes the timer when the pointer leaves', async () => {
    const el = await fixture(html`<ac-toast-basic duration="150" open></ac-toast-basic>`);
    popoverOf(el).dispatchEvent(new PointerEvent('pointerenter'));
    await aTimeout(300);
    popoverOf(el).dispatchEvent(new PointerEvent('pointerleave'));
    await waitUntil(() => !el.open, 'the toast should close after resuming', { timeout: 3000 });
    expect(el.open).to.be.false;
  });

  test('pauses the timer while the focus is inside the toast', async () => {
    const el = await fixture(html`<ac-toast-basic duration="150" open></ac-toast-basic>`);
    popoverOf(el).dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await aTimeout(500);
    expect(el.open).to.be.true;
  });
});

suite('ac-toast-basic: events', () => {
  test('dispatches ac-toast-basic-show when it opens', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0"></ac-toast-basic>`);
    setTimeout(() => {
      el.open = true;
    });
    const event = await oneEvent(el, 'ac-toast-basic-show');
    expect(event.detail).to.be.true;
  });

  test('does not dispatch ac-toast-basic-show for its initial open state', async () => {
    const host = await fixture(html`<div></div>`);
    let dispatched = false;
    host.addEventListener('ac-toast-basic-show', () => {
      dispatched = true;
    });
    const el = document.createElement('ac-toast-basic');
    el.setAttribute('duration', '0');
    el.setAttribute('open', '');
    host.appendChild(el);
    await el.updateComplete;
    await aTimeout(0);
    expect(dispatched).to.be.false;
  });

  test('dispatches ac-toast-basic-close with reason "timeout"', async () => {
    const el = await fixture(html`<ac-toast-basic duration="150" open></ac-toast-basic>`);
    const event = await oneEvent(el, 'ac-toast-basic-close');
    expect(event.detail).to.deep.equal({ reason: 'timeout' });
  });

  test('dispatches ac-toast-basic-close with reason "api" for hide()', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0" open></ac-toast-basic>`);
    setTimeout(() => el.hide());
    const event = await oneEvent(el, 'ac-toast-basic-close');
    expect(event.detail).to.deep.equal({ reason: 'api' });
  });

  test('dispatches ac-toast-basic-close-click when the close button is clicked', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0" open></ac-toast-basic>`);
    const clicks = collectEvents(el, 'ac-toast-basic-close-click');
    closeButtonOf(el).click();
    await waitHidden(el);
    expect(clicks.length).to.equal(1);
  });

  test('closes with reason "close-button" when the close button is clicked', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0" open></ac-toast-basic>`);
    setTimeout(() => closeButtonOf(el).click());
    const event = await oneEvent(el, 'ac-toast-basic-close');
    expect(event.detail).to.deep.equal({ reason: 'close-button' });
  });

  test('dispatches ac-toast-basic-action-click without closing the toast', async () => {
    const el = await fixture(
      html`<ac-toast-basic duration="0" open action-text="Deshacer"></ac-toast-basic>`,
    );
    setTimeout(() => el.shadowRoot.querySelector('[part="action"]').click());
    await oneEvent(el, 'ac-toast-basic-action-click');
    expect(el.open).to.be.true;
  });

  test('toast events bubble and are composed', async () => {
    const el = await fixture(html`<ac-toast-basic duration="0" open></ac-toast-basic>`);
    setTimeout(() => closeButtonOf(el).click());
    const event = await oneEvent(el, 'ac-toast-basic-close-click');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });
});

suite('ac-toast-basic: stack', () => {
  const renderPair = (positionA = 'bottom', positionB = 'bottom') =>
    fixture(html`
      <div>
        <ac-toast-basic duration="0" position=${positionA} message="Uno"></ac-toast-basic>
        <ac-toast-basic duration="0" position=${positionB} message="Dos"></ac-toast-basic>
      </div>
    `);

  const showBoth = async container => {
    const [first, second] = container.querySelectorAll('ac-toast-basic');
    first.show();
    await first.updateComplete;
    second.show();
    await second.updateComplete;
    return [first, second];
  };

  test('does not offset the first toast', async () => {
    const [first] = await showBoth(await renderPair());
    expect(offsetOf(first)).to.equal('0px');
  });

  test('offsets a second toast opened in the same position', async () => {
    const [, second] = await showBoth(await renderPair());
    expect(parseFloat(offsetOf(second))).to.be.greaterThan(0);
  });

  test('does not offset a toast opened in another position', async () => {
    const [, second] = await showBoth(await renderPair('bottom', 'top'));
    expect(offsetOf(second)).to.equal('0px');
  });

  test('moves the second toast back when the first one closes', async () => {
    const [first, second] = await showBoth(await renderPair());
    first.hide();
    await first.updateComplete;
    expect(offsetOf(second)).to.equal('0px');
  });

  test('leaves the stack when the toast is removed from the DOM', async () => {
    const container = await renderPair();
    const [first, second] = await showBoth(container);
    first.remove();
    await second.updateComplete;
    // Un tercer toast ya no cuenta al que se quitó del DOM.
    const third = document.createElement('ac-toast-basic');
    third.setAttribute('duration', '0');
    container.appendChild(third);
    third.show();
    await third.updateComplete;
    expect(parseFloat(offsetOf(third))).to.be.closeTo(second._height + 8, 1);
  });
});
