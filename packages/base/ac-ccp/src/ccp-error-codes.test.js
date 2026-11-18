import { expect } from '@open-wc/testing';
import { CCP_ERROR_CODES } from './ccp-error-codes.js';

suite('CCP_ERROR_CODES', () => {
  test('expone los 7 códigos esperados', () => {
    expect(Object.keys(CCP_ERROR_CODES)).to.have.members([
      'INVALID_NAME',
      'DUPLICATE_ID',
      'UNKNOWN_ENDPOINT',
      'DESTROYED',
      'PUBLISH_ON_IN',
      'SUBSCRIBE_ON_OUT',
      'ENDPOINT_DISCONNECTED',
    ]);
  });

  test('cada valor es un string en kebab-case distinto', () => {
    const values = Object.values(CCP_ERROR_CODES);
    expect(new Set(values).size).to.equal(values.length);
    expect(values.every(v => /^[a-z]+(-[a-z]+)*$/.test(v))).to.be.true;
  });

  test('el objeto está congelado', () => {
    expect(Object.isFrozen(CCP_ERROR_CODES)).to.be.true;
  });
});
