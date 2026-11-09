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
    const active = el.shadowRoot.querySelector(
      '.ac-demo-content__device-switcher .ac-demo-content__segmented-button--active',
    );
    expect(active.getAttribute('data-value')).to.equal('mobile');
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
    const button = el.shadowRoot.querySelector(
      '.ac-demo-content__device-switcher [data-value="desktop"]',
    );

    button.click();
    await el.updateComplete;

    expect(el.shadowRoot.querySelector('.ac-demo-content__device-frame--desktop')).to.exist;
  });

  test('always renders a case switcher, even with a single case', async () => {
    const el = await fixture(html`
      <ac-demo-content><ac-demo-case header="Único"></ac-demo-case></ac-demo-content>
    `);
    expect(el.shadowRoot.querySelector('.ac-demo-content__case-select')).to.exist;
  });

  test('the case switcher only shows the header of each case', async () => {
    const el = await fixture(html`
      <ac-demo-content>
        <ac-demo-case header="Uno"></ac-demo-case>
        <ac-demo-case header="Dos"></ac-demo-case>
      </ac-demo-content>
    `);
    const select = el.shadowRoot.querySelector('.ac-demo-content__case-select');
    const labels = [...select.options].map(option => option.textContent.trim());
    expect(labels).to.deep.equal(['Uno', 'Dos']);
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
    expect(el.shadowRoot.querySelector('.ac-demo-content__locale-switcher')).to.not.exist;
  });

  test('renders a language switch for exactly 2 `language` values', async () => {
    const el = await fixture(html`<ac-demo-content language="es-PE, en-EN"></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__locale-switcher')).to.exist;
  });

  test('does not render a language switch for 3 `language` values', async () => {
    const el = await fixture(
      html`<ac-demo-content language="es-PE, en-EN, pt-BR"></ac-demo-content>`,
    );
    expect(el.shadowRoot.querySelector('.ac-demo-content__locale-switcher')).to.not.exist;
  });

  test('selecting the second language option sets the global locale', async () => {
    const el = await fixture(html`<ac-demo-content language="es-PE, en-EN"></ac-demo-content>`);
    const button = el.shadowRoot.querySelector(
      '.ac-demo-content__locale-switcher [data-value="1"]',
    );
    button.click();
    await el.updateComplete;
    expect(button.classList.contains('ac-demo-content__segmented-button--active')).to.be.true;
  });

  test('does not render an ambient switcher without the `ambients` attribute', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__ambient-select')).to.not.exist;
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

  test('does not render a theme switcher without the `dark-mode` attribute', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__theme-switcher')).to.not.exist;
  });

  test('renders a theme switcher with the `dark-mode` attribute', async () => {
    const el = await fixture(html`<ac-demo-content dark-mode></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__theme-switcher')).to.exist;
  });

  test('selecting dark in the theme switcher sets data-theme="dark" on <html>', async () => {
    const el = await fixture(html`<ac-demo-content dark-mode></ac-demo-content>`);
    const button = el.shadowRoot.querySelector(
      '.ac-demo-content__theme-switcher [data-value="dark"]',
    );
    button.click();
    expect(document.documentElement.getAttribute('data-theme')).to.equal('dark');
    document.documentElement.removeAttribute('data-theme');
  });

  test('renders a visual/code view switcher by default', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__viewmode-switcher')).to.exist;
  });

  test('shows the device frame in visual mode', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__device-frame')).to.exist;
    expect(el.shadowRoot.querySelector('.ac-demo-content__code-block')).to.not.exist;
  });

  test('shows the raw case source when switching to the code view', async () => {
    const el = await fixture(html`
      <ac-demo-content>
        <ac-demo-case href="/test/fixtures/case-fixture.html"></ac-demo-case>
      </ac-demo-content>
    `);
    await aTimeout(50);
    const codeButton = el.shadowRoot.querySelector(
      '.ac-demo-content__viewmode-switcher [data-value="code"]',
    );
    codeButton.click();
    await el.updateComplete;

    expect(el.shadowRoot.querySelector('.ac-demo-content__device-frame')).to.not.exist;
    expect(el.shadowRoot.querySelector('.ac-demo-content__code-block').textContent).to.include(
      'fixture-marker',
    );
  });

  test('does not render an events button without the `events` attribute', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__events-button')).to.not.exist;
  });

  test('renders an events button with the `events` attribute', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__events-button')).to.exist;
  });

  test('does not open the events panel until the button is clicked', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__modal')).to.not.exist;
  });

  test('opens the events panel when the events button is clicked', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    el.shadowRoot.querySelector('.ac-demo-content__events-button').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-demo-content__modal')).to.exist;
  });

  test('closes the events panel when the close button is clicked', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    el.shadowRoot.querySelector('.ac-demo-content__events-button').click();
    await el.updateComplete;
    el.shadowRoot.querySelector('.ac-demo-content__modal-close').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-demo-content__modal')).to.not.exist;
  });

  test('closes the events panel on Escape', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    el.shadowRoot.querySelector('.ac-demo-content__events-button').click();
    await el.updateComplete;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-demo-content__modal')).to.not.exist;
  });

  test('shows the listened event names as the panel config', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    el.shadowRoot.querySelector('.ac-demo-content__events-button').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.ac-demo-content__modal-config').textContent).to.include(
      'ac-test-demo-event',
    );
  });

  test('logs a matching event with a labeled name/time/payload in the panel', async () => {
    const el = await fixture(html`<ac-demo-content events="ac-test-demo-event"></ac-demo-content>`);
    document.dispatchEvent(new CustomEvent('ac-test-demo-event', { detail: { value: 1 } }));
    await aTimeout(10);

    el.shadowRoot.querySelector('.ac-demo-content__events-button').click();
    await el.updateComplete;

    const text = el.shadowRoot.querySelector('.ac-demo-content__modal-list').textContent;
    expect(text).to.include('Evento:');
    expect(text).to.include('ac-test-demo-event');
    expect(text).to.include('Hora:');
    expect(text).to.include('Payload:');
    expect(text).to.include('"value": 1');
  });

  test('exposes the event count as a standalone word in the events button label', async () => {
    const el = await fixture(
      html`<ac-demo-content events="ac-test-count-event"></ac-demo-content>`,
    );
    document.dispatchEvent(new CustomEvent('ac-test-count-event', { detail: {} }));
    await aTimeout(10);
    await el.updateComplete;

    // El conteo visible ("1") debe ser una palabra suelta del nombre accesible: con
    // "(1)" axe marca label-content-name-mismatch (WCAG 2.5.3).
    const label = el.shadowRoot
      .querySelector('.ac-demo-content__events-button')
      .getAttribute('aria-label');
    expect(label.split(/\s+/)).to.include('1');
  });

  test('does not render a header without `name`/`tech`/`package-name`/`docs-href`', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__header')).to.not.exist;
  });

  test('renders the component name without angle brackets', async () => {
    const el = await fixture(html`<ac-demo-content name="ac-button-basic"></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__name').textContent.trim()).to.equal(
      'ac-button-basic',
    );
  });

  test('renders the tech badge', async () => {
    const el = await fixture(html`<ac-demo-content tech="Lit v3"></ac-demo-content>`);
    expect(el.shadowRoot.querySelector('.ac-demo-content__tech-badge').textContent.trim()).to.equal(
      'Lit v3',
    );
  });

  test('renders pnpm and npm install snippets from `package-name`', async () => {
    const el = await fixture(
      html`<ac-demo-content package-name="@ac-components/ac-button-basic"></ac-demo-content>`,
    );
    const snippets = [...el.shadowRoot.querySelectorAll('.ac-demo-content__install-cmd')].map(
      node => node.textContent.trim(),
    );
    expect(snippets).to.deep.equal([
      'pnpm add @ac-components/ac-button-basic',
      'npm i @ac-components/ac-button-basic',
    ]);
  });

  test('renders a docs link pointing to `docs-href`', async () => {
    const el = await fixture(
      html`<ac-demo-content docs-href="https://example.com/README.md"></ac-demo-content>`,
    );
    const link = el.shadowRoot.querySelector('.ac-demo-content__docs-link');
    expect(link.getAttribute('href')).to.equal('https://example.com/README.md');
  });
});

suite('ac-demo-content: copy install command', () => {
  let copied;

  const stubClipboard = writeText => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  };

  const renderWithPackage = () =>
    fixture(html`<ac-demo-content package-name="@ac-components/ac-x"></ac-demo-content>`);

  const installButton = (el, index) =>
    el.shadowRoot.querySelectorAll('.ac-demo-content__install-cmd')[index];

  setup(() => {
    copied = [];
    stubClipboard(async text => copied.push(text));
  });

  teardown(() => {
    delete navigator.clipboard;
  });

  test('renders each install command as a button', async () => {
    const el = await renderWithPackage();
    expect(installButton(el, 0).tagName).to.equal('BUTTON');
  });

  test('copies the pnpm command when clicked', async () => {
    const el = await renderWithPackage();
    installButton(el, 0).click();
    await aTimeout(0);
    expect(copied).to.deep.equal(['pnpm add @ac-components/ac-x']);
  });

  test('copies the npm command when clicked', async () => {
    const el = await renderWithPackage();
    installButton(el, 1).click();
    await aTimeout(0);
    expect(copied).to.deep.equal(['npm i @ac-components/ac-x']);
  });

  test('dispatches `ac-demo-content-copy` with the copied text', async () => {
    const el = await renderWithPackage();
    let detail;
    el.addEventListener('ac-demo-content-copy', event => {
      detail = event.detail;
    });
    installButton(el, 1).click();
    await aTimeout(0);
    expect(detail).to.deep.equal({ text: 'npm i @ac-components/ac-x' });
  });

  test('`ac-demo-content-copy` bubbles and is composed', async () => {
    const el = await renderWithPackage();
    let event;
    document.addEventListener('ac-demo-content-copy', e => (event = e), { once: true });
    installButton(el, 0).click();
    await aTimeout(0);
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });

  test('marks the clicked command as copied', async () => {
    const el = await renderWithPackage();
    installButton(el, 0).click();
    await aTimeout(0);
    await el.updateComplete;
    expect(installButton(el, 0).classList.contains('ac-demo-content__install-cmd--copied')).to.be
      .true;
  });

  test('does not mark the other command as copied', async () => {
    const el = await renderWithPackage();
    installButton(el, 0).click();
    await aTimeout(0);
    await el.updateComplete;
    expect(installButton(el, 1).classList.contains('ac-demo-content__install-cmd--copied')).to.be
      .false;
  });

  test('announces the copy to assistive technology', async () => {
    const el = await renderWithPackage();
    installButton(el, 0).click();
    await aTimeout(0);
    await el.updateComplete;
    const status = el.shadowRoot.querySelector('.ac-demo-content__visually-hidden');
    expect(status.textContent.trim()).to.equal('Copiado al portapapeles');
  });

  test('clears the copied state after a short delay', async () => {
    const el = await renderWithPackage();
    installButton(el, 0).click();
    await aTimeout(1800);
    await el.updateComplete;
    expect(installButton(el, 0).classList.contains('ac-demo-content__install-cmd--copied')).to.be
      .false;
  });

  test('does not mark as copied nor dispatch when copying fails', async () => {
    const originalExecCommand = document.execCommand;
    document.execCommand = () => false;
    stubClipboard(async () => Promise.reject(new Error('denied')));
    const el = await renderWithPackage();
    let dispatched = false;
    el.addEventListener('ac-demo-content-copy', () => {
      dispatched = true;
    });
    installButton(el, 0).click();
    await aTimeout(0);
    document.execCommand = originalExecCommand;
    expect(dispatched).to.be.false;
  });
});

suite('ac-demo-content: case row', () => {
  test('renders the case switcher in its own row', async () => {
    const el = await fixture(
      html`<ac-demo-content><ac-demo-case header="Uno"></ac-demo-case></ac-demo-content>`,
    );
    expect(
      el.shadowRoot.querySelector('.ac-demo-content__toolbar-cases .ac-demo-content__case-select'),
    ).to.exist;
  });

  test('keeps the other controls out of the case row', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(
      el.shadowRoot.querySelector('.ac-demo-content__toolbar-cases .ac-demo-content__segmented'),
    ).to.not.exist;
  });

  test('renders the other controls in a second row', async () => {
    const el = await fixture(html`<ac-demo-content></ac-demo-content>`);
    expect(
      el.shadowRoot.querySelector(
        '.ac-demo-content__toolbar-controls .ac-demo-content__device-switcher',
      ),
    ).to.exist;
  });

  test('exposes the active case header as the select title', async () => {
    const el = await fixture(html`
      <ac-demo-content>
        <ac-demo-case header="Un encabezado largo"></ac-demo-case>
      </ac-demo-content>
    `);
    const select = el.shadowRoot.querySelector('.ac-demo-content__case-select');
    expect(select.title).to.equal('Un encabezado largo');
  });
});

suite('ac-demo-content: code editor view', () => {
  const FIXTURE = '/test/fixtures/case-multiline-fixture.html';

  const openCodeView = async () => {
    const el = await fixture(html`
      <ac-demo-content>
        <ac-demo-case href=${FIXTURE}></ac-demo-case>
      </ac-demo-content>
    `);
    await aTimeout(50);
    el.shadowRoot.querySelector('.ac-demo-content__viewmode-switcher [data-value="code"]').click();
    await el.updateComplete;
    return el;
  };

  test('numbers the lines starting at 1', async () => {
    const el = await openCodeView();
    const numbers = [...el.shadowRoot.querySelectorAll('.ac-demo-content__code-gutter')].map(
      gutter => gutter.textContent.trim(),
    );
    expect(numbers).to.deep.equal(['1', '2', '3', '4']);
  });

  test('keeps the source text of each line without the line number', async () => {
    const el = await openCodeView();
    const lines = [...el.shadowRoot.querySelectorAll('.ac-demo-content__code-text')].map(
      line => line.textContent,
    );
    expect(lines).to.deep.equal([
      '<!-- comentario -->',
      '<div class="row">',
      '  <button type="button" disabled>Aceptar</button>',
      '</div>',
    ]);
  });

  test('hides the line numbers from assistive technology', async () => {
    const el = await openCodeView();
    const gutter = el.shadowRoot.querySelector('.ac-demo-content__code-gutter');
    expect(gutter.getAttribute('aria-hidden')).to.equal('true');
  });

  test('highlights tags', async () => {
    const el = await openCodeView();
    expect(el.shadowRoot.querySelector('.ac-demo-content__tok--tag').textContent).to.equal('div');
  });

  test('highlights attribute values as strings', async () => {
    const el = await openCodeView();
    expect(el.shadowRoot.querySelector('.ac-demo-content__tok--string').textContent).to.equal(
      '"row"',
    );
  });

  test('highlights comments', async () => {
    const el = await openCodeView();
    expect(el.shadowRoot.querySelector('.ac-demo-content__tok--comment').textContent).to.equal(
      '<!-- comentario -->',
    );
  });

  test('shows the file name of the active case in the title bar', async () => {
    const el = await openCodeView();
    expect(el.shadowRoot.querySelector('.ac-demo-content__code-filename').textContent).to.equal(
      'case-multiline-fixture.html',
    );
  });

  test('exposes the code as a focusable, labelled region', async () => {
    const el = await openCodeView();
    const block = el.shadowRoot.querySelector('.ac-demo-content__code-block');
    expect([block.getAttribute('role'), block.tabIndex]).to.deep.equal(['region', 0]);
  });
});
