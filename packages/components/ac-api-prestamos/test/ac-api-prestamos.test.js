import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastLoans() {
  return fixture(html`<ac-api-prestamos timeout="1"></ac-api-prestamos>`);
}

suite('ac-api-prestamos', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastLoans();
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('listarProductos devuelve los productos mock y dispara success', async () => {
    const el = await fastLoans();
    const [productos] = await Promise.all([
      el.listarProductos(),
      oneEvent(el, 'ac-api-prestamos-products-success'),
    ]);
    expect(productos).to.have.length(2);
  });

  test('listarProductos respeta la paginación', async () => {
    const el = await fastLoans();
    const productos = await el.listarProductos({ pagination: 1, page: 2 });
    expect(productos[0].id).to.equal(2);
  });

  test('simularPrestamo calcula la cuota estimada con interés simple', async () => {
    const el = await fastLoans();
    const [simulacion] = await Promise.all([
      el.simularPrestamo(1, 10000, 12),
      oneEvent(el, 'ac-api-prestamos-simulate-success'),
    ]);
    expect(simulacion.cuotaMonto).to.equal(983.33);
  });

  test('simularPrestamo con un producto inexistente dispara error', async () => {
    const el = await fastLoans();
    const errorEvent = oneEvent(el, 'ac-api-prestamos-simulate-error');
    el.simularPrestamo(999, 1000, 12).catch(() => {});
    const { detail } = await errorEvent;
    expect(detail.error.message).to.include('no existe');
  });

  test('simularPrestamo con monto mayor al máximo dispara error', async () => {
    const el = await fastLoans();
    const errorEvent = oneEvent(el, 'ac-api-prestamos-simulate-error');
    el.simularPrestamo(1, 999999, 12).catch(() => {});
    const { detail } = await errorEvent;
    expect(detail.error.message).to.include('supera el máximo');
  });

  test('simularPrestamo con plazo mayor al máximo dispara error', async () => {
    const el = await fastLoans();
    const errorEvent = oneEvent(el, 'ac-api-prestamos-simulate-error');
    el.simularPrestamo(1, 1000, 99).catch(() => {});
    const { detail } = await errorEvent;
    expect(detail.error.message).to.include('plazo');
  });

  test('solicitarPrestamo crea un préstamo activo y dispara success', async () => {
    const el = await fastLoans();
    const [prestamo] = await Promise.all([
      el.solicitarPrestamo(1, 5000, 6),
      oneEvent(el, 'ac-api-prestamos-request-success'),
    ]);
    expect(prestamo.estado).to.equal('activo');
  });

  test('solicitarPrestamo deja el préstamo visible en listarPrestamos', async () => {
    const el = await fastLoans();
    await el.solicitarPrestamo(1, 5000, 6);
    const prestamos = await el.listarPrestamos();
    expect(prestamos).to.have.length(2);
  });

  test('solicitarPrestamo con monto mayor al máximo dispara error', async () => {
    const el = await fastLoans();
    const errorEvent = oneEvent(el, 'ac-api-prestamos-request-error');
    el.solicitarPrestamo(1, 999999, 12).catch(() => {});
    const { detail } = await errorEvent;
    expect(detail.error.message).to.include('supera el máximo');
  });

  test('listarPrestamos filtra por estado', async () => {
    const el = await fastLoans();
    const prestamos = await el.listarPrestamos({ estado: 'pagado' });
    expect(prestamos).to.have.length(0);
  });

  test('listarPrestamos filtra por productoId', async () => {
    const el = await fastLoans();
    const prestamos = await el.listarPrestamos({ productoId: 1 });
    expect(prestamos).to.have.length(1);
  });

  test('pagarCuota incrementa las cuotas pagadas y dispara success', async () => {
    const el = await fastLoans();
    const [prestamo] = await Promise.all([
      el.pagarCuota(1),
      oneEvent(el, 'ac-api-prestamos-pay-success'),
    ]);
    expect(prestamo.cuotasPagadas).to.equal(4);
  });

  test('pagarCuota de la última cuota marca el préstamo como pagado', async () => {
    const el = await fastLoans();
    const prestamo = await el.solicitarPrestamo(1, 1000, 1);
    const pagado = await el.pagarCuota(prestamo.id);
    expect(pagado.estado).to.equal('pagado');
  });

  test('pagarCuota de un préstamo sin cuotas pendientes dispara error', async () => {
    const el = await fastLoans();
    const prestamo = await el.solicitarPrestamo(1, 1000, 1);
    await el.pagarCuota(prestamo.id);
    const errorEvent = oneEvent(el, 'ac-api-prestamos-pay-error');
    el.pagarCuota(prestamo.id).catch(() => {});
    const { detail } = await errorEvent;
    expect(detail.error.message).to.include('no tiene cuotas pendientes');
  });

  test('pagarCuota de un préstamo inexistente dispara error', async () => {
    const el = await fastLoans();
    const errorEvent = oneEvent(el, 'ac-api-prestamos-pay-error');
    el.pagarCuota(999).catch(() => {});
    const { detail } = await errorEvent;
    expect(detail.error.message).to.include('no existe');
  });

  test('obtenerCronograma devuelve una cuota por cada plazo del préstamo', async () => {
    const el = await fastLoans();
    const [cronograma] = await Promise.all([
      el.obtenerCronograma(1),
      oneEvent(el, 'ac-api-prestamos-schedule-success'),
    ]);
    expect(cronograma).to.have.length(12);
  });

  test('obtenerCronograma marca como pendiente las cuotas no pagadas', async () => {
    const el = await fastLoans();
    const cronograma = await el.obtenerCronograma(1);
    expect(cronograma[3].estado).to.equal('pendiente');
  });

  test('obtenerCronograma de un préstamo inexistente dispara error', async () => {
    const el = await fastLoans();
    const errorEvent = oneEvent(el, 'ac-api-prestamos-schedule-error');
    el.obtenerCronograma(999).catch(() => {});
    const { detail } = await errorEvent;
    expect(detail.error.message).to.include('no existe');
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(
      html`<ac-api-prestamos timeout="1" simulate-error></ac-api-prestamos>`,
    );
    const errorEvent = oneEvent(el, 'ac-api-prestamos-products-error');
    el.listarProductos().catch(() => {});
    const { detail } = await errorEvent;
    expect(detail.error.message).to.include('Error simulado');
  });
});
