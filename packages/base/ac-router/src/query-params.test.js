import { expect } from '@open-wc/testing';
import { parseQuery, stringifyQuery } from './query-params.js';

suite('parseQuery', () => {
  test('convierte una query string con un solo parámetro', () => {
    expect(parseQuery('foo=bar')).to.deep.equal({ foo: 'bar' });
  });

  test('convierte varios parámetros y mantiene todos los valores como string', () => {
    expect(parseQuery('foo=bar&baz=1')).to.deep.equal({ foo: 'bar', baz: '1' });
  });

  test('ignora el "?" inicial de la query string', () => {
    expect(parseQuery('?foo=bar')).to.deep.equal({ foo: 'bar' });
  });

  test('devuelve un objeto vacío para una cadena vacía', () => {
    expect(parseQuery('')).to.deep.equal({});
  });

  test('devuelve un objeto vacío para undefined sin lanzar', () => {
    expect(parseQuery(undefined)).to.deep.equal({});
  });

  test('con una clave repetida se queda con el último valor', () => {
    expect(parseQuery('foo=1&foo=2')).to.deep.equal({ foo: '2' });
  });
});

suite('stringifyQuery', () => {
  test('convierte un objeto con un solo parámetro', () => {
    expect(stringifyQuery({ foo: 'bar' })).to.equal('foo=bar');
  });

  test('convierte un objeto con varios parámetros', () => {
    expect(stringifyQuery({ foo: 'bar', baz: '1' })).to.equal('foo=bar&baz=1');
  });

  test('devuelve una cadena vacía para un objeto vacío', () => {
    expect(stringifyQuery({})).to.equal('');
  });

  test('devuelve una cadena vacía para undefined sin lanzar', () => {
    expect(stringifyQuery(undefined)).to.equal('');
  });

  test('convierte un valor numérico a string sin perderlo', () => {
    expect(stringifyQuery({ page: 2 })).to.equal('page=2');
  });

  test('round-trip: parseQuery devuelve el objeto original tras stringifyQuery', () => {
    expect(parseQuery(stringifyQuery({ foo: 'bar', baz: 'qux' }))).to.deep.equal({
      foo: 'bar',
      baz: 'qux',
    });
  });
});
