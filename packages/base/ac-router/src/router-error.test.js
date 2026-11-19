import { expect } from '@open-wc/testing';
import { RouterError, ROUTER_ERROR_CODES } from './router-error.js';

suite('RouterError', () => {
  test('una instancia es instanceof Error', () => {
    const error = new RouterError(ROUTER_ERROR_CODES.DESTROYED, 'mensaje');
    expect(error).to.be.instanceOf(Error);
  });

  test('una instancia es instanceof RouterError', () => {
    const error = new RouterError(ROUTER_ERROR_CODES.DESTROYED, 'mensaje');
    expect(error).to.be.instanceOf(RouterError);
  });

  test('name es RouterError', () => {
    const error = new RouterError(ROUTER_ERROR_CODES.DESTROYED, 'mensaje');
    expect(error.name).to.equal('RouterError');
  });

  test('message es el mensaje pasado al constructor', () => {
    const error = new RouterError(ROUTER_ERROR_CODES.DESTROYED, 'ruta inválida');
    expect(error.message).to.equal('ruta inválida');
  });

  test('code es el código pasado al constructor', () => {
    const error = new RouterError(ROUTER_ERROR_CODES.MISSING_PARAM, 'mensaje');
    expect(error.code).to.equal(ROUTER_ERROR_CODES.MISSING_PARAM);
  });

  test('sin details, la instancia no tiene la propiedad details', () => {
    const error = new RouterError(ROUTER_ERROR_CODES.DESTROYED, 'mensaje');
    expect(error).to.not.have.property('details');
  });

  test('details expone el valor pasado al constructor', () => {
    const details = { name: 'usuario' };
    const error = new RouterError(ROUTER_ERROR_CODES.UNKNOWN_ROUTE_NAME, 'mensaje', details);
    expect(error.details).to.deep.equal({ name: 'usuario' });
  });

  test('ROUTER_ERROR_CODES se reexporta desde router-error.js con las 4 claves', () => {
    expect(Object.keys(ROUTER_ERROR_CODES)).to.deep.equal([
      'INVALID_ROUTES',
      'UNKNOWN_ROUTE_NAME',
      'MISSING_PARAM',
      'DESTROYED',
    ]);
  });
});
