import { expect } from '@open-wc/testing';
import { dispatchCustomEvent, debounce, generateId, isInViewport } from './utils.js';

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
