import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastPayments() {
  return fixture(html`<ac-api-pagos timeout="1"></ac-api-pagos>`);
}

suite('ac-api-pagos', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastPayments();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('listarMetodosPago enmascara el número de tarjeta', async () => {
    const el = await fastPayments();
    const methods = await el.listarMetodosPago();
    expect(methods[0].ultimosDigitos).to.equal('1111');
    expect(methods[0]).to.not.have.property('numero');
  });

  test('agregarMetodoPago agrega un método nuevo, no predeterminado', async () => {
    const el = await fastPayments();
    const nuevo = await el.agregarMetodoPago({ marca: 'Amex', numero: '340000000000009' });
    expect(nuevo.predeterminado).to.be.false;
    expect(nuevo.ultimosDigitos).to.equal('0009');
  });

  test('agregarMetodoPago sin datos obligatorios dispara error', async () => {
    const el = await fastPayments();
    let caught;
    try {
      await el.agregarMetodoPago({});
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('marcarMetodoPredeterminado deja un solo método predeterminado', async () => {
    const el = await fastPayments();
    const methods = await el.marcarMetodoPredeterminado(2);
    expect(methods.filter(m => m.predeterminado)).to.have.lengthOf(1);
    expect(methods.find(m => m.id === 2).predeterminado).to.be.true;
  });

  test('eliminarMetodoPago quita el método del mock', async () => {
    const el = await fastPayments();
    const resultado = await el.eliminarMetodoPago(2);
    expect(resultado).to.deep.equal({ id: 2, deleted: true });
  });

  test('procesarPago con monto válido devuelve estado aprobado', async () => {
    const el = await fastPayments();
    const resultado = await el.procesarPago(150, 1);
    expect(resultado.estado).to.equal('aprobado');
  });

  test('procesarPago con monto inválido dispara error', async () => {
    const el = await fastPayments();
    const errorEvent = oneEvent(el, 'ac-api-pagos-process-error');
    let caught;
    try {
      await el.procesarPago(0, 1);
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(html`<ac-api-pagos timeout="1" simulate-error></ac-api-pagos>`);
    const errorEvent = oneEvent(el, 'ac-api-pagos-list-error');
    let caught;
    try {
      await el.listarMetodosPago();
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
