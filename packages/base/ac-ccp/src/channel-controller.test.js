import { fixture, html, expect } from '@open-wc/testing';
import { LitElement } from 'lit';
import { createCCP } from './ccp-manager.js';
import { ChannelController } from './channel-controller.js';

class CcpControllerTestHost extends LitElement {
  static properties = {
    received: { attribute: false },
  };

  constructor() {
    super();
    this.received = null;
  }

  render() {
    return html``;
  }
}
customElements.define('ccp-controller-test-host', CcpControllerTestHost);

suite('ChannelController', () => {
  test('sin `config.ccp` lanza CCPError en vez de crear una instancia propia', async () => {
    const host = await fixture(html`<ccp-controller-test-host></ccp-controller-test-host>`);
    expect(() => new ChannelController(host, { name: 'users.selected', direction: 'out' }))
      .to.throw()
      .with.property('code', 'invalid-name');
  });

  test('hostConnected() suscribe un canal `in` y entrega mensajes vía onMessage', async () => {
    const ccp = createCCP();
    const host = await fixture(html`<ccp-controller-test-host></ccp-controller-test-host>`);
    new ChannelController(host, {
      ccp,
      name: 'users.selected',
      direction: 'in',
      onMessage: message => {
        host.received = message.payload;
      },
    });

    const out = ccp.register({ name: 'users.selected', direction: 'out' });
    out.publish({ id: 1, name: 'Renzo' });
    await host.updateComplete;

    expect(host.received).to.deep.equal({ id: 1, name: 'Renzo' });
  });

  test('llama a host.requestUpdate() después de ejecutar el callback del usuario', async () => {
    const ccp = createCCP();
    const host = await fixture(html`<ccp-controller-test-host></ccp-controller-test-host>`);
    const order = [];
    new ChannelController(host, {
      ccp,
      name: 'users.selected',
      direction: 'in',
      onMessage: () => order.push('callback'),
    });
    const originalRequestUpdate = host.requestUpdate.bind(host);
    host.requestUpdate = (...args) => {
      order.push('requestUpdate');
      return originalRequestUpdate(...args);
    };

    const out = ccp.register({ name: 'users.selected', direction: 'out' });
    out.publish({ id: 1 });

    expect(order).to.deep.equal(['callback', 'requestUpdate']);
  });

  test('publish() en un canal `out` distribuye el mensaje a los IN suscritos', async () => {
    const ccp = createCCP();
    const host = await fixture(html`<ccp-controller-test-host></ccp-controller-test-host>`);
    const controller = new ChannelController(host, {
      ccp,
      name: 'users.selected',
      direction: 'out',
    });

    let received = null;
    const input = ccp.register({ name: 'users.selected', direction: 'in' });
    input.subscribe(message => {
      received = message.payload;
    });

    controller.publish({ id: 7 });
    expect(received).to.deep.equal({ id: 7 });
  });

  test('publish() en un canal `in` lanza CCPError(publish-on-in)', async () => {
    const ccp = createCCP();
    const host = await fixture(html`<ccp-controller-test-host></ccp-controller-test-host>`);
    const controller = new ChannelController(host, {
      ccp,
      name: 'users.selected',
      direction: 'in',
    });

    expect(() => controller.publish({ id: 1 }))
      .to.throw()
      .with.property('code', 'publish-on-in');
  });

  test('publish() antes de conectar (o después de desconectar) lanza CCPError(endpoint-disconnected)', async () => {
    const ccp = createCCP();
    const host = await fixture(html`<ccp-controller-test-host></ccp-controller-test-host>`);
    const controller = new ChannelController(host, {
      ccp,
      name: 'users.selected',
      direction: 'out',
    });
    host.remove();

    expect(() => controller.publish({ id: 1 }))
      .to.throw()
      .with.property('code', 'endpoint-disconnected');
  });

  test('un ciclo connect → disconnect → connect no duplica la suscripción', async () => {
    const ccp = createCCP();
    const host = await fixture(html`<ccp-controller-test-host></ccp-controller-test-host>`);
    let callCount = 0;
    const controller = new ChannelController(host, {
      ccp,
      name: 'users.selected',
      direction: 'in',
      onMessage: () => {
        callCount += 1;
      },
    });

    controller.hostDisconnected();
    controller.hostConnected();

    const out = ccp.register({ name: 'users.selected', direction: 'out' });
    out.publish({ id: 1 });

    expect(callCount).to.equal(1);
  });

  test('hostDisconnected() es seguro de llamar sin haberse conectado antes', async () => {
    const ccp = createCCP();
    const host = await fixture(html`<ccp-controller-test-host></ccp-controller-test-host>`);
    const controller = new ChannelController(host, {
      ccp,
      name: 'users.selected',
      direction: 'in',
    });
    expect(() => controller.hostDisconnected()).to.not.throw();
  });
});
