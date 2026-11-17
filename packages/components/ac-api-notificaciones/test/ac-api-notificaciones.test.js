import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastNotifications() {
  return fixture(html`<ac-api-notificaciones timeout="1"></ac-api-notificaciones>`);
}

suite('ac-api-notificaciones', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastNotifications();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('listarNotificaciones devuelve el arreglo completo por defecto, ordenado por fecha desc', async () => {
    const el = await fastNotifications();
    const notifications = await el.listarNotificaciones();
    expect(notifications).to.have.lengthOf(3);
    expect(notifications[0].id).to.equal(1);
  });

  test('listarNotificaciones con `leida: false` filtra las no leídas', async () => {
    const el = await fastNotifications();
    const notifications = await el.listarNotificaciones({ leida: false });
    expect(notifications).to.have.lengthOf(2);
  });

  test('obtenerNotificacion con un id inexistente dispara error', async () => {
    const el = await fastNotifications();
    const errorEvent = oneEvent(el, 'ac-api-notificaciones-get-error');
    let caught;
    try {
      await el.obtenerNotificacion(999);
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });

  test('enviarNotificacion agrega una nueva no leída', async () => {
    const el = await fastNotifications();
    const nueva = await el.enviarNotificacion({ titulo: 'Hola', mensaje: 'Mensaje de prueba' });
    expect(nueva.leida).to.be.false;
    expect(nueva.id).to.equal(4);
  });

  test('enviarNotificacion sin titulo/mensaje dispara error de dominio', async () => {
    const el = await fastNotifications();
    let caught;
    try {
      await el.enviarNotificacion({});
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('marcarLeida actualiza el flag leida', async () => {
    const el = await fastNotifications();
    const actualizada = await el.marcarLeida(1);
    expect(actualizada.leida).to.be.true;
  });

  test('eliminarNotificacion quita la notificación del mock', async () => {
    const el = await fastNotifications();
    const resultado = await el.eliminarNotificacion(3);
    expect(resultado).to.deep.equal({ id: 3, deleted: true });
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(
      html`<ac-api-notificaciones timeout="1" simulate-error></ac-api-notificaciones>`,
    );
    const errorEvent = oneEvent(el, 'ac-api-notificaciones-list-error');
    let caught;
    try {
      await el.listarNotificaciones();
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
