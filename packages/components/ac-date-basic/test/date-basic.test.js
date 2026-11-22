import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

suite('ac-date-basic', () => {
  test('formatea una fecha corta (type="short", default) con Intl.DateTimeFormat', async () => {
    const el = await fixture(html`<ac-date-basic value="2026-11-22T12:00:00"></ac-date-basic>`);
    const expected = new Intl.DateTimeFormat(el.locale, { dateStyle: 'short' }).format(
      new Date('2026-11-22T12:00:00'),
    );

    expect(el.shadowRoot.querySelector('ac-text-basic').textContent.trim()).to.equal(expected);
  });

  test('formatea una fecha larga con type="long"', async () => {
    const el = await fixture(
      html`<ac-date-basic value="2026-11-22T12:00:00" type="long"></ac-date-basic>`,
    );
    const expected = new Intl.DateTimeFormat(el.locale, { dateStyle: 'long' }).format(
      new Date('2026-11-22T12:00:00'),
    );

    expect(el.shadowRoot.querySelector('ac-text-basic').textContent.trim()).to.equal(expected);
  });

  test('un `format` seteado tiene prioridad sobre `type` y reemplaza DD/MM/YYYY', async () => {
    const el = await fixture(
      html`<ac-date-basic value="2026-11-22" format="DD/MM/YYYY" type="long"></ac-date-basic>`,
    );

    expect(el.shadowRoot.querySelector('ac-text-basic').textContent.trim()).to.equal('22/11/2026');
  });

  test('respeta un `locale` distinto al formatear con Intl.DateTimeFormat', async () => {
    const el = await fixture(
      html`<ac-date-basic value="2026-11-22T12:00:00" locale="en-EN"></ac-date-basic>`,
    );
    const expected = new Intl.DateTimeFormat('en-EN', { dateStyle: 'short' }).format(
      new Date('2026-11-22T12:00:00'),
    );

    expect(el.shadowRoot.querySelector('ac-text-basic').textContent.trim()).to.equal(expected);
  });

  test('un `value` inválido se muestra crudo, sin intentar formatear', async () => {
    const el = await fixture(html`<ac-date-basic value="no-es-una-fecha"></ac-date-basic>`);

    expect(el.shadowRoot.querySelector('ac-text-basic').textContent.trim()).to.equal(
      'no-es-una-fecha',
    );
  });
});
