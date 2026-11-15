import { fixture, expect, html, aTimeout } from '@open-wc/testing';
import '../index.js';

const imageOf = el => el.shadowRoot.querySelector('.ac-avatar-basic__image');
const fallbackOf = el => el.shadowRoot.querySelector('.ac-avatar-basic__fallback');

suite('ac-avatar-basic', () => {
  test('defaults size to "md"', async () => {
    const el = await fixture(html`<ac-avatar-basic></ac-avatar-basic>`);
    expect(el.size).to.equal('md');
  });

  test('falls back to "md" with an invalid size', async () => {
    const el = await fixture(html`<ac-avatar-basic size="huge"></ac-avatar-basic>`);
    expect(el._size).to.equal('md');
  });

  test('defaults ambient to "primary"', async () => {
    const el = await fixture(html`<ac-avatar-basic></ac-avatar-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('renders an <img> with the name as alt text when `src` is set', async () => {
    const el = await fixture(
      html`<ac-avatar-basic src="./photo.png" name="Ada Lovelace"></ac-avatar-basic>`,
    );
    expect(imageOf(el).getAttribute('alt')).to.equal('Ada Lovelace');
  });

  test('renders the initials fallback when `src` is empty', async () => {
    const el = await fixture(html`<ac-avatar-basic name="Ada Lovelace"></ac-avatar-basic>`);
    expect(fallbackOf(el)).to.exist;
  });

  test('computes initials from a single-word name', async () => {
    const el = await fixture(html`<ac-avatar-basic name="Ada"></ac-avatar-basic>`);
    expect(el._initials).to.equal('A');
  });

  test('computes initials from a multi-word name', async () => {
    const el = await fixture(html`<ac-avatar-basic name="Ada Lovelace"></ac-avatar-basic>`);
    expect(el._initials).to.equal('AL');
  });

  test('the fallback has role="img"', async () => {
    const el = await fixture(html`<ac-avatar-basic name="Ada Lovelace"></ac-avatar-basic>`);
    expect(fallbackOf(el).getAttribute('role')).to.equal('img');
  });

  test('the fallback aria-label is the person name', async () => {
    const el = await fixture(html`<ac-avatar-basic name="Ada Lovelace"></ac-avatar-basic>`);
    expect(fallbackOf(el).getAttribute('aria-label')).to.equal('Ada Lovelace');
  });

  test('the fallback aria-label falls back to the translated "unknown" label without a name', async () => {
    const el = await fixture(html`<ac-avatar-basic></ac-avatar-basic>`);
    expect(fallbackOf(el).getAttribute('aria-label')).to.equal('Usuario');
  });

  test('falls back to initials when the image fails to load', async () => {
    const el = await fixture(
      html`<ac-avatar-basic src="./does-not-exist.png" name="Ada Lovelace"></ac-avatar-basic>`,
    );
    imageOf(el).dispatchEvent(new Event('error'));
    await aTimeout(0);
    expect(fallbackOf(el)).to.exist;
  });
});
