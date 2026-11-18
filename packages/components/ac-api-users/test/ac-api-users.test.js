import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastUsers() {
  return fixture(html`<ac-api-users timeout="1"></ac-api-users>`);
}

suite('ac-api-users', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastUsers();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('expone version/timeout/simulateError con sus defaults', async () => {
    const el = await fixture(html`<ac-api-users></ac-api-users>`);
    expect(el.version).to.equal('v1');
    expect(el.timeout).to.equal(3000);
    expect(el.simulateError).to.be.false;
  });

  test('obtenerDatosUsuario resuelve el mock y dispara el evento de éxito', async () => {
    const el = await fastUsers();
    const [user] = await Promise.all([
      el.obtenerDatosUsuario(1),
      oneEvent(el, 'ac-api-users-get-user-success'),
    ]);
    expect(user).to.include({ id: 1, nombre: 'Ana Torres' });
  });

  test('obtenerDatosUsuario con un id inexistente dispara el evento de error y rechaza', async () => {
    const el = await fastUsers();
    const errorEvent = oneEvent(el, 'ac-api-users-get-user-error');

    let caught;
    try {
      await el.obtenerDatosUsuario(999);
    } catch (error) {
      caught = error;
    }
    const event = await errorEvent;

    expect(caught).to.exist;
    expect(event.detail.method).to.equal('obtenerDatosUsuario');
  });

  test('listarUsuarios devuelve el arreglo completo por defecto', async () => {
    const el = await fastUsers();
    const users = await el.listarUsuarios();
    expect(users).to.have.lengthOf(8);
  });

  test('listarUsuarios con `pagination` recorta el arreglo', async () => {
    const el = await fastUsers();
    const users = await el.listarUsuarios({ pagination: 3 });
    expect(users).to.have.lengthOf(3);
  });

  test('listarUsuarios con `fields` proyecta solo esas claves', async () => {
    const el = await fastUsers();
    const [user] = await el.listarUsuarios({ pagination: 1, fields: ['id', 'nombre'] });
    expect(Object.keys(user).sort()).to.deep.equal(['id', 'nombre']);
  });

  test('buscarUsuarios filtra por nombre o email (case-insensitive)', async () => {
    const el = await fastUsers();
    const users = await el.buscarUsuarios('torres');
    expect(users).to.have.lengthOf(1);
    expect(users[0].nombre).to.equal('Ana Torres');
  });

  test('obtenerPerfilUsuario devuelve datos anidados', async () => {
    const el = await fastUsers();
    const perfil = await el.obtenerPerfilUsuario(1);
    expect(perfil.contacto).to.have.property('email');
    expect(perfil.direccion).to.have.property('ciudad', 'Lima');
  });

  test('registrarUsuario agrega un usuario nuevo con id autogenerado', async () => {
    const el = await fastUsers();
    const nuevo = await el.registrarUsuario({ nombre: 'Test User', email: 'test@mail.com' });
    expect(nuevo.id).to.equal(9);
    const lista = await el.listarUsuarios();
    expect(lista).to.have.lengthOf(9);
  });

  test('registrarUsuario sin nombre/email dispara error de dominio', async () => {
    const el = await fastUsers();
    let caught;
    try {
      await el.registrarUsuario({});
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('actualizarUsuario mezcla los cambios sobre el usuario existente', async () => {
    const el = await fastUsers();
    const actualizado = await el.actualizarUsuario(2, { nombre: 'Luis Editado' });
    expect(actualizado.nombre).to.equal('Luis Editado');
    expect(actualizado.id).to.equal(2);
  });

  test('eliminarUsuario quita el usuario del mock', async () => {
    const el = await fastUsers();
    const resultado = await el.eliminarUsuario(3);
    expect(resultado).to.deep.equal({ id: 3, deleted: true });
    const lista = await el.listarUsuarios();
    expect(lista.find(u => u.id === 3)).to.be.undefined;
  });

  test('validarCredenciales devuelve token con password válido', async () => {
    const el = await fastUsers();
    const { token, user } = await el.validarCredenciales('ana.torres@mail.com', '1234');
    expect(token).to.be.a('string');
    expect(user.id).to.equal(1);
  });

  test('validarCredenciales rechaza con password inválido', async () => {
    const el = await fastUsers();
    let caught;
    try {
      await el.validarCredenciales('ana.torres@mail.com', '12');
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(html`<ac-api-users timeout="1" simulate-error></ac-api-users>`);
    const errorEvent = oneEvent(el, 'ac-api-users-list-error');

    let caught;
    try {
      await el.listarUsuarios();
    } catch (error) {
      caught = error;
    }
    await errorEvent;

    expect(caught).to.exist;
  });
});
