import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastCart() {
  return fixture(html`<ac-api-carrito timeout="1"></ac-api-carrito>`);
}

const SAMPLE_ITEM = { productoId: 1, nombre: 'Laptop', precio: 100, cantidad: 2 };

suite('ac-api-carrito', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastCart();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('empieza vacío', async () => {
    const el = await fastCart();
    const items = await el.listarItems();
    expect(items).to.have.lengthOf(0);
  });

  test('agregarItem agrega un ítem nuevo', async () => {
    const el = await fastCart();
    const items = await el.agregarItem(SAMPLE_ITEM);
    expect(items).to.have.lengthOf(1);
    expect(items[0].subtotal).to.equal(200);
  });

  test('agregarItem con el mismo producto suma la cantidad', async () => {
    const el = await fastCart();
    await el.agregarItem(SAMPLE_ITEM);
    const items = await el.agregarItem({ ...SAMPLE_ITEM, cantidad: 3 });
    expect(items).to.have.lengthOf(1);
    expect(items[0].cantidad).to.equal(5);
  });

  test('agregarItem sin datos obligatorios dispara error', async () => {
    const el = await fastCart();
    const errorEvent = oneEvent(el, 'ac-api-carrito-add-error');
    let caught;
    try {
      await el.agregarItem({});
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });

  test('quitarItem elimina el ítem del carrito', async () => {
    const el = await fastCart();
    await el.agregarItem(SAMPLE_ITEM);
    const items = await el.quitarItem(1);
    expect(items).to.have.lengthOf(0);
  });

  test('actualizarCantidad cambia la cantidad de un ítem existente', async () => {
    const el = await fastCart();
    await el.agregarItem(SAMPLE_ITEM);
    const item = await el.actualizarCantidad(1, 10);
    expect(item.cantidad).to.equal(10);
  });

  test('actualizarCantidad con 0 dispara error', async () => {
    const el = await fastCart();
    await el.agregarItem(SAMPLE_ITEM);
    let caught;
    try {
      await el.actualizarCantidad(1, 0);
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('vaciarCarrito deja el carrito vacío', async () => {
    const el = await fastCart();
    await el.agregarItem(SAMPLE_ITEM);
    const resultado = await el.vaciarCarrito();
    expect(resultado).to.deep.equal({ cleared: true });
    const items = await el.listarItems();
    expect(items).to.have.lengthOf(0);
  });

  test('obtenerResumen calcula subtotal, impuestos y total', async () => {
    const el = await fastCart();
    await el.agregarItem(SAMPLE_ITEM);
    const resumen = await el.obtenerResumen();
    expect(resumen.subtotal).to.equal(200);
    expect(resumen.impuestos).to.equal(36);
    expect(resumen.total).to.equal(236);
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(html`<ac-api-carrito timeout="1" simulate-error></ac-api-carrito>`);
    const errorEvent = oneEvent(el, 'ac-api-carrito-list-error');
    let caught;
    try {
      await el.listarItems();
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
