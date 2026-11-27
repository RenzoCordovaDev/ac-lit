import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastSeguros() {
  return fixture(html`<ac-api-seguros timeout="1"></ac-api-seguros>`);
}

suite('ac-api-seguros', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastSeguros();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
  });

  test('listarProductos devuelve el catálogo mock', async () => {
    const el = await fastSeguros();
    const [productos] = await Promise.all([
      el.listarProductos(),
      oneEvent(el, 'ac-api-seguros-products-success'),
    ]);
    expect(productos).to.deep.equal([
      { id: 1, nombre: 'Seguro de Vida', tipo: 'vida', primaMensual: 45 },
      { id: 2, nombre: 'Seguro Vehicular', tipo: 'vehicular', primaMensual: 120 },
      { id: 3, nombre: 'Seguro de Hogar', tipo: 'hogar', primaMensual: 60 },
      { id: 4, nombre: 'Seguro de Viaje', tipo: 'viaje', primaMensual: 25 },
    ]);
  });

  test('listarProductos filtra por tipo', async () => {
    const el = await fastSeguros();
    const productos = await el.listarProductos({ tipo: 'hogar' });
    expect(productos.map(producto => producto.id)).to.deep.equal([3]);
  });

  test('listarProductos ordena por prima mensual y pagina', async () => {
    const el = await fastSeguros();
    const productos = await el.listarProductos({
      sortBy: 'primaMensual',
      sortDir: 'desc',
      pagination: 1,
      page: 2,
    });
    expect(productos.map(producto => producto.id)).to.deep.equal([3]);
  });

  test('cotizar aplica el factor de riesgo a la prima mensual', async () => {
    const el = await fastSeguros();
    const [cotizacion] = await Promise.all([
      el.cotizar(1, { factorRiesgo: 1.5 }),
      oneEvent(el, 'ac-api-seguros-quote-success'),
    ]);
    expect(cotizacion).to.include({ productoId: 1, primaEstimada: 67.5 });
  });

  test('cotizar usa la prima mensual cuando no hay factor de riesgo', async () => {
    const el = await fastSeguros();
    const cotizacion = await el.cotizar(2, {});
    expect(cotizacion.primaEstimada).to.equal(120);
  });

  test('cotizar un producto inexistente dispara error', async () => {
    const el = await fastSeguros();
    const errorEvent = oneEvent(el, 'ac-api-seguros-quote-error');
    let caught;
    try {
      await el.cotizar(999, {});
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught?.message).to.equal('El producto 999 no existe en el mock');
  });

  test('contratarSeguro crea una póliza vigente con número autogenerado', async () => {
    const el = await fastSeguros();
    const [poliza] = await Promise.all([
      el.contratarSeguro(2, {}),
      oneEvent(el, 'ac-api-seguros-subscribe-success'),
    ]);
    expect(poliza).to.include({
      id: 2,
      productoId: 2,
      numeroPoliza: 'POL-0002',
      estado: 'vigente',
    });
  });

  test('contratarSeguro con un producto inexistente dispara error', async () => {
    const el = await fastSeguros();
    const errorEvent = oneEvent(el, 'ac-api-seguros-subscribe-error');
    let caught;
    try {
      await el.contratarSeguro(999, {});
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught?.message).to.equal('El producto 999 no existe en el mock');
  });

  test('listarPolizas devuelve la póliza mock', async () => {
    const el = await fastSeguros();
    const [polizas] = await Promise.all([
      el.listarPolizas(),
      oneEvent(el, 'ac-api-seguros-policies-success'),
    ]);
    expect(polizas).to.deep.equal([
      {
        id: 1,
        productoId: 1,
        numeroPoliza: 'POL-0001',
        vigenciaDesde: '2024-01-01',
        vigenciaHasta: '2025-01-01',
        estado: 'vigente',
      },
    ]);
  });

  test('listarPolizas filtra por estado, ordena y pagina después de contratar y cancelar', async () => {
    const el = await fastSeguros();
    await el.contratarSeguro(2, {});
    const poliza = await el.contratarSeguro(3, {});
    await el.cancelarPoliza(1, 'Solicitud del cliente');
    await el.cancelarPoliza(poliza.id, 'Solicitud del cliente');

    const polizas = await el.listarPolizas({
      estado: 'cancelada',
      sortBy: 'id',
      sortDir: 'desc',
      pagination: 1,
      page: 2,
    });
    expect(polizas.map(item => item.id)).to.deep.equal([1]);
  });

  test('listarPolizas filtra por productoId', async () => {
    const el = await fastSeguros();
    await el.contratarSeguro(2, {});
    const polizas = await el.listarPolizas({ productoId: 2 });
    expect(polizas.map(item => item.numeroPoliza)).to.deep.equal(['POL-0002']);
  });

  test('cancelarPoliza actualiza el estado y guarda el motivo', async () => {
    const el = await fastSeguros();
    const motivo = 'Solicitud del cliente';
    const [poliza] = await Promise.all([
      el.cancelarPoliza(1, motivo),
      oneEvent(el, 'ac-api-seguros-cancel-success'),
    ]);
    expect(poliza).to.include({ id: 1, estado: 'cancelada', motivoCancelacion: motivo });
  });

  test('cancelarPoliza con una póliza inexistente dispara error', async () => {
    const el = await fastSeguros();
    const errorEvent = oneEvent(el, 'ac-api-seguros-cancel-error');
    let caught;
    try {
      await el.cancelarPoliza(999, 'Solicitud del cliente');
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught?.message).to.equal('La póliza 999 no existe en el mock');
  });

  test('cancelarPoliza con una póliza ya cancelada dispara error', async () => {
    const el = await fastSeguros();
    await el.cancelarPoliza(1, 'Solicitud del cliente');
    const errorEvent = oneEvent(el, 'ac-api-seguros-cancel-error');
    let caught;
    try {
      await el.cancelarPoliza(1, 'Solicitud del cliente');
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught?.message).to.equal('La póliza 1 ya está cancelada');
  });

  test('cada instancia conserva su propio estado de pólizas', async () => {
    const el = await fastSeguros();
    await el.cancelarPoliza(1, 'Solicitud del cliente');
    const otraInstancia = await fastSeguros();
    const [poliza] = await otraInstancia.listarPolizas();
    expect(poliza.estado).to.equal('vigente');
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(html`<ac-api-seguros timeout="1" simulate-error></ac-api-seguros>`);
    const errorEvent = oneEvent(el, 'ac-api-seguros-quote-error');
    let caught;
    try {
      await el.cotizar(1, {});
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
