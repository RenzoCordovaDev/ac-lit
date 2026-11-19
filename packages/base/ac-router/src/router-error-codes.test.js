import { expect } from '@open-wc/testing';
import { ROUTER_ERROR_CODES } from './router-error-codes.js';

suite('ROUTER_ERROR_CODES', () => {
  test('tiene exactamente las 4 claves con sus valores', () => {
    expect(ROUTER_ERROR_CODES).to.deep.equal({
      INVALID_ROUTES: 'invalid-routes',
      UNKNOWN_ROUTE_NAME: 'unknown-route-name',
      MISSING_PARAM: 'missing-param',
      DESTROYED: 'destroyed',
    });
  });

  test('el objeto está congelado', () => {
    expect(Object.isFrozen(ROUTER_ERROR_CODES)).to.be.true;
  });

  test('reasignar una clave no cambia su valor', () => {
    try {
      ROUTER_ERROR_CODES.INVALID_ROUTES = 'otro-valor';
    } catch {
      // En un módulo ESM (modo estricto) la asignación lanza TypeError; no nos importa, solo el valor final.
    }
    expect(ROUTER_ERROR_CODES.INVALID_ROUTES).to.equal('invalid-routes');
  });
});
