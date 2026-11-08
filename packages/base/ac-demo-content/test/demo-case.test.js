import { fixture, expect, html, aTimeout } from '@open-wc/testing';
import '../index.js';

suite('ac-demo-case', () => {
  test('is hidden by default', async () => {
    const el = await fixture(
      html`<ac-demo-case href="/test/fixtures/case-fixture.html"></ac-demo-case>`,
    );
    expect(el.hidden).to.be.true;
  });

  test('is not hidden when active', async () => {
    const el = await fixture(
      html`<ac-demo-case href="/test/fixtures/case-fixture.html" active></ac-demo-case>`,
    );
    expect(el.hidden).to.be.false;
  });

  test('reads header from the attribute', async () => {
    const el = await fixture(html`<ac-demo-case header="Básico"></ac-demo-case>`);
    expect(el.header).to.equal('Básico');
  });

  test('reads descripcion from the attribute', async () => {
    const el = await fixture(html`<ac-demo-case descripcion="Uso por defecto"></ac-demo-case>`);
    expect(el.descripcion).to.equal('Uso por defecto');
  });

  test('loads its href content into the light DOM when activated', async () => {
    const el = await fixture(
      html`<ac-demo-case href="/test/fixtures/case-fixture.html"></ac-demo-case>`,
    );
    el.active = true;
    await aTimeout(50);
    expect(el.querySelector('.fixture-marker')).to.exist;
  });

  test('exposes the raw fetched HTML via `.source`', async () => {
    const el = await fixture(
      html`<ac-demo-case href="/test/fixtures/case-fixture.html"></ac-demo-case>`,
    );
    el.active = true;
    await aTimeout(50);
    expect(el.source).to.include('fixture-marker');
  });

  test('toggling active=false hides it again without re-fetching', async () => {
    const el = await fixture(
      html`<ac-demo-case href="/test/fixtures/case-fixture.html" active></ac-demo-case>`,
    );
    await aTimeout(50);
    el.active = false;
    expect(el.hidden).to.be.true;
  });
});
