import { expect } from '@open-wc/testing';
import { CCPError, CCP_ERROR_CODES } from './ccp-error.js';

suite('CCPError', () => {
  test('una instancia es instanceof Error', () => {
    const error = new CCPError(CCP_ERROR_CODES.INVALID_NAME, 'mensaje');
    expect(error).to.be.instanceOf(Error);
  });

  test('una instancia es instanceof CCPError', () => {
    const error = new CCPError(CCP_ERROR_CODES.INVALID_NAME, 'mensaje');
    expect(error).to.be.instanceOf(CCPError);
  });

  test('name es CCPError', () => {
    const error = new CCPError(CCP_ERROR_CODES.INVALID_NAME, 'mensaje');
    expect(error.name).to.equal('CCPError');
  });

  test('message es el mensaje pasado al constructor', () => {
    const error = new CCPError(CCP_ERROR_CODES.INVALID_NAME, 'nombre inválido');
    expect(error.message).to.equal('nombre inválido');
  });

  test('code es el código pasado al constructor', () => {
    const error = new CCPError(CCP_ERROR_CODES.INVALID_NAME, 'mensaje');
    expect(error.code).to.equal(CCP_ERROR_CODES.INVALID_NAME);
  });

  test('details expone el valor pasado al constructor', () => {
    const details = { id: 'x' };
    const error = new CCPError(CCP_ERROR_CODES.DUPLICATE_ID, 'mensaje', details);
    expect(error.details).to.deep.equal({ id: 'x' });
  });

  test('details es undefined si no se pasa', () => {
    const error = new CCPError(CCP_ERROR_CODES.INVALID_NAME, 'mensaje');
    expect(error.details).to.be.undefined;
  });
});
