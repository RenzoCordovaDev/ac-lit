import { expect } from '@open-wc/testing';
import { ChannelRegistry } from './channel-registry.js';

function makeEndpoint(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'users.selected',
    direction: 'out',
    retain: false,
    createdAt: Date.now(),
    ...overrides,
  };
}

suite('ChannelRegistry', () => {
  let registry;

  setup(() => {
    registry = new ChannelRegistry();
  });

  test('REG-001: registra un endpoint OUT y lo devuelve por id', () => {
    const endpoint = makeEndpoint({ direction: 'out' });
    registry.add(endpoint);
    expect(registry.get(endpoint.id)).to.equal(endpoint);
  });

  test('REG-002: registra un endpoint IN y lo devuelve por id', () => {
    const endpoint = makeEndpoint({ direction: 'in' });
    registry.add(endpoint);
    expect(registry.get(endpoint.id)).to.equal(endpoint);
  });

  test('REG-003: varios endpoints con el mismo name aparecen en list({ name })', () => {
    const first = makeEndpoint({ name: 'users.selected' });
    const second = makeEndpoint({ name: 'users.selected' });
    registry.add(first);
    registry.add(second);
    expect(registry.list({ name: 'users.selected' })).to.have.members([first, second]);
  });

  test('REG-004: agregar dos endpoints con el mismo id lanza CCPError duplicate-id', () => {
    const id = crypto.randomUUID();
    registry.add(makeEndpoint({ id }));
    let error;
    try {
      registry.add(makeEndpoint({ id }));
    } catch (e) {
      error = e;
    }
    expect(error?.code).to.equal('duplicate-id');
  });

  test('REG-005: remove() elimina el endpoint y get() devuelve undefined', () => {
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    registry.remove(endpoint.id);
    expect(registry.get(endpoint.id)).to.be.undefined;
  });

  test('REG-006: listByNameAndDirection devuelve solo los endpoints de ese nombre y dirección', () => {
    const match = makeEndpoint({ name: 'users.selected', direction: 'out' });
    const otherName = makeEndpoint({ name: 'orders.selected', direction: 'out' });
    const otherDirection = makeEndpoint({ name: 'users.selected', direction: 'in' });
    registry.add(match);
    registry.add(otherName);
    registry.add(otherDirection);
    expect(registry.listByNameAndDirection('users.selected', 'out')).to.deep.equal([match]);
  });

  test('REG-007: tras eliminar el único endpoint de un grupo, listByNameAndDirection devuelve []', () => {
    const endpoint = makeEndpoint({ name: 'users.selected', direction: 'out' });
    registry.add(endpoint);
    registry.remove(endpoint.id);
    expect(registry.listByNameAndDirection('users.selected', 'out')).to.deep.equal([]);
  });

  test('remove() sobre un id inexistente lanza CCPError unknown-endpoint', () => {
    let error;
    try {
      registry.remove(crypto.randomUUID());
    } catch (e) {
      error = e;
    }
    expect(error?.code).to.equal('unknown-endpoint');
  });

  test('clear() deja el registro vacío', () => {
    registry.add(makeEndpoint());
    registry.add(makeEndpoint({ direction: 'in' }));
    registry.clear();
    expect(registry.list()).to.deep.equal([]);
  });
});
