import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastProducts() {
  return fixture(html`<ac-api-productos timeout="1"></ac-api-productos>`);
}

suite('ac-api-productos', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastProducts();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('obtenerProducto resuelve el mock y dispara el evento de éxito', async () => {
    const el = await fastProducts();
    const [product] = await Promise.all([
      el.obtenerProducto(1),
      oneEvent(el, 'ac-api-productos-get-product-success'),
    ]);
    expect(product).to.include({ id: 1, nombre: 'Laptop Pro 14"' });
  });

  test('obtenerProducto con un id inexistente dispara el evento de error y rechaza', async () => {
    const el = await fastProducts();
    const errorEvent = oneEvent(el, 'ac-api-productos-get-product-error');
    let caught;
    try {
      await el.obtenerProducto(999);
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });

  test('listarProductos devuelve el arreglo completo por defecto', async () => {
    const el = await fastProducts();
    const products = await el.listarProductos();
    expect(products).to.have.lengthOf(8);
  });

  test('listarProductos con `category` filtra por categoría', async () => {
    const el = await fastProducts();
    const products = await el.listarProductos({ category: 'ropa' });
    expect(products).to.have.lengthOf(2);
  });

  test('buscarProductos filtra por nombre (case-insensitive)', async () => {
    const el = await fastProducts();
    const products = await el.buscarProductos('laptop');
    expect(products).to.have.lengthOf(1);
  });

  test('obtenerDetalleProducto devuelve datos anidados', async () => {
    const el = await fastProducts();
    const detalle = await el.obtenerDetalleProducto(1);
    expect(detalle.especificaciones).to.have.property('peso');
    expect(detalle.inventario).to.have.property('stock', 12);
  });

  test('registrarProducto agrega un producto nuevo con id autogenerado', async () => {
    const el = await fastProducts();
    const nuevo = await el.registrarProducto({ nombre: 'Teclado', precio: 150 });
    expect(nuevo.id).to.equal(9);
  });

  test('registrarProducto sin nombre/precio dispara error de dominio', async () => {
    const el = await fastProducts();
    let caught;
    try {
      await el.registrarProducto({});
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('actualizarProducto mezcla los cambios sobre el producto existente', async () => {
    const el = await fastProducts();
    const actualizado = await el.actualizarProducto(2, { precio: 59.9 });
    expect(actualizado.precio).to.equal(59.9);
  });

  test('eliminarProducto quita el producto del mock', async () => {
    const el = await fastProducts();
    const resultado = await el.eliminarProducto(3);
    expect(resultado).to.deep.equal({ id: 3, deleted: true });
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(
      html`<ac-api-productos timeout="1" simulate-error></ac-api-productos>`,
    );
    const errorEvent = oneEvent(el, 'ac-api-productos-list-error');
    let caught;
    try {
      await el.listarProductos();
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
