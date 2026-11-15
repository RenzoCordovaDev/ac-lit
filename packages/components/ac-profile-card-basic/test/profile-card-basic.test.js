import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

const avatarOf = el => el.shadowRoot.querySelector('[part="avatar"]');
const nameOf = el => el.shadowRoot.querySelector('[part="name"]');
const statusOf = el => el.shadowRoot.querySelector('[part="status"]');
const actionOf = el => el.shadowRoot.querySelector('[part="action"]');

suite('ac-profile-card-basic', () => {
  test('passes name and avatar-src down to ac-avatar-basic', async () => {
    const el = await fixture(
      html`<ac-profile-card-basic
        name="Ana Torres"
        avatar-src="https://example.com/ana.jpg"
      ></ac-profile-card-basic>`,
    );
    expect(avatarOf(el).getAttribute('name')).to.equal('Ana Torres');
    expect(avatarOf(el).getAttribute('src')).to.equal('https://example.com/ana.jpg');
  });

  test('renders the name through ac-text-basic', async () => {
    const el = await fixture(
      html`<ac-profile-card-basic name="Ana Torres"></ac-profile-card-basic>`,
    );
    expect(nameOf(el).getAttribute('text')).to.equal('Ana Torres');
  });

  test('does not render a status badge without statusText', async () => {
    const el = await fixture(
      html`<ac-profile-card-basic name="Ana Torres"></ac-profile-card-basic>`,
    );
    expect(statusOf(el)).to.not.exist;
  });

  test('renders the status badge with its text and ambient when set', async () => {
    const el = await fixture(
      html`<ac-profile-card-basic
        name="Ana Torres"
        status-text="Activo"
        status-ambient="success"
      ></ac-profile-card-basic>`,
    );
    expect(statusOf(el).getAttribute('text')).to.equal('Activo');
    expect(statusOf(el).getAttribute('ambient')).to.equal('success');
  });

  test('does not render an action button without actionText', async () => {
    const el = await fixture(
      html`<ac-profile-card-basic name="Ana Torres"></ac-profile-card-basic>`,
    );
    expect(actionOf(el)).to.not.exist;
  });

  test('renders the translated actionText when it matches a locale key', async () => {
    const el = await fixture(
      html`<ac-profile-card-basic
        name="Ana Torres"
        action-text="profile-card-basic-view-profile"
      ></ac-profile-card-basic>`,
    );
    expect(actionOf(el).textContent.trim()).to.equal('Ver perfil');
  });

  test('dispatches ac-profile-card-basic-action-click when the action button is clicked', async () => {
    const el = await fixture(
      html`<ac-profile-card-basic name="Ana Torres" action-text="Ver"></ac-profile-card-basic>`,
    );
    setTimeout(() => actionOf(el).shadowRoot.querySelector('button').click());
    const event = await oneEvent(el, 'ac-profile-card-basic-action-click');
    expect(event.detail).to.be.true;
  });
});
