import { expect } from '@open-wc/testing';
import { Channel } from './channel.js';
import { CCP_ERROR_CODES } from './ccp-error-codes.js';

function makeFakeManager() {
  return {
    dispatched: [],
    unregisteredIds: [],
    subscriptions: [],
    unregister(id) {
      this.unregisteredIds.push(id);
    },
    _dispatch(message, options) {
      this.dispatched.push({ message, options });
    },
    _subscribe(endpointId, name, callback, options) {
      this.subscriptions.push({ endpointId, name, callback, options });
      return () => {};
    },
  };
}

function captureError(fn) {
  try {
    fn();
  } catch (error) {
    return error;
  }
  return undefined;
}

suite('Channel', () => {
  test('publish en canal out llama a _dispatch una vez', () => {
    const manager = makeFakeManager();
    const channel = new Channel({
      id: 'out-1',
      name: 'pedidos',
      direction: 'out',
      retain: false,
      manager,
    });
    channel.publish({ total: 10 });
    expect(manager.dispatched).to.have.lengthOf(1);
  });

  test('publish envía el mismo payload a _dispatch', () => {
    const manager = makeFakeManager();
    const payload = { total: 10 };
    const channel = new Channel({
      id: 'out-1',
      name: 'pedidos',
      direction: 'out',
      retain: false,
      manager,
    });
    channel.publish(payload);
    expect(manager.dispatched[0].message.payload).to.equal(payload);
  });

  test('publish pasa retain del canal a _dispatch', () => {
    const manager = makeFakeManager();
    const channel = new Channel({
      id: 'out-1',
      name: 'pedidos',
      direction: 'out',
      retain: true,
      manager,
    });
    channel.publish('hola');
    expect(manager.dispatched[0].options.retain).to.be.true;
  });

  test('publish devuelve el mensaje creado', () => {
    const manager = makeFakeManager();
    const channel = new Channel({
      id: 'out-1',
      name: 'pedidos',
      direction: 'out',
      retain: false,
      manager,
    });
    const message = channel.publish('hola');
    expect(message).to.include({ channel: 'pedidos', source: 'out-1', payload: 'hola' });
  });

  test('publish en canal in lanza publish-on-in', () => {
    const manager = makeFakeManager();
    const channel = new Channel({
      id: 'in-1',
      name: 'pedidos',
      direction: 'in',
      retain: false,
      manager,
    });
    const error = captureError(() => channel.publish('hola'));
    expect(error.code).to.equal(CCP_ERROR_CODES.PUBLISH_ON_IN);
  });

  test('subscribe en canal in llama a _subscribe una vez', () => {
    const manager = makeFakeManager();
    const channel = new Channel({
      id: 'in-1',
      name: 'pedidos',
      direction: 'in',
      retain: false,
      manager,
    });
    channel.subscribe(() => {});
    expect(manager.subscriptions).to.have.lengthOf(1);
  });

  test('subscribe pasa id y name correctos a _subscribe', () => {
    const manager = makeFakeManager();
    const channel = new Channel({
      id: 'in-1',
      name: 'pedidos',
      direction: 'in',
      retain: false,
      manager,
    });
    channel.subscribe(() => {});
    expect(manager.subscriptions[0]).to.include({ endpointId: 'in-1', name: 'pedidos' });
  });

  test('subscribe en canal out lanza subscribe-on-out', () => {
    const manager = makeFakeManager();
    const channel = new Channel({
      id: 'out-1',
      name: 'pedidos',
      direction: 'out',
      retain: false,
      manager,
    });
    const error = captureError(() => channel.subscribe(() => {}));
    expect(error.code).to.equal(CCP_ERROR_CODES.SUBSCRIBE_ON_OUT);
  });

  test('disconnect llama a unregister con el id del canal', () => {
    const manager = makeFakeManager();
    const channel = new Channel({
      id: 'out-1',
      name: 'pedidos',
      direction: 'out',
      retain: false,
      manager,
    });
    channel.disconnect();
    expect(manager.unregisteredIds).to.deep.equal(['out-1']);
  });

  test('disconnect dos veces llama a unregister solo una vez', () => {
    const manager = makeFakeManager();
    const channel = new Channel({
      id: 'out-1',
      name: 'pedidos',
      direction: 'out',
      retain: false,
      manager,
    });
    channel.disconnect();
    channel.disconnect();
    expect(manager.unregisteredIds).to.have.lengthOf(1);
  });

  test('publish después de disconnect lanza endpoint-disconnected', () => {
    const manager = makeFakeManager();
    const channel = new Channel({
      id: 'out-1',
      name: 'pedidos',
      direction: 'out',
      retain: false,
      manager,
    });
    channel.disconnect();
    const error = captureError(() => channel.publish('hola'));
    expect(error.code).to.equal(CCP_ERROR_CODES.ENDPOINT_DISCONNECTED);
  });

  test('subscribe después de disconnect lanza endpoint-disconnected', () => {
    const manager = makeFakeManager();
    const channel = new Channel({
      id: 'in-1',
      name: 'pedidos',
      direction: 'in',
      retain: false,
      manager,
    });
    channel.disconnect();
    const error = captureError(() => channel.subscribe(() => {}));
    expect(error.code).to.equal(CCP_ERROR_CODES.ENDPOINT_DISCONNECTED);
  });
});
