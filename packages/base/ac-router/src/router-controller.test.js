import { fixture, html, expect } from '@open-wc/testing';
import { LitElement } from 'lit';
import { createRouter } from './router.js';
import { RouterController } from './router-controller.js';

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/usuarios', name: 'usuarios' },
  { path: '/usuarios/:id', name: 'usuario-detalle' },
];

class RouterControllerTestHost extends LitElement {
  render() {
    return html``;
  }
}
customElements.define('router-controller-test-host', RouterControllerTestHost);

suite('RouterController', () => {
  let router;

  teardown(async () => {
    router?.destroy();
    location.hash = '';
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  test('sin `config.router` lanza RouterError en vez de crear una instancia propia', async () => {
    const host = await fixture(html`<router-controller-test-host></router-controller-test-host>`);
    expect(() => new RouterController(host, {}))
      .to.throw()
      .with.property('code', 'invalid-routes');
  });

  test('expone la ruta actual ya al construirse', async () => {
    location.hash = '#/usuarios';
    router = createRouter(ROUTES);
    const host = await fixture(html`<router-controller-test-host></router-controller-test-host>`);
    const controller = new RouterController(host, { router });
    expect(controller.route.name).to.equal('usuarios');
  });

  test('hostConnected() suscribe y actualiza `route` en cada cambio', async () => {
    location.hash = '';
    router = createRouter(ROUTES);
    const host = await fixture(html`<router-controller-test-host></router-controller-test-host>`);
    const controller = new RouterController(host, { router });

    router.navigate('/usuarios/42');

    expect(controller.route.params).to.deep.equal({ id: '42' });
  });

  test('llama a onChange y después a host.requestUpdate(), en ese orden', async () => {
    location.hash = '';
    router = createRouter(ROUTES);
    const host = await fixture(html`<router-controller-test-host></router-controller-test-host>`);
    const order = [];
    new RouterController(host, { router, onChange: () => order.push('onChange') });
    const originalRequestUpdate = host.requestUpdate.bind(host);
    host.requestUpdate = (...args) => {
      order.push('requestUpdate');
      return originalRequestUpdate(...args);
    };

    router.navigate('/usuarios');

    expect(order).to.deep.equal(['onChange', 'requestUpdate']);
  });

  test('hostDisconnected() cancela la suscripción', async () => {
    location.hash = '';
    router = createRouter(ROUTES);
    const host = await fixture(html`<router-controller-test-host></router-controller-test-host>`);
    const controller = new RouterController(host, { router });
    host.remove();

    router.navigate('/usuarios');

    expect(controller.route.name).to.not.equal('usuarios');
  });

  test('un ciclo connect → disconnect → connect no duplica la suscripción', async () => {
    location.hash = '';
    router = createRouter(ROUTES);
    const host = await fixture(html`<router-controller-test-host></router-controller-test-host>`);
    let callCount = 0;
    const controller = new RouterController(host, { router, onChange: () => (callCount += 1) });

    controller.hostDisconnected();
    controller.hostConnected();

    router.navigate('/usuarios');

    expect(callCount).to.equal(1);
  });

  test('controller.navigate() delega en router.navigate()', async () => {
    location.hash = '';
    router = createRouter(ROUTES);
    const host = await fixture(html`<router-controller-test-host></router-controller-test-host>`);
    const controller = new RouterController(host, { router });

    controller.navigate({ name: 'usuario-detalle', params: { id: '5' } });

    expect(location.hash).to.equal('#/usuarios/5');
  });

  test('hostDisconnected() es seguro de llamar sin haberse conectado antes', async () => {
    location.hash = '';
    router = createRouter(ROUTES);
    const host = await fixture(html`<router-controller-test-host></router-controller-test-host>`);
    const controller = new RouterController(host, { router });
    expect(() => controller.hostDisconnected()).to.not.throw();
  });
});
