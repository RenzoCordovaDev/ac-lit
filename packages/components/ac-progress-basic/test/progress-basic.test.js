import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

suite('ac-progress-basic', () => {
  test('clamps value below 0', async () => {
    const el = await fixture(html`<ac-progress-basic value="-20"></ac-progress-basic>`);
    const track = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(track.getAttribute('aria-valuenow')).to.equal('0');
  });

  test('clamps value above 100', async () => {
    const el = await fixture(html`<ac-progress-basic value="150"></ac-progress-basic>`);
    const track = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(track.getAttribute('aria-valuenow')).to.equal('100');
  });

  test('renders role="progressbar"', async () => {
    const el = await fixture(html`<ac-progress-basic></ac-progress-basic>`);
    expect(el.shadowRoot.querySelector('[role="progressbar"]')).to.exist;
  });

  test('omits aria-valuenow when indeterminate', async () => {
    const el = await fixture(
      html`<ac-progress-basic value="40" indeterminate></ac-progress-basic>`,
    );
    const track = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(track.hasAttribute('aria-valuenow')).to.be.false;
  });

  test('sets aria-valuenow to the clamped value when not indeterminate', async () => {
    const el = await fixture(html`<ac-progress-basic value="65"></ac-progress-basic>`);
    const track = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(track.getAttribute('aria-valuenow')).to.equal('65');
  });

  test('falls back to ambient="primary" with an invalid ambient', async () => {
    const el = await fixture(html`<ac-progress-basic ambient="unknown"></ac-progress-basic>`);
    const track = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(track.classList.contains('ac-progress--primary')).to.be.true;
  });

  test('uses `label` as the aria-label of the progressbar', async () => {
    const el = await fixture(
      html`<ac-progress-basic label="Subiendo archivo"></ac-progress-basic>`,
    );
    const track = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(track.getAttribute('aria-label')).to.equal('Subiendo archivo');
  });

  test('falls back to a translated default aria-label when `label` is not set', async () => {
    const el = await fixture(html`<ac-progress-basic></ac-progress-basic>`);
    const track = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(track.getAttribute('aria-label')).to.equal('Progreso');
  });
});
