import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastAuth() {
  return fixture(html`<ac-api-auth timeout="1"></ac-api-auth>`);
}

suite('ac-api-auth', () => {
  test('no renderiza ningún contenido', async () => {
    const el = await fastAuth();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('iniciarSesion con credenciales válidas devuelve token y usuario', async () => {
    const el = await fastAuth();
    const { token, usuario } = await el.iniciarSesion('ana.torres@mail.com', '1234');
    expect(token).to.be.a('string');
    expect(usuario.id).to.equal(1);
  });

  test('iniciarSesion con clave inválida dispara el evento de error', async () => {
    const el = await fastAuth();
    const errorEvent = oneEvent(el, 'ac-api-auth-login-error');
    let caught;
    try {
      await el.iniciarSesion('ana.torres@mail.com', 'mala-clave');
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });

  test('validarSesion con un token recién creado es válida', async () => {
    const el = await fastAuth();
    const { token } = await el.iniciarSesion('ana.torres@mail.com', '1234');
    const resultado = await el.validarSesion(token);
    expect(resultado.valid).to.be.true;
  });

  test('validarSesion con un token inexistente dispara error', async () => {
    const el = await fastAuth();
    let caught;
    try {
      await el.validarSesion('token-falso');
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('cerrarSesion invalida el token', async () => {
    const el = await fastAuth();
    const { token } = await el.iniciarSesion('ana.torres@mail.com', '1234');
    await el.cerrarSesion(token);
    let caught;
    try {
      await el.validarSesion(token);
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('refrescarToken invalida el token viejo y entrega uno nuevo', async () => {
    const el = await fastAuth();
    const { token } = await el.iniciarSesion('ana.torres@mail.com', '1234');
    const refrescado = await el.refrescarToken(token);
    expect(refrescado.token).to.not.equal(token);
    let caught;
    try {
      await el.validarSesion(token);
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('registrarCuenta crea una cuenta nueva y la deja autenticada', async () => {
    const el = await fastAuth();
    const { usuario } = await el.registrarCuenta({
      nombre: 'Nueva Cuenta',
      email: 'nueva@mail.com',
      clave: 'xyz1',
    });
    expect(usuario.id).to.equal(3);
  });

  test('registrarCuenta con un email ya existente dispara error', async () => {
    const el = await fastAuth();
    let caught;
    try {
      await el.registrarCuenta({ nombre: 'Dup', email: 'ana.torres@mail.com', clave: 'xyz1' });
    } catch (error) {
      caught = error;
    }
    expect(caught).to.exist;
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(html`<ac-api-auth timeout="1" simulate-error></ac-api-auth>`);
    const errorEvent = oneEvent(el, 'ac-api-auth-login-error');
    let caught;
    try {
      await el.iniciarSesion('ana.torres@mail.com', '1234');
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
