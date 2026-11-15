import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

const messageOf = el => el.shadowRoot.querySelector('[part="message"]');
const dismissButtonOf = el => el.shadowRoot.querySelector('[part="dismiss"]');
const iconOf = el => el.shadowRoot.querySelector('[part="icon"] svg');

suite('ac-notification-basic', () => {
  test('defaults ambient to "neutral"', async () => {
    const el = await fixture(html`<ac-notification-basic></ac-notification-basic>`);
    expect(el.ambient).to.equal('neutral');
  });

  test('falls back to "neutral" with an invalid ambient', async () => {
    const el = await fixture(
      html`<ac-notification-basic ambient="not-a-real-ambient"></ac-notification-basic>`,
    );
    expect(el.shadowRoot.querySelector('.ac-notification--neutral')).to.exist;
  });

  test('renders the message translated with this.t()', async () => {
    const el = await fixture(html`<ac-notification-basic message="Hola"></ac-notification-basic>`);
    expect(messageOf(el).textContent.trim()).to.equal('Hola');
  });

  test('renders a different icon for each ambient', async () => {
    const neutral = await fixture(
      html`<ac-notification-basic ambient="neutral"></ac-notification-basic>`,
    );
    const danger = await fixture(
      html`<ac-notification-basic ambient="danger"></ac-notification-basic>`,
    );
    expect(iconOf(neutral).innerHTML).to.not.equal(iconOf(danger).innerHTML);
  });

  test('the icon is aria-hidden', async () => {
    const el = await fixture(html`<ac-notification-basic></ac-notification-basic>`);
    expect(el.shadowRoot.querySelector('[part="icon"]').getAttribute('aria-hidden')).to.equal(
      'true',
    );
  });

  test('clicking dismiss dispatches ac-notification-basic-dismiss-click', async () => {
    const el = await fixture(html`<ac-notification-basic></ac-notification-basic>`);
    setTimeout(() => dismissButtonOf(el).click());
    const event = await oneEvent(el, 'ac-notification-basic-dismiss-click');
    expect(event.detail).to.be.true;
  });

  test('clicking dismiss does not remove the element from the DOM', async () => {
    const el = await fixture(html`<ac-notification-basic></ac-notification-basic>`);
    dismissButtonOf(el).click();
    expect(el.isConnected).to.be.true;
  });

  test('the dismiss button has a translated aria-label', async () => {
    const el = await fixture(html`<ac-notification-basic></ac-notification-basic>`);
    expect(dismissButtonOf(el).getAttribute('aria-label')).to.not.be.empty;
  });
});
