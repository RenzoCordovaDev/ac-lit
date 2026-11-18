import { expect } from '@open-wc/testing';
import { ChannelRegistry } from './channel-registry.js';
import { ChannelDispatcher } from './channel-dispatcher.js';
import { createChannelMessage } from './channel-message.js';

const CHANNEL = 'users.selected';
const OTHER_CHANNEL = 'orders.created';

function makeEndpoint(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: CHANNEL,
    direction: 'in',
    retain: false,
    createdAt: Date.now(),
    ...overrides,
  };
}

function makeMessage(payload = { value: 1 }, channel = CHANNEL) {
  return createChannelMessage({ channel, source: 'out-1', payload });
}

suite('ChannelDispatcher', () => {
  let registry;
  let dispatcher;

  setup(() => {
    registry = new ChannelRegistry();
    dispatcher = new ChannelDispatcher();
  });

  test('DSP-001: un endpoint IN suscrito recibe el mensaje publicado', () => {
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    let received;
    dispatcher.subscribe(
      endpoint.id,
      CHANNEL,
      message => {
        received = message;
      },
      { replay: false },
    );
    const message = makeMessage();
    dispatcher.publish(registry, message);
    expect(received).to.equal(message);
  });

  test('DSP-002: dos endpoints IN distintos reciben el mismo mensaje', () => {
    const first = makeEndpoint();
    const second = makeEndpoint();
    registry.add(first);
    registry.add(second);
    let firstReceived;
    let secondReceived;
    dispatcher.subscribe(
      first.id,
      CHANNEL,
      message => {
        firstReceived = message;
      },
      { replay: false },
    );
    dispatcher.subscribe(
      second.id,
      CHANNEL,
      message => {
        secondReceived = message;
      },
      { replay: false },
    );
    const message = makeMessage();
    dispatcher.publish(registry, message);
    expect(firstReceived).to.equal(message);
    expect(secondReceived).to.equal(message);
  });

  test('DSP-003: publicar sin endpoints IN registrados no lanza error', () => {
    expect(() => dispatcher.publish(registry, makeMessage())).to.not.throw();
  });

  test('DSP-004: si un callback del mismo endpoint lanza error, el otro igual recibe el mensaje', () => {
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    let received;
    dispatcher.subscribe(
      endpoint.id,
      CHANNEL,
      () => {
        throw new Error('roto');
      },
      { replay: false },
    );
    dispatcher.subscribe(
      endpoint.id,
      CHANNEL,
      message => {
        received = message;
      },
      { replay: false },
    );
    const message = makeMessage();
    dispatcher.publish(registry, message);
    expect(received).to.equal(message);
  });

  test('DSP-005: los mensajes llegan al suscriptor en el mismo orden en que se publicaron', () => {
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    const received = [];
    dispatcher.subscribe(
      endpoint.id,
      CHANNEL,
      message => {
        received.push(message.payload);
      },
      { replay: false },
    );
    dispatcher.publish(registry, makeMessage({ n: 1 }));
    dispatcher.publish(registry, makeMessage({ n: 2 }));
    expect(received).to.deep.equal([{ n: 1 }, { n: 2 }]);
  });

  test('DSP-006: un callback asíncrono que rechaza una promesa no hace que publish lance', async () => {
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    dispatcher.subscribe(
      endpoint.id,
      CHANNEL,
      async () => {
        throw new Error('x');
      },
      { replay: false },
    );
    expect(() => dispatcher.publish(registry, makeMessage())).to.not.throw();
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  test('una suscripción cancelada con la función retornada ya no recibe mensajes', () => {
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    const calls = [];
    const unsubscribe = dispatcher.subscribe(
      endpoint.id,
      CHANNEL,
      message => {
        calls.push(message);
      },
      { replay: false },
    );
    unsubscribe();
    dispatcher.publish(registry, makeMessage());
    expect(calls).to.have.lengthOf(0);
  });

  test('llamar dos veces a la función de desuscripción no lanza error', () => {
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    const unsubscribe = dispatcher.subscribe(endpoint.id, CHANNEL, () => {}, { replay: false });
    unsubscribe();
    expect(() => unsubscribe()).to.not.throw();
  });

  test('RET-001: un suscriptor nuevo recibe de inmediato el mensaje retenido publicado antes', () => {
    dispatcher.publish(registry, makeMessage(), { retain: true });
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    let received;
    dispatcher.subscribe(endpoint.id, CHANNEL, message => {
      received = message;
    });
    expect(received).to.exist;
  });

  test('RET-002: sin retain, un suscriptor nuevo no recibe nada al suscribirse', () => {
    dispatcher.publish(registry, makeMessage(), { retain: false });
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    const calls = [];
    dispatcher.subscribe(endpoint.id, CHANNEL, message => {
      calls.push(message);
    });
    expect(calls).to.have.lengthOf(0);
  });

  test('RET-004: con dos publicaciones retenidas, el suscriptor nuevo recibe solo la última', () => {
    dispatcher.publish(registry, makeMessage({ n: 1 }), { retain: true });
    const last = makeMessage({ n: 2 });
    dispatcher.publish(registry, last, { retain: true });
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    const calls = [];
    dispatcher.subscribe(endpoint.id, CHANNEL, message => {
      calls.push(message);
    });
    expect(calls).to.deep.equal([last]);
  });

  test('RET-005: el mensaje retenido sigue disponible tras teardown del endpoint que publicó', () => {
    const outEndpoint = makeEndpoint({ direction: 'out' });
    registry.add(outEndpoint);
    const message = makeMessage();
    dispatcher.publish(registry, message, { retain: true });
    dispatcher.teardown(outEndpoint.id);
    const inEndpoint = makeEndpoint();
    registry.add(inEndpoint);
    let received;
    dispatcher.subscribe(inEndpoint.id, CHANNEL, msg => {
      received = msg;
    });
    expect(received).to.equal(message);
  });

  test('RET-006: tras desuscribirse y volver a suscribirse, el suscriptor recibe de nuevo el retenido', () => {
    dispatcher.publish(registry, makeMessage(), { retain: true });
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    const unsubscribe = dispatcher.subscribe(endpoint.id, CHANNEL, () => {});
    unsubscribe();
    const calls = [];
    dispatcher.subscribe(
      endpoint.id,
      CHANNEL,
      message => {
        calls.push(message);
      },
      { replay: true },
    );
    expect(calls).to.have.lengthOf(1);
  });

  test('RET-007: con replay false, un suscriptor nuevo no recibe el mensaje retenido', () => {
    dispatcher.publish(registry, makeMessage(), { retain: true });
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    const calls = [];
    dispatcher.subscribe(
      endpoint.id,
      CHANNEL,
      message => {
        calls.push(message);
      },
      { replay: false },
    );
    expect(calls).to.have.lengthOf(0);
  });

  test('RET-008: tras clearRetained(name), un suscriptor nuevo ya no recibe nada para ese nombre', () => {
    dispatcher.publish(registry, makeMessage(), { retain: true });
    dispatcher.clearRetained(CHANNEL);
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    const calls = [];
    dispatcher.subscribe(endpoint.id, CHANNEL, message => {
      calls.push(message);
    });
    expect(calls).to.have.lengthOf(0);
  });

  test('RET-009: clearRetained() sin argumento borra los retenidos de todos los nombres', () => {
    dispatcher.publish(registry, makeMessage(), { retain: true });
    dispatcher.publish(registry, makeMessage({ n: 2 }, OTHER_CHANNEL), { retain: true });
    dispatcher.clearRetained();
    const endpoint = makeEndpoint();
    registry.add(endpoint);
    const calls = [];
    dispatcher.subscribe(endpoint.id, CHANNEL, message => {
      calls.push(message);
    });
    dispatcher.subscribe(endpoint.id, OTHER_CHANNEL, message => {
      calls.push(message);
    });
    expect(calls).to.have.lengthOf(0);
  });
});
