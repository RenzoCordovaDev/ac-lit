import { expect } from '@open-wc/testing';
import { compileRoute, matchRoutes } from './route-matcher.js';

suite('compileRoute', () => {
  test('compila la ruta raíz "/" a cero segmentos', () => {
    expect(compileRoute({ path: '/', name: 'home' })).to.deep.equal({ name: 'home', segments: [] });
  });

  test('compila un segmento estático como literal', () => {
    expect(compileRoute({ path: '/usuarios', name: 'usuarios' }).segments).to.deep.equal([
      { dynamic: false, value: 'usuarios' },
    ]);
  });

  test('marca el segmento con prefijo ":" como dinámico y le quita los dos puntos', () => {
    expect(compileRoute({ path: '/usuarios/:id', name: 'usuario-detalle' }).segments).to.deep.equal(
      [
        { dynamic: false, value: 'usuarios' },
        { dynamic: true, value: 'id' },
      ],
    );
  });

  test('ignora la barra final: "/usuarios/" compila igual que "/usuarios"', () => {
    expect(compileRoute({ path: '/usuarios/', name: 'usuarios' })).to.deep.equal(
      compileRoute({ path: '/usuarios', name: 'usuarios' }),
    );
  });
});

suite('matchRoutes', () => {
  test('una ruta estática matchea un path idéntico', () => {
    const compiled = [compileRoute({ path: '/acerca', name: 'acerca' })];
    expect(matchRoutes(compiled, '/acerca')).to.deep.equal({
      matched: true,
      name: 'acerca',
      params: {},
    });
  });

  test('una ruta con :id matchea cualquier valor y lo captura en params.id', () => {
    const compiled = [compileRoute({ path: '/usuarios/:id', name: 'usuario-detalle' })];
    expect(matchRoutes(compiled, '/usuarios/42')).to.deep.equal({
      matched: true,
      name: 'usuario-detalle',
      params: { id: '42' },
    });
  });

  test('una ruta con dos segmentos dinámicos captura ambos params', () => {
    const compiled = [compileRoute({ path: '/categorias/:cat/:id', name: 'item' })];
    expect(matchRoutes(compiled, '/categorias/libros/7')).to.deep.equal({
      matched: true,
      name: 'item',
      params: { cat: 'libros', id: '7' },
    });
  });

  test('con /usuarios/nuevo antes que /usuarios/:id, el path /usuarios/nuevo matchea la estática', () => {
    const compiled = [
      compileRoute({ path: '/usuarios/nuevo', name: 'usuario-nuevo' }),
      compileRoute({ path: '/usuarios/:id', name: 'usuario-detalle' }),
    ];
    expect(matchRoutes(compiled, '/usuarios/nuevo')).to.deep.equal({
      matched: true,
      name: 'usuario-nuevo',
      params: {},
    });
  });

  test('un path con cantidad de segmentos distinta a cualquier ruta no matchea', () => {
    const compiled = [
      compileRoute({ path: '/usuarios', name: 'usuarios' }),
      compileRoute({ path: '/usuarios/:id', name: 'usuario-detalle' }),
    ];
    expect(matchRoutes(compiled, '/usuarios/42/editar')).to.deep.equal({ matched: false });
  });

  test('el path "/" no matchea rutas con 1 o más segmentos cuando no hay ruta raíz', () => {
    const compiled = [compileRoute({ path: '/usuarios', name: 'usuarios' })];
    expect(matchRoutes(compiled, '/')).to.deep.equal({ matched: false });
  });

  test('la ruta raíz "/" matchea el path "/" exactamente', () => {
    const compiled = [compileRoute({ path: '/', name: 'home' })];
    expect(matchRoutes(compiled, '/')).to.deep.equal({ matched: true, name: 'home', params: {} });
  });
});
