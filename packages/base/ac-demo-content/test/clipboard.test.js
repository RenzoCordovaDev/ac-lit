import { expect } from '@open-wc/testing';
import { copyToClipboard } from '../src/clipboard.js';

suite('copyToClipboard', () => {
  let originalExecCommand;

  setup(() => {
    originalExecCommand = document.execCommand;
  });

  teardown(() => {
    delete navigator.clipboard;
    document.execCommand = originalExecCommand;
  });

  test('writes the text with the Clipboard API', async () => {
    const written = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async text => written.push(text) },
    });

    await copyToClipboard('pnpm add x');

    expect(written).to.deep.equal(['pnpm add x']);
  });

  test('resolves true when the Clipboard API succeeds', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => {} },
    });

    expect(await copyToClipboard('x')).to.be.true;
  });

  test('falls back to execCommand when the Clipboard API rejects', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => Promise.reject(new Error('denied')) },
    });
    let copiedText = '';
    document.execCommand = command => {
      copiedText = document.querySelector('textarea')?.value ?? '';
      return command === 'copy';
    };

    await copyToClipboard('npm i x');

    expect(copiedText).to.equal('npm i x');
  });

  test('resolves false when every strategy fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => Promise.reject(new Error('denied')) },
    });
    document.execCommand = () => false;

    expect(await copyToClipboard('x')).to.be.false;
  });

  test('removes the temporary textarea after the fallback', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => Promise.reject(new Error('denied')) },
    });
    document.execCommand = () => true;

    await copyToClipboard('x');

    expect(document.querySelector('textarea')).to.not.exist;
  });
});
