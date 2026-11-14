import { expect } from '@open-wc/testing';
import {
  dispatchCustomEvent,
  debounce,
  generateId,
  isInViewport,
  createFocusTrap,
} from './utils.js';

describe('dispatchCustomEvent', () => {
  it('dispatches a bubbling, composed CustomEvent with the given detail', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    let received;
    el.addEventListener('ac-test-event', e => (received = e));
    dispatchCustomEvent(el, 'ac-test-event', { foo: 'bar' });

    expect(received).to.exist;
    expect(received.detail).to.deep.equal({ foo: 'bar' });
    expect(received.bubbles).to.be.true;
    expect(received.composed).to.be.true;

    el.remove();
  });
});

describe('debounce', () => {
  it('only calls the wrapped function once after the wait period', done => {
    let calls = 0;
    const debounced = debounce(() => calls++, 10);

    debounced();
    debounced();
    debounced();

    setTimeout(() => {
      expect(calls).to.equal(1);
      done();
    }, 30);
  });
});

describe('generateId', () => {
  it('generates unique ids with the given prefix', () => {
    const a = generateId('ac');
    const b = generateId('ac');
    expect(a).to.not.equal(b);
    expect(a.startsWith('ac-')).to.be.true;
  });
});

describe('isInViewport', () => {
  it('returns true for an element positioned at the top-left of the viewport', () => {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.width = '10px';
    el.style.height = '10px';
    document.body.appendChild(el);

    expect(isInViewport(el)).to.be.true;

    el.remove();
  });
});

describe('createFocusTrap', () => {
  const buildContainer = () => {
    const container = document.createElement('div');
    container.tabIndex = -1;
    container.innerHTML = '<button id="first">First</button><button id="last">Last</button>';
    document.body.appendChild(container);
    return container;
  };

  it('moves focus into the container on activate()', () => {
    const container = buildContainer();
    const trap = createFocusTrap(container);
    trap.activate();

    expect(document.activeElement).to.equal(container.querySelector('#first'));

    trap.deactivate();
    container.remove();
  });

  it('wraps Shift+Tab from the first element to the last', () => {
    const container = buildContainer();
    const trap = createFocusTrap(container);
    trap.activate();

    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
    container.dispatchEvent(event);

    expect(document.activeElement).to.equal(container.querySelector('#last'));

    trap.deactivate();
    container.remove();
  });

  it('wraps Tab from the last element back to the first', () => {
    const container = buildContainer();
    const trap = createFocusTrap(container);
    trap.activate();
    container.querySelector('#last').focus();

    const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    container.dispatchEvent(event);

    expect(document.activeElement).to.equal(container.querySelector('#first'));

    trap.deactivate();
    container.remove();
  });

  it('restores focus to the previously focused element on deactivate()', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const container = buildContainer();
    const trap = createFocusTrap(container);
    trap.activate();
    trap.deactivate();

    expect(document.activeElement).to.equal(trigger);

    container.remove();
    trigger.remove();
  });
});
