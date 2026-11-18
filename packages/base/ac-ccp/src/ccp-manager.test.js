import { expect } from '@open-wc/testing';
import { createCCP } from './ccp-manager.js';

suite('CCPManager', () => {
  test('register() con un nombre inválido lanza CCPError(invalid-name)', () => {
    const ccp = createCCP();
    expect(() => ccp.register({ name: '', direction: 'out' }))
      .to.throw()
      .with.property('code', 'invalid-name');
  });

  test('register() con un id duplicado lanza CCPError(duplicate-id)', () => {
    const ccp = createCCP();
    ccp.register({ name: 'users.selected', direction: 'out', id: 'repetido' });
    expect(() => ccp.register({ name: 'otro.canal', direction: 'out', id: 'repetido' }))
      .to.throw()
      .with.property('code', 'duplicate-id');
  });

  test('register() sin id genera uno nuevo en cada llamada', () => {
    const ccp = createCCP();
    const a = ccp.register({ name: 'users.selected', direction: 'out' });
    const b = ccp.register({ name: 'users.selected', direction: 'out' });
    expect(a.id).to.not.equal(b.id);
  });

  test('unregister() sobre un id inexistente lanza CCPError(unknown-endpoint)', () => {
    const ccp = createCCP();
    expect(() => ccp.unregister('nunca-existio'))
      .to.throw()
      .with.property('code', 'unknown-endpoint');
  });

  test('un OUT publica y el IN compatible recibe el mensaje', () => {
    const ccp = createCCP();
    const out = ccp.register({ name: 'users.selected', direction: 'out' });
    const input = ccp.register({ name: 'users.selected', direction: 'in' });
    let received = null;
    input.subscribe(message => {
      received = message;
    });
    out.publish({ id: 1, name: 'Renzo' });
    expect(received.payload).to.deep.equal({ id: 1, name: 'Renzo' });
  });

  test('un OUT con retain:true entrega el último mensaje a un IN que se suscribe después', () => {
    const ccp = createCCP();
    const out = ccp.register({ name: 'users.selected', direction: 'out', retain: true });
    out.publish({ id: 1, name: 'Renzo' });
    const input = ccp.register({ name: 'users.selected', direction: 'in' });
    let received = null;
    input.subscribe(message => {
      received = message;
    });
    expect(received.payload).to.deep.equal({ id: 1, name: 'Renzo' });
  });

  test('getChannels() filtra por nombre y dirección', () => {
    const ccp = createCCP();
    ccp.register({ name: 'users.selected', direction: 'out' });
    ccp.register({ name: 'users.selected', direction: 'in' });
    ccp.register({ name: 'orders.created', direction: 'out' });
    const results = ccp.getChannels({ name: 'users.selected', direction: 'in' });
    expect(results).to.have.lengthOf(1);
  });

  test('getChannels() devuelve descriptores planos, no mutables hacia el registro interno', () => {
    const ccp = createCCP();
    ccp.register({ name: 'users.selected', direction: 'out' });
    const [endpoint] = ccp.getChannels({ name: 'users.selected' });
    endpoint.name = 'mutado';
    const [endpointOtraVez] = ccp.getChannels({ direction: 'out' });
    expect(endpointOtraVez.name).to.equal('users.selected');
  });

  test('clearRetained(name) borra el mensaje retenido de ese canal', () => {
    const ccp = createCCP();
    const out = ccp.register({ name: 'users.selected', direction: 'out', retain: true });
    out.publish({ id: 1 });
    ccp.clearRetained('users.selected');
    const input = ccp.register({ name: 'users.selected', direction: 'in' });
    let received = 'sin-llamar';
    input.subscribe(message => {
      received = message;
    });
    expect(received).to.equal('sin-llamar');
  });

  test('destroy() hace que cualquier operación posterior lance CCPError(destroyed)', () => {
    const ccp = createCCP();
    ccp.destroy();
    expect(() => ccp.register({ name: 'users.selected', direction: 'out' }))
      .to.throw()
      .with.property('code', 'destroyed');
  });

  test('destroy() libera los mensajes retenidos', () => {
    const ccp = createCCP();
    const out = ccp.register({ name: 'users.selected', direction: 'out', retain: true });
    out.publish({ id: 1 });
    ccp.destroy();
    const ccpNuevo = createCCP();
    const input = ccpNuevo.register({ name: 'users.selected', direction: 'in' });
    let received = 'sin-llamar';
    input.subscribe(message => {
      received = message;
    });
    expect(received).to.equal('sin-llamar');
  });
});
