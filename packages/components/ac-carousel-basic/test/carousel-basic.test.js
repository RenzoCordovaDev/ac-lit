import { aTimeout, fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

const changeEvent = 'ac-carousel-basic-change';
const autoplayDelay = 30;

async function carousel(initialIndex = 0) {
  const el = await fixture(html`
    <ac-carousel-basic .activeIndex=${initialIndex}>
      <ac-carousel-slide-basic>
        <button type="button">Ver detalles</button>
        <input aria-label="Buscar" />
      </ac-carousel-slide-basic>
      <ac-carousel-slide-basic>Segunda</ac-carousel-slide-basic>
      <ac-carousel-slide-basic>Tercera</ac-carousel-slide-basic>
    </ac-carousel-basic>
  `);
  await el.updateComplete;
  return el;
}

function part(el, name) {
  return el.shadowRoot.querySelector(`[part="${name}"]`);
}

function dots(el) {
  return [...el.shadowRoot.querySelectorAll('[part="dot"]')];
}

function activeSlides(el) {
  return Array.from(el.children, slide => slide.active);
}

function pressArrow(target, key) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, composed: true });
  target.dispatchEvent(event);
}

function swipe(el, deltaX, deltaY) {
  const viewport = part(el, 'viewport');
  const send = (type, clientX, clientY) => {
    viewport.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        composed: true,
        pointerType: 'touch',
        pointerId: 1,
        isPrimary: true,
        clientX,
        clientY,
      }),
    );
  };
  send('pointerdown', 120, 100);
  send('pointermove', 120 + deltaX, 100 + deltaY);
  send('pointerup', 120 + deltaX, 100 + deltaY);
}

function pointerBoundary(el, type) {
  part(el, 'root').dispatchEvent(new PointerEvent(type, { pointerType: 'mouse' }));
}

async function enableAutoplay(el) {
  el.autoplay = autoplayDelay;
  await el.updateComplete;
}

suite('ac-carousel-basic', () => {
  test('defaults to slide index 0', async () => {
    const el = await fixture(html`<ac-carousel-basic></ac-carousel-basic>`);
    expect(el.activeIndex).to.equal(0);
  });

  test('defaults to disabled autoplay', async () => {
    const el = await fixture(html`<ac-carousel-basic></ac-carousel-basic>`);
    expect(el.autoplay).to.equal(0);
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-carousel-basic></ac-carousel-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('reflects a new ambient as an attribute', async () => {
    const el = await carousel();
    el.ambient = 'secondary';
    await el.updateComplete;
    expect(el.getAttribute('ambient')).to.equal('secondary');
  });

  test('reflects activeIndex as active-index', async () => {
    const el = await carousel();
    el.activeIndex = 2;
    await el.updateComplete;
    expect(el.getAttribute('active-index')).to.equal('2');
  });

  test('reads a preselected index from markup', async () => {
    const el = await fixture(html`
      <ac-carousel-basic active-index="1">
        <ac-carousel-slide-basic>Primera</ac-carousel-slide-basic>
        <ac-carousel-slide-basic>Segunda</ac-carousel-slide-basic>
      </ac-carousel-basic>
    `);
    await el.updateComplete;
    expect(activeSlides(el)).to.deep.equal([false, true]);
  });

  test('marks only the initial slide active', async () => {
    const el = await carousel();
    expect(activeSlides(el)).to.deep.equal([true, false, false]);
  });

  test('updates child visibility when activeIndex is assigned', async () => {
    const el = await carousel();
    el.activeIndex = 2;
    await el.updateComplete;
    expect(activeSlides(el)).to.deep.equal([false, false, true]);
  });

  test('sets zero-based indexes on slotted slides', async () => {
    const el = await carousel();
    expect(Array.from(el.children, slide => slide.index)).to.deep.equal([0, 1, 2]);
  });

  test('sets the total number of slides on every slide', async () => {
    const el = await carousel();
    expect(Array.from(el.children, slide => slide.total)).to.deep.equal([3, 3, 3]);
  });

  test('keeps assigned slide metadata out of the attributes', async () => {
    const el = await carousel();
    expect(el.querySelector('[index], [total]')).to.be.null;
  });

  test('paginates only assigned carousel slides', async () => {
    const el = await carousel();
    el.append(document.createElement('div'));
    await aTimeout(0);
    expect(dots(el)).to.have.lengthOf(3);
  });

  test('renumbers slides inserted ahead of existing slides', async () => {
    const el = await carousel();
    el.prepend(document.createElement('ac-carousel-slide-basic'));
    await aTimeout(0);
    expect(Array.from(el.children, slide => slide.index)).to.deep.equal([0, 1, 2, 3]);
  });

  test('recalculates the total after removing a slide', async () => {
    const el = await carousel();
    el.lastElementChild.remove();
    await aTimeout(0);
    expect(Array.from(el.children, slide => slide.total)).to.deep.equal([2, 2]);
  });

  test('clamps the active index after removing the final selected slide', async () => {
    const el = await carousel(2);
    el.lastElementChild.remove();
    await aTimeout(0);
    expect(activeSlides(el)).to.deep.equal([false, true]);
  });

  test('clamps an index below the first slide', async () => {
    const el = await carousel();
    el.activeIndex = -1;
    await el.updateComplete;
    expect(el.activeIndex).to.equal(0);
  });

  test('falls back to index 0 for a fractional index', async () => {
    const el = await carousel(2);
    el.activeIndex = 1.5;
    await el.updateComplete;
    expect(el.activeIndex).to.equal(0);
  });

  test('exposes the carousel as a region', async () => {
    const el = await carousel();
    expect(part(el, 'root').getAttribute('role')).to.equal('region');
  });

  test('describes the region as a carousel', async () => {
    const el = await carousel();
    expect(part(el, 'root').getAttribute('aria-roledescription')).to.equal('carousel');
  });

  test('translates the accessible name of the region', async () => {
    const el = await carousel();
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(part(el, 'root').getAttribute('aria-label')).to.equal('Carousel');
  });

  test('translates the accessible name of a pagination button', async () => {
    const el = await carousel();
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(dots(el)[1].getAttribute('aria-label')).to.equal('Go to slide 2');
  });

  test('identifies the current slide in the pagination', async () => {
    const el = await carousel(1);
    expect(dots(el).map(dot => dot.getAttribute('aria-current'))).to.deep.equal([
      null,
      'true',
      null,
    ]);
  });

  test('omits navigation controls for a single slide', async () => {
    const el = await fixture(html`
      <ac-carousel-basic>
        <ac-carousel-slide-basic>Única</ac-carousel-slide-basic>
      </ac-carousel-basic>
    `);
    await el.updateComplete;
    expect(part(el, 'previous')).to.be.null;
  });

  test('wraps to the first slide with the next button', async () => {
    const el = await carousel(2);
    part(el, 'next').click();
    await el.updateComplete;
    expect(el.activeIndex).to.equal(0);
  });

  test('wraps to the final slide with the previous button', async () => {
    const el = await carousel();
    part(el, 'previous').click();
    await el.updateComplete;
    expect(el.activeIndex).to.equal(2);
  });

  test('emits a change with the new index when a pagination dot is clicked', async () => {
    const el = await carousel();
    const change = oneEvent(el, changeEvent);
    dots(el)[1].click();
    expect((await change).detail).to.deep.equal({ index: 1 });
  });

  test('bubbles a change event to an ancestor outside the carousel', async () => {
    const el = await carousel();
    const change = oneEvent(el.parentElement, changeEvent);
    part(el, 'next').click();
    expect((await change).target).to.equal(el);
  });

  test('emits a composed change event', async () => {
    const el = await carousel();
    const change = oneEvent(el, changeEvent);
    part(el, 'next').click();
    expect((await change).composed).to.be.true;
  });

  test('does not emit a change while initializing', async () => {
    const changes = [];
    await fixture(html`
      <ac-carousel-basic active-index="1" @ac-carousel-basic-change=${event => changes.push(event)}>
        <ac-carousel-slide-basic>Primera</ac-carousel-slide-basic>
        <ac-carousel-slide-basic>Segunda</ac-carousel-slide-basic>
      </ac-carousel-basic>
    `);
    await aTimeout(0);
    expect(changes).to.have.lengthOf(0);
  });

  test('does not emit a change on external activeIndex assignment', async () => {
    const el = await carousel();
    const changes = [];
    el.addEventListener(changeEvent, event => changes.push(event));
    el.activeIndex = 1;
    await el.updateComplete;
    expect(changes).to.have.lengthOf(0);
  });

  test('does not emit a change when clicking the current slide dot', async () => {
    const el = await carousel();
    const changes = [];
    el.addEventListener(changeEvent, event => changes.push(event));
    dots(el)[0].click();
    await el.updateComplete;
    expect(changes).to.have.lengthOf(0);
  });

  test('wraps backward with ArrowLeft when the region has focus', async () => {
    const el = await carousel();
    const root = part(el, 'root');
    root.focus();
    pressArrow(root, 'ArrowLeft');
    await el.updateComplete;
    expect(el.activeIndex).to.equal(2);
  });

  test('emits a change on ArrowRight from a focused slotted button', async () => {
    const el = await carousel();
    const button = el.querySelector('button');
    button.focus();
    const change = oneEvent(el, changeEvent);
    pressArrow(button, 'ArrowRight');
    expect((await change).detail).to.deep.equal({ index: 1 });
  });

  test('preserves arrow-key editing inside an input', async () => {
    const el = await carousel();
    const input = el.querySelector('input');
    input.focus();
    pressArrow(input, 'ArrowRight');
    await el.updateComplete;
    expect(el.activeIndex).to.equal(0);
  });

  test('advances and emits a change after a left swipe', async () => {
    const el = await carousel();
    const change = oneEvent(el, changeEvent);
    swipe(el, -60, 5);
    expect((await change).detail).to.deep.equal({ index: 1 });
  });

  test('moves to the previous slide after a right swipe', async () => {
    const el = await carousel(1);
    swipe(el, 60, 5);
    await el.updateComplete;
    expect(el.activeIndex).to.equal(0);
  });

  test('ignores a touch gesture below the swipe threshold', async () => {
    const el = await carousel();
    swipe(el, -15, 0);
    await el.updateComplete;
    expect(el.activeIndex).to.equal(0);
  });

  test('ignores a predominantly vertical touch gesture', async () => {
    const el = await carousel();
    swipe(el, -50, 70);
    await el.updateComplete;
    expect(el.activeIndex).to.equal(0);
  });

  test('advances on autoplay and emits the new index', async () => {
    const el = await carousel();
    const change = oneEvent(el, changeEvent);
    await enableAutoplay(el);
    expect((await change).detail).to.deep.equal({ index: 1 });
  });

  test('pauses autoplay while the pointer is over the carousel', async () => {
    const el = await carousel();
    const changes = [];
    el.addEventListener(changeEvent, event => changes.push(event));
    pointerBoundary(el, 'pointerenter');
    await enableAutoplay(el);
    await aTimeout(3 * autoplayDelay);
    expect(changes).to.have.lengthOf(0);
  });

  test('resumes autoplay after the pointer leaves the carousel', async () => {
    const el = await carousel();
    pointerBoundary(el, 'pointerenter');
    await enableAutoplay(el);
    await aTimeout(3 * autoplayDelay);
    const change = oneEvent(el, changeEvent);
    pointerBoundary(el, 'pointerleave');
    expect((await change).detail).to.deep.equal({ index: 1 });
  });

  test('pauses autoplay while a slotted button has focus', async () => {
    const el = await carousel();
    const changes = [];
    el.addEventListener(changeEvent, event => changes.push(event));
    el.querySelector('button').focus();
    await enableAutoplay(el);
    await aTimeout(3 * autoplayDelay);
    expect(changes).to.have.lengthOf(0);
  });

  test('resumes autoplay when focus leaves the carousel', async () => {
    const el = await carousel();
    const button = el.querySelector('button');
    button.focus();
    await enableAutoplay(el);
    await aTimeout(3 * autoplayDelay);
    const change = oneEvent(el, changeEvent);
    button.blur();
    expect((await change).detail).to.deep.equal({ index: 1 });
  });

  test('keeps autoplay paused after activating the rotation control', async () => {
    const el = await carousel();
    const changes = [];
    el.addEventListener(changeEvent, event => changes.push(event));
    await enableAutoplay(el);
    part(el, 'rotation').click();
    await aTimeout(3 * autoplayDelay);
    expect(changes).to.have.lengthOf(0);
  });

  test('stops autoplay when disconnected', async () => {
    const el = await carousel();
    const changes = [];
    el.addEventListener(changeEvent, event => changes.push(event));
    await enableAutoplay(el);
    el.remove();
    await aTimeout(3 * autoplayDelay);
    expect(changes).to.have.lengthOf(0);
  });
});
