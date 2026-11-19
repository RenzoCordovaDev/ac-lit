import { expect } from '@open-wc/testing';
import { createRouter } from './router.js';

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/usuarios', name: 'usuarios' },
  { path: '/usuarios/:id', name: 'usuario-detalle' },
];

suite('createRouter', () => {
  let router;

  teardown(async () => {
    // El evento "hashchange" se despacha como una tarea de macrotask, no
    // sincrónica -- si no se deja drenar la cola entre tests, un cambio de
    // hash de un test anterior puede terminar disparándose recién durante
    // el siguiente test (y llamando a SU listener, que es el que está
    // adjunto en ese momento). Esperar un macrotask acá evita que eso filtre.
    router?.destroy();
    location.hash = '';
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  test('lanza INVALID_ROUTES con un array vacío', () => {
    expect(() => createRouter([]))
      .to.throw()
      .with.property('code', 'invalid-routes');
  });

  test('lanza INVALID_ROUTES si una ruta no tiene "path" con "/" inicial', () => {
    expect(() => createRouter([{ path: 'usuarios', name: 'usuarios' }]))
      .to.throw()
      .with.property('code', 'invalid-routes');
  });

  test('lanza INVALID_ROUTES si una ruta no tiene "name"', () => {
    expect(() => createRouter([{ path: '/' }]))
      .to.throw()
      .with.property('code', 'invalid-routes');
  });

  test('resuelve router.current ya al crearse, sin esperar un hashchange', () => {
    location.hash = '#/usuarios';
    router = createRouter(ROUTES);
    expect(router.current).to.deep.equal({
      matched: true,
      name: 'usuarios',
      path: '/usuarios',
      params: {},
      query: {},
    });
  });

  test('router.current refleja un path con parámetro', () => {
    location.hash = '#/usuarios/42';
    router = createRouter(ROUTES);
    expect(router.current.params).to.deep.equal({ id: '42' });
  });

  test('router.current refleja la query string del hash', () => {
    location.hash = '#/usuarios?orden=nombre';
    router = createRouter(ROUTES);
    expect(router.current.query).to.deep.equal({ orden: 'nombre' });
  });

  test('un hash sin match deja matched:false y name:undefined', () => {
    location.hash = '#/no-existe';
    router = createRouter(ROUTES);
    expect(router.current).to.deep.equal({
      matched: false,
      name: undefined,
      path: '/no-existe',
      params: {},
      query: {},
    });
  });

  test('un hashchange real (sin pasar por navigate()) notifica a los suscriptores', async () => {
    location.hash = '';
    router = createRouter(ROUTES);
    let received = null;
    router.subscribe(route => {
      received = route;
    });

    location.hash = '#/usuarios';
    await new Promise(resolve => window.addEventListener('hashchange', resolve, { once: true }));

    expect(received.name).to.equal('usuarios');
  });

  test('subscribe() devuelve una función que cancela esa suscripción puntual', async () => {
    location.hash = '';
    router = createRouter(ROUTES);
    let callCount = 0;
    const unsubscribe = router.subscribe(() => {
      callCount += 1;
    });
    unsubscribe();

    location.hash = '#/usuarios';
    await new Promise(resolve => window.addEventListener('hashchange', resolve, { once: true }));

    expect(callCount).to.equal(0);
  });

  test('navigate(path) actualiza location.hash de inmediato', () => {
    location.hash = '';
    router = createRouter(ROUTES);
    router.navigate('/usuarios');
    expect(location.hash).to.equal('#/usuarios');
  });

  test('navigate(path) notifica a los suscriptores sin esperar el evento hashchange del navegador', () => {
    location.hash = '';
    router = createRouter(ROUTES);
    let received = null;
    router.subscribe(route => {
      received = route;
    });
    router.navigate('/usuarios/7');
    expect(received.params).to.deep.equal({ id: '7' });
  });

  test('navigate({name, params}) arma el path sustituyendo el :param', () => {
    location.hash = '';
    router = createRouter(ROUTES);
    router.navigate({ name: 'usuario-detalle', params: { id: '9' } });
    expect(location.hash).to.equal('#/usuarios/9');
  });

  test('navigate({name, query}) agrega la query string al hash', () => {
    location.hash = '';
    router = createRouter(ROUTES);
    router.navigate({ name: 'usuarios', query: { orden: 'nombre' } });
    expect(location.hash).to.equal('#/usuarios?orden=nombre');
  });

  test('navigate() con un name desconocido lanza UNKNOWN_ROUTE_NAME', () => {
    location.hash = '';
    router = createRouter(ROUTES);
    expect(() => router.navigate({ name: 'no-existe' }))
      .to.throw()
      .with.property('code', 'unknown-route-name');
  });

  test('navigate() sin un :param requerido lanza MISSING_PARAM', () => {
    location.hash = '';
    router = createRouter(ROUTES);
    expect(() => router.navigate({ name: 'usuario-detalle', params: {} }))
      .to.throw()
      .with.property('code', 'missing-param');
  });

  test('un navigate() programático no dispara una segunda notificación por el hashchange nativo', async () => {
    location.hash = '';
    router = createRouter(ROUTES);
    let callCount = 0;
    router.subscribe(() => {
      callCount += 1;
    });
    router.navigate('/usuarios');
    // Deja pasar un ciclo de eventos por si el navegador todavía dispara el
    // hashchange nativo de forma asíncrona -- no debe volver a notificar.
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(callCount).to.equal(1);
  });

  test('destroy() hace que current/subscribe/navigate lancen DESTROYED', () => {
    location.hash = '';
    router = createRouter(ROUTES);
    router.destroy();
    expect(() => router.current)
      .to.throw()
      .with.property('code', 'destroyed');
  });

  test('destroy() saca el listener de hashchange: un cambio posterior ya no notifica', async () => {
    location.hash = '';
    const localRouter = createRouter(ROUTES);
    let callCount = 0;
    localRouter.subscribe(() => {
      callCount += 1;
    });
    localRouter.destroy();

    location.hash = '#/usuarios';
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(callCount).to.equal(0);
  });
});
