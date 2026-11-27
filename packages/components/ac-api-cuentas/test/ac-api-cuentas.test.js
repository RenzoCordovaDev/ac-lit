import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import '../index.js';

async function fastAccounts() {
  return fixture(html`<ac-api-cuentas timeout="1"></ac-api-cuentas>`);
}

const firstAccount = {
  id: 1,
  tipoId: 1,
  alias: 'Mis ahorros',
  moneda: 'PEN',
  estado: 'activa',
  fechaApertura: '2024-01-15',
};

const secondAccount = {
  id: 2,
  tipoId: 2,
  alias: 'Gastos diarios',
  moneda: 'PEN',
  estado: 'activa',
  fechaApertura: '2024-03-10',
};

suite('ac-api-cuentas', () => {
  test('no renderiza texto', async () => {
    const el = await fastAccounts();
    expect(el.shadowRoot.textContent.trim()).to.equal('');
  });

  test('no renderiza elementos', async () => {
    const el = await fastAccounts();
    expect(el.shadowRoot.querySelector('*')).to.be.null;
  });

  test('listarTiposCuenta devuelve los tipos mock y dispara su evento de éxito', async () => {
    const el = await fastAccounts();
    const [tipos, event] = await Promise.all([
      el.listarTiposCuenta(),
      oneEvent(el, 'ac-api-cuentas-types-success'),
    ]);
    const expected = [
      { id: 1, nombre: 'Cuenta de Ahorros', moneda: 'PEN', tasaInteres: 2.5 },
      { id: 2, nombre: 'Cuenta Corriente', moneda: 'PEN', tasaInteres: 0 },
      { id: 3, nombre: 'Cuenta Sueldo', moneda: 'PEN', tasaInteres: 1.0 },
    ];
    expect([tipos, event.detail.data]).to.deep.equal([expected, expected]);
  });

  test('listarCuentas devuelve las cuentas mock y dispara su evento de éxito', async () => {
    const el = await fastAccounts();
    const [cuentas, event] = await Promise.all([
      el.listarCuentas(),
      oneEvent(el, 'ac-api-cuentas-list-success'),
    ]);
    const expected = [firstAccount, secondAccount];
    expect([cuentas, event.detail.data]).to.deep.equal([expected, expected]);
  });

  test('listarCuentas filtra por estado y tipoId a la vez', async () => {
    const el = await fastAccounts();
    await el.bloquearCuenta(1, 'Solicitud del titular');
    const nueva = await el.abrirCuenta(1, 'Ahorros nuevos');
    const cuentas = await el.listarCuentas({ estado: 'activa', tipoId: 1 });
    expect(cuentas).to.deep.equal([nueva]);
  });

  test('listarCuentas ordena antes de paginar', async () => {
    const el = await fastAccounts();
    const cuentas = await el.listarCuentas({
      sortBy: 'id',
      sortDir: 'desc',
      pagination: 1,
      page: 2,
    });
    expect(cuentas).to.deep.equal([firstAccount]);
  });

  test('abrirCuenta crea una cuenta activa con la fecha de hoy y dispara su evento de éxito', async () => {
    const el = await fastAccounts();
    const [cuenta, event] = await Promise.all([
      el.abrirCuenta(3, 'Mi sueldo'),
      oneEvent(el, 'ac-api-cuentas-open-success'),
    ]);
    const expected = {
      id: 3,
      tipoId: 3,
      alias: 'Mi sueldo',
      moneda: 'PEN',
      estado: 'activa',
      fechaApertura: new Date().toISOString().slice(0, 10),
    };
    expect([cuenta, event.detail.data]).to.deep.equal([expected, expected]);
  });

  test('actualizarAlias cambia el alias y dispara su evento de éxito', async () => {
    const el = await fastAccounts();
    const [cuenta, event] = await Promise.all([
      el.actualizarAlias(1, 'Fondo de emergencia'),
      oneEvent(el, 'ac-api-cuentas-rename-success'),
    ]);
    const expected = { ...firstAccount, alias: 'Fondo de emergencia' };
    expect([cuenta, event.detail.data]).to.deep.equal([expected, expected]);
  });

  test('bloquearCuenta cambia el estado, guarda el motivo y dispara su evento de éxito', async () => {
    const el = await fastAccounts();
    const motivo = 'Solicitud del titular';
    const [cuenta, event] = await Promise.all([
      el.bloquearCuenta(1, motivo),
      oneEvent(el, 'ac-api-cuentas-block-success'),
    ]);
    const expected = { ...firstAccount, estado: 'bloqueada', motivoBloqueo: motivo };
    expect([cuenta, event.detail.data]).to.deep.equal([expected, expected]);
  });

  test('cerrarCuenta cambia el estado y dispara su evento de éxito', async () => {
    const el = await fastAccounts();
    const [cuenta, event] = await Promise.all([
      el.cerrarCuenta(1),
      oneEvent(el, 'ac-api-cuentas-close-success'),
    ]);
    const expected = { ...firstAccount, estado: 'cerrada' };
    expect([cuenta, event.detail.data]).to.deep.equal([expected, expected]);
  });

  test('cada instancia mantiene su propio estado de cuentas', async () => {
    const el = await fastAccounts();
    await el.actualizarAlias(1, 'Fondo de emergencia');
    await el.cerrarCuenta(2);
    await el.abrirCuenta(3, 'Mi sueldo');

    const otraInstancia = await fastAccounts();
    const cuentas = await otraInstancia.listarCuentas();
    expect(cuentas).to.deep.equal([firstAccount, secondAccount]);
  });

  const erroresDeDominio = [
    { method: 'abrirCuenta', action: 'open', args: [999, 'Ahorros'], reason: 'tipo inexistente' },
    {
      method: 'actualizarAlias',
      action: 'rename',
      args: [999, 'Ahorros'],
      reason: 'cuenta inexistente',
    },
    {
      method: 'actualizarAlias',
      action: 'rename',
      args: [1, 'Ahorros'],
      reason: 'cuenta cerrada',
      prepare: el => el.cerrarCuenta(1),
    },
    {
      method: 'bloquearCuenta',
      action: 'block',
      args: [999, 'Solicitud'],
      reason: 'cuenta inexistente',
    },
    {
      method: 'bloquearCuenta',
      action: 'block',
      args: [1, 'Solicitud'],
      reason: 'cuenta bloqueada',
      prepare: el => el.bloquearCuenta(1, 'Solicitud del titular'),
    },
    {
      method: 'bloquearCuenta',
      action: 'block',
      args: [1, 'Solicitud'],
      reason: 'cuenta cerrada',
      prepare: el => el.cerrarCuenta(1),
    },
    { method: 'cerrarCuenta', action: 'close', args: [999], reason: 'cuenta inexistente' },
    {
      method: 'cerrarCuenta',
      action: 'close',
      args: [1],
      reason: 'cuenta cerrada',
      prepare: el => el.cerrarCuenta(1),
    },
  ];

  for (const { method, action, args, reason, prepare } of erroresDeDominio) {
    test(`${method} dispara error con ${reason}`, async () => {
      const el = await fastAccounts();
      await prepare?.(el);

      const errorEvent = oneEvent(el, `ac-api-cuentas-${action}-error`);
      let caught;
      try {
        await el[method](...args);
      } catch (error) {
        caught = error;
      }
      const { detail } = await errorEvent;
      expect([caught?.method, detail.error === caught]).to.deep.equal([method, true]);
    });
  }

  test('con `simulateError` cualquier método falla y dispara su evento de error', async () => {
    const el = await fixture(html`<ac-api-cuentas timeout="1" simulate-error></ac-api-cuentas>`);
    const errorEvent = oneEvent(el, 'ac-api-cuentas-types-error');
    let caught;
    try {
      await el.listarTiposCuenta();
    } catch (error) {
      caught = error;
    }
    await errorEvent;
    expect(caught).to.exist;
  });
});
