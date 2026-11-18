import { LitElement } from 'lit';
import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import { ApiSimulatorMixin } from './api-mixin.js';

class AcTestApi extends ApiSimulatorMixin(LitElement) {
  static get is() {
    return 'ac-test-api';
  }

  obtenerDato(id) {
    return this._simulateCall(
      'obtenerDato',
      { id },
      {
        successEvent: 'ac-test-api-get-success',
        errorEvent: 'ac-test-api-get-error',
        resolveData: () => ({ id, nombre: 'Mock' }),
      },
    );
  }
}
customElements.define(AcTestApi.is, AcTestApi);

describe('ApiSimulatorMixin', () => {
  it('no renderiza ningún contenido', async () => {
    const el = await fixture(html`<ac-test-api></ac-test-api>`);
    expect(el.shadowRoot.textContent.trim()).to.equal('');
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  it('expone version/timeout/simulateError con sus defaults', async () => {
    const el = await fixture(html`<ac-test-api></ac-test-api>`);
    expect(el.version).to.equal('v1');
    expect(el.timeout).to.equal(3000);
    expect(el.simulateError).to.be.false;
  });

  it('resuelve la promesa y dispara el evento de éxito tras `timeout`', async () => {
    const el = await fixture(html`<ac-test-api timeout="1"></ac-test-api>`);

    const [data] = await Promise.all([el.obtenerDato(1), oneEvent(el, 'ac-test-api-get-success')]);

    expect(data).to.deep.equal({ id: 1, nombre: 'Mock' });
  });

  it('el detail del evento de éxito trae method/params/data', async () => {
    const el = await fixture(html`<ac-test-api timeout="1"></ac-test-api>`);

    const [, event] = await Promise.all([
      el.obtenerDato(7),
      oneEvent(el, 'ac-test-api-get-success'),
    ]);

    expect(event.detail).to.deep.equal({
      method: 'obtenerDato',
      params: { id: 7 },
      data: { id: 7, nombre: 'Mock' },
    });
  });

  it('con `simulateError` rechaza la promesa y dispara el evento de error', async () => {
    const el = await fixture(html`<ac-test-api timeout="1" simulate-error></ac-test-api>`);
    const errorEvent = oneEvent(el, 'ac-test-api-get-error');

    let caught;
    try {
      await el.obtenerDato(1);
    } catch (error) {
      caught = error;
    }
    const event = await errorEvent;

    expect(caught).to.exist;
    expect(event.detail.method).to.equal('obtenerDato');
    expect(event.detail.error.message).to.be.a('string');
  });
});
