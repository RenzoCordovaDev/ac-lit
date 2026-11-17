import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastAddresses() {
  return fixture(html`<ac-api-direcciones timeout="1"></ac-api-direcciones>`);
}

suite('ac-api-direcciones', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastAddresses();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('listarDirecciones devuelve el arreglo completo por defecto', async () => {
    const el = await fastAddresses();
    const addresses = await el.listarDirecciones();
    expect(addresses).to.have.lengthOf(2);
  });

  test('obtenerDireccion con un id inexistente dispara error', async () => {
    const el = await fastAddresses();
    const errorEvent = oneEvent(el, 'ac-api-direcciones-get-error');
    let caught;
    try {
      await el.obtenerDireccion(999);
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });

  test('agregarDireccion agrega una dirección nueva, no predeterminada', async () => {
    const el = await fastAddresses();
    const nueva = await el.agregarDireccion({ linea1: 'Calle X', ciudad: 'Arequipa' });
    expect(nueva.predeterminada).to.be.false;
  });

  test('agregarDireccion sin datos obligatorios dispara error', async () => {
    const el = await fastAddresses();
    let caught;
    try {
      await el.agregarDireccion({});
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('marcarPredeterminada deja una sola dirección predeterminada', async () => {
    const el = await fastAddresses();
    const addresses = await el.marcarPredeterminada(2);
    expect(addresses.filter(a => a.predeterminada)).to.have.lengthOf(1);
    expect(addresses.find(a => a.id === 2).predeterminada).to.be.true;
  });

  test('eliminarDireccion promueve otra a predeterminada si era la actual', async () => {
    const el = await fastAddresses();
    await el.eliminarDireccion(1);
    const addresses = await el.listarDirecciones();
    expect(addresses.find(a => a.id === 2).predeterminada).to.be.true;
  });

  test('actualizarDireccion mezcla los cambios sobre la dirección existente', async () => {
    const el = await fastAddresses();
    const actualizada = await el.actualizarDireccion(2, { ciudad: 'Cusco' });
    expect(actualizada.ciudad).to.equal('Cusco');
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(
      html`<ac-api-direcciones timeout="1" simulate-error></ac-api-direcciones>`,
    );
    const errorEvent = oneEvent(el, 'ac-api-direcciones-list-error');
    let caught;
    try {
      await el.listarDirecciones();
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
