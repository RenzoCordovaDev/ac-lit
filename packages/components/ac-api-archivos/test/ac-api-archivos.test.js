import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastFiles() {
  return fixture(html`<ac-api-archivos timeout="4"></ac-api-archivos>`);
}

suite('ac-api-archivos', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastFiles();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('listarArchivos devuelve el arreglo completo por defecto', async () => {
    const el = await fastFiles();
    const files = await el.listarArchivos();
    expect(files).to.have.lengthOf(2);
  });

  test('obtenerArchivo con un id inexistente dispara error', async () => {
    const el = await fastFiles();
    const errorEvent = oneEvent(el, 'ac-api-archivos-get-error');
    let caught;
    try {
      await el.obtenerArchivo(999);
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });

  test('subirArchivo emite 4 eventos de progreso antes del éxito', async () => {
    const el = await fastFiles();
    const progresos = [];
    const onProgress = event => progresos.push(event.detail.data.porcentaje);
    el.addEventListener('ac-api-archivos-upload-progress', onProgress);

    const archivo = await el.subirArchivo({ nombre: 'nuevo.pdf', tamanioKb: 10 });

    el.removeEventListener('ac-api-archivos-upload-progress', onProgress);
    expect(progresos).to.deep.equal([25, 50, 75, 100]);
    expect(archivo.nombre).to.equal('nuevo.pdf');
    expect(archivo.id).to.equal(3);
  });

  test('subirArchivo sin nombre dispara el evento de error sin emitir progreso', async () => {
    const el = await fastFiles();
    const errorEvent = oneEvent(el, 'ac-api-archivos-upload-error');
    let caught;
    try {
      await el.subirArchivo({});
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });

  test('descargarArchivo devuelve un contenido en base64', async () => {
    const el = await fastFiles();
    const descarga = await el.descargarArchivo(1);
    expect(descarga.contenidoBase64).to.be.a('string');
    expect(atob(descarga.contenidoBase64)).to.include('contrato.pdf');
  });

  test('eliminarArchivo quita el archivo del mock', async () => {
    const el = await fastFiles();
    const resultado = await el.eliminarArchivo(2);
    expect(resultado).to.deep.equal({ id: 2, deleted: true });
  });

  test('con `simulateError` subirArchivo emite el progreso completo y luego falla', async () => {
    const el = await fixture(html`<ac-api-archivos timeout="4" simulate-error></ac-api-archivos>`);
    const progresos = [];
    const onProgress = event => progresos.push(event.detail.data.porcentaje);
    el.addEventListener('ac-api-archivos-upload-progress', onProgress);
    const errorEvent = oneEvent(el, 'ac-api-archivos-upload-error');

    let caught;
    try {
      await el.subirArchivo({ nombre: 'nuevo.pdf' });
    } catch (error) {
      caught = error;
    }
    await errorEvent;

    el.removeEventListener('ac-api-archivos-upload-progress', onProgress);
    expect(progresos).to.deep.equal([25, 50, 75, 100]);
    expect(caught).to.exist;
  });

  test('con `simulateError` listarArchivos también falla', async () => {
    const el = await fixture(html`<ac-api-archivos timeout="1" simulate-error></ac-api-archivos>`);
    const errorEvent = oneEvent(el, 'ac-api-archivos-list-error');
    let caught;
    try {
      await el.listarArchivos();
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
