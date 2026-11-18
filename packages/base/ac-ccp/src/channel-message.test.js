import { expect } from '@open-wc/testing';
import { createChannelMessage } from './channel-message.js';

suite('createChannelMessage', () => {
  test('devuelve un objeto con exactamente las claves esperadas', () => {
    const message = createChannelMessage({ channel: 'ch', source: 'src', payload: 1 });
    expect(Object.keys(message).sort()).to.deep.equal([
      'channel',
      'id',
      'metadata',
      'payload',
      'source',
      'timestamp',
    ]);
  });

  test('conserva channel, source y payload tal como se pasaron', () => {
    const payloadOriginal = { id: 1, name: 'Renzo' };
    const message = createChannelMessage({
      channel: 'ch',
      source: 'src',
      payload: payloadOriginal,
    });
    expect(message.channel).to.equal('ch');
    expect(message.source).to.equal('src');
    expect(message.payload).to.equal(payloadOriginal);
  });

  test('genera un id string no vacío', () => {
    const message = createChannelMessage({ channel: 'ch', source: 'src', payload: 1 });
    expect(message.id).to.be.a('string').that.is.not.empty;
  });

  test('dos llamadas distintas generan ids diferentes', () => {
    const first = createChannelMessage({ channel: 'ch', source: 'src', payload: 1 });
    const second = createChannelMessage({ channel: 'ch', source: 'src', payload: 1 });
    expect(first.id).to.not.equal(second.id);
  });

  test('timestamp es un número', () => {
    const message = createChannelMessage({ channel: 'ch', source: 'src', payload: 1 });
    expect(typeof message.timestamp).to.equal('number');
  });

  test('sin metadata, queda como objeto vacío', () => {
    const message = createChannelMessage({ channel: 'ch', source: 'src', payload: 1 });
    expect(message.metadata).to.deep.equal({});
  });

  test('con metadata, la conserva tal cual', () => {
    const message = createChannelMessage({
      channel: 'ch',
      source: 'src',
      payload: 1,
      metadata: { foo: 'bar' },
    });
    expect(message.metadata).to.deep.equal({ foo: 'bar' });
  });

  test('el mensaje devuelto está congelado', () => {
    const message = createChannelMessage({ channel: 'ch', source: 'src', payload: 1 });
    expect(Object.isFrozen(message)).to.be.true;
  });

  test('message.metadata también está congelado', () => {
    const message = createChannelMessage({ channel: 'ch', source: 'src', payload: 1 });
    expect(Object.isFrozen(message.metadata)).to.be.true;
  });
});
