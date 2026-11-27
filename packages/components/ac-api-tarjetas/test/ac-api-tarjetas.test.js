import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastTarjetas() {
  return fixture(html`<ac-api-tarjetas timeout="1"></ac-api-tarjetas>`);
}

async function mensajesDeError(el, nombreEvento, llamar) {
  const [evento, rechazo] = await Promise.all([
    oneEvent(el, nombreEvento),
    llamar().catch(error => error),
  ]);
  return [rechazo?.message, evento.detail.error.message];
}

suite('ac-api-tarjetas', () => {
  test('no renderiza elementos', async () => {
    const el = await fastTarjetas();
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('no renderiza texto', async () => {
    const el = await fastTarjetas();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
  });

  test('listarTarjetas devuelve las tarjetas mock y dispara su evento de éxito', async () => {
    const el = await fastTarjetas();
    const [tarjetas, evento] = await Promise.all([
      el.listarTarjetas(),
      oneEvent(el, 'ac-api-tarjetas-list-success'),
    ]);
    const tarjetasMock = [
      {
        id: 1,
        cuentaId: 1,
        tipo: 'debito',
        marca: 'Visa',
        ultimos4: '4321',
        titular: 'Cliente Demo',
        estado: 'activa',
      },
      {
        id: 2,
        cuentaId: 2,
        tipo: 'credito',
        marca: 'Mastercard',
        ultimos4: '8765',
        titular: 'Cliente Demo',
        estado: 'activa',
        lineaCredito: 5000,
        disponible: 3200,
      },
    ];
    expect([tarjetas, evento.detail.data]).to.deep.equal([tarjetasMock, tarjetasMock]);
  });

  test('listarTarjetas filtra por estado y tipo antes de ordenar y paginar', async () => {
    const el = await fastTarjetas();
    const otraTarjeta = await el.solicitarTarjeta(1, 'debito');
    await el.solicitarTarjeta(1, 'debito');
    await el.bloquearTarjeta(1, 'Prueba');
    await el.bloquearTarjeta(2, 'Prueba');
    await el.bloquearTarjeta(otraTarjeta.id, 'Prueba');
    const tarjetas = await el.listarTarjetas({
      estado: 'bloqueada',
      tipo: 'debito',
      sortBy: 'id',
      sortDir: 'desc',
      pagination: 1,
      page: 2,
    });
    expect(tarjetas.map(tarjeta => tarjeta.id)).to.deep.equal([1]);
  });

  test('solicitarTarjeta crea una tarjeta de crédito activa y dispara su evento de éxito', async () => {
    const el = await fastTarjetas();
    const [tarjeta, evento] = await Promise.all([
      el.solicitarTarjeta(2, 'credito'),
      oneEvent(el, 'ac-api-tarjetas-request-success'),
    ]);
    const tarjetaEsperada = {
      id: 3,
      cuentaId: 2,
      tipo: 'credito',
      marca: 'Visa',
      ultimos4: tarjeta.ultimos4,
      titular: 'Cliente Demo',
      estado: 'activa',
      lineaCredito: 5000,
      disponible: 5000,
    };
    expect([tarjeta, evento.detail.data]).to.deep.equal([tarjetaEsperada, tarjetaEsperada]);
  });

  test('solicitarTarjeta genera los cuatro últimos dígitos como texto', async () => {
    const el = await fastTarjetas();
    const tarjeta = await el.solicitarTarjeta(1, 'debito');
    expect(tarjeta.ultimos4).to.match(/^\d{4}$/);
  });

  test('solicitarTarjeta no valida la cuenta, solo el tipo', async () => {
    const el = await fastTarjetas();
    const tarjeta = await el.solicitarTarjeta(999, 'debito');
    expect(tarjeta.cuentaId).to.equal(999);
  });

  test('solicitarTarjeta con un tipo desconocido dispara error', async () => {
    const el = await fastTarjetas();
    const mensajes = await mensajesDeError(el, 'ac-api-tarjetas-request-error', () =>
      el.solicitarTarjeta(1, 'desconocido'),
    );
    const mensaje = 'El tipo de tarjeta desconocido no existe en el mock';
    expect(mensajes).to.deep.equal([mensaje, mensaje]);
  });

  test('bloquearTarjeta bloquea la tarjeta y dispara su evento de éxito', async () => {
    const el = await fastTarjetas();
    const [tarjeta, evento] = await Promise.all([
      el.bloquearTarjeta(1, 'Extravío'),
      oneEvent(el, 'ac-api-tarjetas-block-success'),
    ]);
    expect([tarjeta.estado, evento.detail.data.estado]).to.deep.equal(['bloqueada', 'bloqueada']);
  });

  test('bloquearTarjeta con una tarjeta ya bloqueada dispara error', async () => {
    const el = await fastTarjetas();
    await el.bloquearTarjeta(1, 'Extravío');
    const mensajes = await mensajesDeError(el, 'ac-api-tarjetas-block-error', () =>
      el.bloquearTarjeta(1, 'Extravío'),
    );
    const mensaje = 'La tarjeta 1 ya está bloqueada';
    expect(mensajes).to.deep.equal([mensaje, mensaje]);
  });

  test('desbloquearTarjeta vuelve a activar la tarjeta y dispara su evento de éxito', async () => {
    const el = await fastTarjetas();
    await el.bloquearTarjeta(1, 'Extravío');
    const [tarjeta, evento] = await Promise.all([
      el.desbloquearTarjeta(1),
      oneEvent(el, 'ac-api-tarjetas-unblock-success'),
    ]);
    expect([tarjeta.estado, evento.detail.data.estado]).to.deep.equal(['activa', 'activa']);
  });

  test('desbloquearTarjeta con una tarjeta activa dispara error', async () => {
    const el = await fastTarjetas();
    const mensajes = await mensajesDeError(el, 'ac-api-tarjetas-unblock-error', () =>
      el.desbloquearTarjeta(1),
    );
    const mensaje = 'La tarjeta 1 no está bloqueada';
    expect(mensajes).to.deep.equal([mensaje, mensaje]);
  });

  test('cambiarPin confirma el cambio simulado y dispara su evento de éxito', async () => {
    const el = await fastTarjetas();
    const [resultado, evento] = await Promise.all([
      el.cambiarPin(1, '1234', '5678'),
      oneEvent(el, 'ac-api-tarjetas-pin-success'),
    ]);
    const confirmacion = { tarjetaId: 1, estado: 'actualizado' };
    expect([resultado, evento.detail.data]).to.deep.equal([confirmacion, confirmacion]);
  });

  test('cambiarPin con un PIN actual incorrecto dispara error', async () => {
    const el = await fastTarjetas();
    const mensajes = await mensajesDeError(el, 'ac-api-tarjetas-pin-error', () =>
      el.cambiarPin(1, '0000', '5678'),
    );
    const mensaje = 'El PIN actual es incorrecto';
    expect(mensajes).to.deep.equal([mensaje, mensaje]);
  });

  test('consultarLineaDisponible devuelve la línea de crédito y dispara su evento de éxito', async () => {
    const el = await fastTarjetas();
    const [linea, evento] = await Promise.all([
      el.consultarLineaDisponible(2),
      oneEvent(el, 'ac-api-tarjetas-credit-line-success'),
    ]);
    const lineaEsperada = { tarjetaId: 2, lineaCredito: 5000, disponible: 3200 };
    expect([linea, evento.detail.data]).to.deep.equal([lineaEsperada, lineaEsperada]);
  });

  test('consultarLineaDisponible con una tarjeta de débito dispara error', async () => {
    const el = await fastTarjetas();
    const mensajes = await mensajesDeError(el, 'ac-api-tarjetas-credit-line-error', () =>
      el.consultarLineaDisponible(1),
    );
    const mensaje = 'La tarjeta 1 no tiene línea de crédito';
    expect(mensajes).to.deep.equal([mensaje, mensaje]);
  });

  const llamadasConTarjetaInexistente = [
    ['bloquearTarjeta', 'ac-api-tarjetas-block-error', el => el.bloquearTarjeta(999, 'Extravío')],
    ['desbloquearTarjeta', 'ac-api-tarjetas-unblock-error', el => el.desbloquearTarjeta(999)],
    ['cambiarPin', 'ac-api-tarjetas-pin-error', el => el.cambiarPin(999, '1234', '5678')],
    [
      'consultarLineaDisponible',
      'ac-api-tarjetas-credit-line-error',
      el => el.consultarLineaDisponible(999),
    ],
  ];

  for (const [metodo, evento, llamar] of llamadasConTarjetaInexistente) {
    test(`${metodo} con una tarjeta inexistente dispara error`, async () => {
      const el = await fastTarjetas();
      const mensajes = await mensajesDeError(el, evento, () => llamar(el));
      const mensaje = 'La tarjeta 999 no existe en el mock';
      expect(mensajes).to.deep.equal([mensaje, mensaje]);
    });
  }

  test('los cambios de estado se mantienen en su propia instancia', async () => {
    const el = await fastTarjetas();
    await el.bloquearTarjeta(1, 'Extravío');
    const otraInstancia = await fastTarjetas();
    const [tarjeta] = await otraInstancia.listarTarjetas();
    expect(tarjeta.estado).to.equal('activa');
  });

  test('modificar una tarjeta listada no cambia el mock interno', async () => {
    const el = await fastTarjetas();
    const [primeraTarjeta] = await el.listarTarjetas();
    primeraTarjeta.estado = 'bloqueada';
    const [tarjeta] = await el.listarTarjetas();
    expect(tarjeta.estado).to.equal('activa');
  });

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(html`<ac-api-tarjetas timeout="1" simulate-error></ac-api-tarjetas>`);
    const errorEvent = oneEvent(el, 'ac-api-tarjetas-list-error');
    let caught;
    try {
      await el.listarTarjetas();
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
