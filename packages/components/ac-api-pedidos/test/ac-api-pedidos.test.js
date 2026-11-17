import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastOrders() {
  return fixture(html`<ac-api-pedidos timeout="1"></ac-api-pedidos>`);
}

suite('ac-api-pedidos', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastOrders();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('obtenerPedido resuelve el mock', async () => {
    const el = await fastOrders();
    const pedido = await el.obtenerPedido(1);
    expect(pedido.estado).to.equal('confirmado');
  });

  test('obtenerPedido con un id inexistente dispara error', async () => {
    const el = await fastOrders();
    const errorEvent = oneEvent(el, 'ac-api-pedidos-get-error');
    let caught;
    try {
      await el.obtenerPedido(999);
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });

  test('listarPedidos con `status` filtra por estado', async () => {
    const el = await fastOrders();
    const pedidos = await el.listarPedidos({ status: 'entregado' });
    expect(pedidos).to.have.lengthOf(1);
  });

  test('crearPedido agrega un pedido pendiente con total calculado', async () => {
    const el = await fastOrders();
    const pedido = await el.crearPedido([{ productoId: 1, cantidad: 2, precioUnitario: 10 }]);
    expect(pedido.estado).to.equal('pendiente');
    expect(pedido.total).to.equal(20);
  });

  test('crearPedido con carrito vacío dispara error de dominio', async () => {
    const el = await fastOrders();
    let caught;
    try {
      await el.crearPedido([]);
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('obtenerEstadoPedido devuelve el seguimiento con pasos', async () => {
    const el = await fastOrders();
    const estado = await el.obtenerEstadoPedido(1);
    expect(estado.seguimiento.pasos).to.have.lengthOf(4);
    expect(estado.seguimiento.pasos[1]).to.deep.equal({ paso: 'confirmado', completado: true });
  });

  test('cancelarPedido cambia el estado a cancelado', async () => {
    const el = await fastOrders();
    const pedido = await el.cancelarPedido(1);
    expect(pedido.estado).to.equal('cancelado');
  });

  test('cancelarPedido sobre un pedido entregado dispara error', async () => {
    const el = await fastOrders();
    let caught;
    try {
      await el.cancelarPedido(2);
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(html`<ac-api-pedidos timeout="1" simulate-error></ac-api-pedidos>`);
    const errorEvent = oneEvent(el, 'ac-api-pedidos-list-error');
    let caught;
    try {
      await el.listarPedidos();
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
