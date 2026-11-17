import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastOps() {
  return fixture(html`<ac-api-operaciones timeout="1"></ac-api-operaciones>`);
}

suite('ac-api-operaciones', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastOps();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('consultarSaldo devuelve el saldo mock', async () => {
    const el = await fastOps();
    const [saldo] = await Promise.all([
      el.consultarSaldo(1),
      oneEvent(el, 'ac-api-operaciones-balance-success'),
    ]);
    expect(saldo).to.include({ cuentaId: 1, saldo: 2500 });
  });

  test('consultarSaldo con una cuenta inexistente dispara error', async () => {
    const el = await fastOps();
    const errorEvent = oneEvent(el, 'ac-api-operaciones-balance-error');
    let caught;
    try {
      await el.consultarSaldo(999);
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });

  test('depositar incrementa el saldo y queda en el historial', async () => {
    const el = await fastOps();
    const cuenta = await el.depositar(1, 100);
    expect(cuenta.saldo).to.equal(2600);
    const historial = await el.obtenerHistorial(1);
    expect(historial.some(m => m.tipo === 'deposito')).to.be.true;
  });

  test('retirar sin saldo suficiente dispara error', async () => {
    const el = await fastOps();
    let caught;
    try {
      await el.retirar(1, 999999);
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('transferir mueve dinero entre cuentas', async () => {
    const el = await fastOps();
    const resultado = await el.transferir(2, 1, 500);
    expect(resultado.origen.saldo).to.equal(7500);
    expect(resultado.destino.saldo).to.equal(3000);
  });

  test('comprar debita la cuenta principal según el precio mock', async () => {
    const el = await fastOps();
    const resultado = await el.comprar(2, 2);
    expect(resultado.total).to.equal(159.8);
    expect(resultado.estado).to.equal('aprobada');
  });

  test('comprar un producto inexistente dispara error', async () => {
    const el = await fastOps();
    let caught;
    try {
      await el.comprar(999, 1);
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(
      html`<ac-api-operaciones timeout="1" simulate-error></ac-api-operaciones>`,
    );
    const errorEvent = oneEvent(el, 'ac-api-operaciones-balance-error');
    let caught;
    try {
      await el.consultarSaldo(1);
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
