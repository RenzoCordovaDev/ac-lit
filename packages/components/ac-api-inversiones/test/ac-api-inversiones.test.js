import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastInversiones() {
  return fixture(html`<ac-api-inversiones timeout="1"></ac-api-inversiones>`);
}

async function capturarError(promesa) {
  try {
    await promesa;
  } catch (error) {
    return error;
  }
  return undefined;
}

suite('ac-api-inversiones', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastInversiones();
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('listarProductos devuelve los productos mock', async () => {
    const el = await fastInversiones();
    const [productos] = await Promise.all([
      el.listarProductos(),
      oneEvent(el, 'ac-api-inversiones-products-success'),
    ]);
    expect(productos).to.have.length(2);
  });

  test('listarProductos filtra por tipo', async () => {
    const el = await fastInversiones();
    const productos = await el.listarProductos({ tipo: 'plazo_fijo' });
    expect(productos.map(p => p.id)).to.deep.equal([1]);
  });

  test('listarProductos con un tipo inexistente devuelve lista vacía', async () => {
    const el = await fastInversiones();
    const productos = await el.listarProductos({ tipo: 'cripto' });
    expect(productos).to.be.empty;
  });

  test('simularRentabilidad calcula la rentabilidad proporcional al plazo', async () => {
    const el = await fastInversiones();
    const resultado = await el.simularRentabilidad(1, 1000, 365);
    expect(resultado.rentabilidad).to.equal(65);
  });

  test('simularRentabilidad devuelve el monto final', async () => {
    const el = await fastInversiones();
    const resultado = await el.simularRentabilidad(1, 1000, 365);
    expect(resultado.montoFinal).to.equal(1065);
  });

  test('simularRentabilidad con un monto menor al mínimo dispara error', async () => {
    const el = await fastInversiones();
    const error = await capturarError(el.simularRentabilidad(1, 100, 90));
    expect(error?.message).to.include('monto mínimo');
  });

  test('simularRentabilidad con un producto inexistente dispara error', async () => {
    const el = await fastInversiones();
    const error = await capturarError(el.simularRentabilidad(999, 1000, 90));
    expect(error?.message).to.include('no existe');
  });

  test('suscribirInversion crea una inversión activa', async () => {
    const el = await fastInversiones();
    const inversion = await el.suscribirInversion(1, 1000);
    expect(inversion.estado).to.equal('activa');
  });

  test('suscribirInversion con plazo fijo calcula el vencimiento', async () => {
    const el = await fastInversiones();
    const inversion = await el.suscribirInversion(1, 1000);
    expect(inversion.fechaVencimiento).to.be.a('string');
  });

  test('suscribirInversion en un fondo mutuo deja fechaVencimiento en null', async () => {
    const el = await fastInversiones();
    const inversion = await el.suscribirInversion(2, 500);
    expect(inversion.fechaVencimiento).to.be.null;
  });

  test('suscribirInversion con un monto menor al mínimo dispara error', async () => {
    const el = await fastInversiones();
    const error = await capturarError(el.suscribirInversion(2, 50));
    expect(error?.message).to.include('monto mínimo');
  });

  test('listarInversiones devuelve la inversión semilla', async () => {
    const el = await fastInversiones();
    const inversiones = await el.listarInversiones();
    expect(inversiones).to.have.length(1);
  });

  test('listarInversiones filtra por estado', async () => {
    const el = await fastInversiones();
    const inversiones = await el.listarInversiones({ estado: 'rescatada' });
    expect(inversiones).to.be.empty;
  });

  test('rescatarInversion marca la inversión como rescatada', async () => {
    const el = await fastInversiones();
    const resultado = await el.rescatarInversion(1);
    expect(resultado.estado).to.equal('rescatada');
  });

  test('rescatarInversion calcula el monto final con rentabilidad', async () => {
    const el = await fastInversiones();
    const resultado = await el.rescatarInversion(1);
    expect(resultado.montoFinal).to.be.greaterThan(1000);
  });

  test('rescatarInversion de una inversión ya rescatada dispara error', async () => {
    const el = await fastInversiones();
    await el.rescatarInversion(1);
    const error = await capturarError(el.rescatarInversion(1));
    expect(error?.message).to.include('ya fue rescatada');
  });

  test('rescatarInversion de una inversión inexistente dispara error', async () => {
    const el = await fastInversiones();
    const error = await capturarError(el.rescatarInversion(999));
    expect(error?.message).to.include('no existe');
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(
      html`<ac-api-inversiones timeout="1" simulate-error></ac-api-inversiones>`,
    );
    const [error] = await Promise.all([
      capturarError(el.listarProductos()),
      oneEvent(el, 'ac-api-inversiones-products-error'),
    ]);
    expect(error).to.exist;
  });
});
