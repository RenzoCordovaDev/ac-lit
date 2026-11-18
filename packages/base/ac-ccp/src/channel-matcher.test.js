import { expect } from '@open-wc/testing';
import { ChannelRegistry } from './channel-registry.js';
import { resolveSubscribers } from './channel-matcher.js';

function makeEndpoint(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'users.selected',
    direction: 'in',
    retain: false,
    createdAt: Date.now(),
    ...overrides,
  };
}

suite('resolveSubscribers', () => {
  let registry;

  setup(() => {
    registry = new ChannelRegistry();
  });

  test('MAT-001: devuelve el IN cuando el OUT se registra antes que el IN', () => {
    const out = makeEndpoint({ direction: 'out' });
    const inEp = makeEndpoint({ direction: 'in' });
    registry.add(out);
    registry.add(inEp);
    expect(resolveSubscribers(registry, 'users.selected').map(e => e.id)).to.deep.equal([inEp.id]);
  });

  test('MAT-002: devuelve el IN cuando el IN se registra antes que el OUT', () => {
    const inEp = makeEndpoint({ direction: 'in' });
    const out = makeEndpoint({ direction: 'out' });
    registry.add(inEp);
    registry.add(out);
    expect(resolveSubscribers(registry, 'users.selected').map(e => e.id)).to.deep.equal([inEp.id]);
  });

  test('MAT-003: con OUT e IN del mismo nombre registrados, solo devuelve el IN', () => {
    const inEp = makeEndpoint({ direction: 'in' });
    const out = makeEndpoint({ direction: 'out' });
    registry.add(inEp);
    registry.add(out);
    expect(resolveSubscribers(registry, 'users.selected')).to.have.lengthOf(1);
  });

  test('MAT-004: un OUT y un IN con nombres distintos no hacen match', () => {
    registry.add(makeEndpoint({ name: 'users.selected', direction: 'out' }));
    registry.add(makeEndpoint({ name: 'users.created', direction: 'in' }));
    expect(resolveSubscribers(registry, 'users.selected')).to.deep.equal([]);
  });

  test('MAT-005: varios IN con el mismo nombre aparecen todos en el resultado', () => {
    const ins = [makeEndpoint(), makeEndpoint(), makeEndpoint()];
    ins.forEach(ep => registry.add(ep));
    expect(resolveSubscribers(registry, 'users.selected').map(e => e.id)).to.have.members(
      ins.map(ep => ep.id),
    );
  });

  test('MAT-006: varios OUT con el mismo nombre y sin IN devuelven []', () => {
    registry.add(makeEndpoint({ direction: 'out' }));
    registry.add(makeEndpoint({ direction: 'out' }));
    expect(resolveSubscribers(registry, 'users.selected')).to.deep.equal([]);
  });

  test('MAT-007: un IN eliminado del Registry ya no aparece en el resultado', () => {
    const removed = makeEndpoint({ direction: 'in' });
    const kept = makeEndpoint({ direction: 'in' });
    registry.add(removed);
    registry.add(kept);
    registry.remove(removed.id);
    expect(resolveSubscribers(registry, 'users.selected').map(e => e.id)).to.not.include(
      removed.id,
    );
  });

  test('MAT-008: el mismo name y direction registrados dos veces con ids distintos no generan duplicados', () => {
    registry.add(makeEndpoint({ direction: 'in' }));
    registry.add(makeEndpoint({ direction: 'in' }));
    expect(resolveSubscribers(registry, 'users.selected')).to.have.lengthOf(2);
  });
});
