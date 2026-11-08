import { fixture, expect, html, aTimeout } from '@open-wc/testing';
import '../index.js';
import '../demo/sample-button.js';

suite('ac-demo-content', () => {
  test('renders a device-size switcher by default', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__device-switcher')).to.exist;
  });

  test('defaults to the mobile device size', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    const active = el.shadowRoot.querySelector('.ac-demo-content__device-button--active');
    expect(active.textContent.trim()).to.equal('Móvil');
  });

  test('defaults to light mode', async () => {
    await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(document.documentElement.getAttribute('data-theme')).to.equal('light');
    document.documentElement.removeAttribute('data-theme');
  });

  test('wraps the viewport in a device frame matching the active device', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__device-frame--mobile')).to.exist;
  });

  test('switching the device size updates the device frame', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    const buttons = [...el.shadowRoot.querySelectorAll('.ac-demo-content__device-button')];
    const desktopButton = buttons.find(button => button.textContent.trim() === 'Desktop');

    desktopButton.click();
    await el.updateComplete;

    expect(el.shadowRoot.querySelector('.ac-demo-content__device-frame--desktop')).to.exist;
  });

  test('does not render a case switcher with a single case', async () => {
    const el = await fixture(html`
      <ac-demo-content><ac-demo-case header="Único"></ac-demo-case></ac-demo-content>
    `);
    const labels = [...el.shadowRoot.querySelectorAll('.ac-demo-content__field-label')].map(label =>
      label.textContent.trim(),
    );
    expect(labels.includes('Caso')).to.be.false;
  });

  test('renders a case switcher with more than one case', async () => {
    const el = await fixture(html`
      <ac-demo-content>
        <ac-demo-case header="Uno"></ac-demo-case>
        <ac-demo-case header="Dos"></ac-demo-case>
      </ac-demo-content>
    `);
    const labels = [...el.shadowRoot.querySelectorAll('.ac-demo-content__field-label')].map(label =>
      label.textContent.trim(),
    );
    expect(labels.includes('Caso')).to.be.true;
  });

  test('activates the first case by default', async () => {
    const el = await fixture(html`
      <ac-demo-content>
        <ac-demo-case header="Uno"></ac-demo-case>
        <ac-demo-case header="Dos"></ac-demo-case>
      </ac-demo-content>
    `);
    const [first] = el.querySelectorAll('ac-demo-case');
    expect(first.active).to.be.true;
  });

  test('switching the case select activates the chosen case', async () => {
    const el = await fixture(html`
      <ac-demo-content>
        <ac-demo-case header="Uno"></ac-demo-case>
        <ac-demo-case header="Dos"></ac-demo-case>
      </ac-demo-content>
    `);
    const [, second] = el.querySelectorAll('ac-demo-case');
    const select = el.shadowRoot.querySelector('.ac-demo-content__case-select');

    select.value = '1';
    select.dispatchEvent(new Event('change'));

    expect(second.active).to.be.true;
  });

  test('switching the case select deactivates the previous case', async () => {
    const el = await fixture(html`
      <ac-demo-content>
        <ac-demo-case header="Uno"></ac-demo-case>
        <ac-demo-case header="Dos"></ac-demo-case>
      </ac-demo-content>
    `);
    const [first] = el.querySelectorAll('ac-demo-case');
    const select = el.shadowRoot.querySelector('.ac-demo-content__case-select');

    select.value = '1';
    select.dispatchEvent(new Event('change'));

    expect(first.active).to.be.false;
  });

  test('does not render a language switch without exactly 2 `language` values', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__locale-switch')).to.not.exist;
  });

  test('renders a language switch for exactly 2 `language` values', async () => {
    const el = await fixture(html`<ac-demo-content language="es-PE, en-EN"></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__locale-switch')).to.exist;
  });

  test('does not render a language switch for 3 `language` values', async () => {
    const el = await fixture(
      html`<ac-demo-content language="es-PE, en-EN, pt-BR"></ac-demo-content>`,
    );
    expect(el.shadowRoot.querySelector('.ac-demo-content__locale-switch')).to.not.exist;
  });

  test('toggling the language switch sets the global locale to the second language', async () => {
    const el = await fixture(html`<ac-demo-content language="es-PE, en-EN"></ac-demo-content>`);
    el.shadowRoot.querySelector('.ac-demo-content__locale-switch').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-demo-content__locale-switch').ariaChecked).to.equal(
      'true',
    );
  });

  test('does not render an ambient switcher without the `ambients` attribute', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    const labels = [...el.shadowRoot.querySelectorAll('.ac-demo-content__field-label')].map(label =>
      label.textContent.trim(),
    );
    expect(labels.includes('Ambient')).to.be.false;
  });

  test('renders an ambient option per value in `ambients`', async () => {
    const el = await fixture(
      html`<ac-demo-content ambients="primary, secondary"></ac-demo-content>`,
    );
    const select = el.shadowRoot.querySelector('.ac-demo-content__ambient-select');
    expect(select.options.length).to.equal(2);
  });

  test('changing the ambient select updates `ambient` on components in the active case', async () => {
    const el = await fixture(html`
      <ac-demo-content ambients="primary, secondary">
        <ac-demo-case><ac-demo-sample-button>Click</ac-demo-sample-button></ac-demo-case>
      </ac-demo-content>
    `);
    const button = el.querySelector('ac-demo-sample-button');
    const select = el.shadowRoot.querySelector('.ac-demo-content__ambient-select');

    select.value = 'secondary';
    select.dispatchEvent(new Event('change'));

    expect(button.ambient).to.equal('secondary');
  });

  test('does not render a theme toggle without the `dark-mode` attribute', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__theme-toggle')).to.not.exist;
  });

  test('renders a theme toggle with the `dark-mode` attribute', async () => {
    const el = await fixture(html`<ac-demo-content dark-mode></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__theme-toggle')).to.exist;
  });

  test('clicking the theme toggle sets data-theme="dark" on <html>', async () => {
    const el = await fixture(html`<ac-demo-content dark-mode></ac-demo-content>`);
    el.shadowRoot.querySelector('.ac-demo-content__theme-toggle').click();
    expect(document.documentElement.getAttribute('data-theme')).to.equal('dark');
    document.documentElement.removeAttribute('data-theme');
  });

  test('does not render an events button without the `events` attribute', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__events-button')).to.not.exist;
  });

  test('renders an events button with the `events` attribute', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__events-button')).to.exist;
  });

  test('does not open the events modal until the button is clicked', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__modal')).to.not.exist;
  });

  test('opens the events modal when the events button is clicked', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    el.shadowRoot.querySelector('.ac-demo-content__events-button').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-demo-content__modal')).to.exist;
  });

  test('closes the events modal when the close button is clicked', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    el.shadowRoot.querySelector('.ac-demo-content__events-button').click();
    await el.updateComplete;
    el.shadowRoot.querySelector('.ac-demo-content__modal-close').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-demo-content__modal')).to.not.exist;
  });

  test('closes the events modal on Escape', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    el.shadowRoot.querySelector('.ac-demo-content__events-button').click();
    await el.updateComplete;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-demo-content__modal')).to.not.exist;
  });

  test('shows the listened event names as the modal config', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    el.shadowRoot.querySelector('.ac-demo-content__events-button').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-demo-content__modal-config').textContent).to.include(
      'ac-test-demo-event',
    );
  });

  test('logs a matching event dispatched on document and shows it in the modal', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    document.dispatchEvent(new CustomEvent('ac-test-demo-event', { detail: { value: 1 } }));
    await aTimeout(10);

    el.shadowRoot.querySelector('.ac-demo-content__events-button').click();
    await el.updateComplete;

    expect(el.shadowRoot.querySelector('.ac-demo-content__modal-list').textContent).to.include(
      'ac-test-demo-event',
    );
  });
});
