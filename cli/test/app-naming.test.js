import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deriveAppNames } from '../src/scaffold/naming.js';

describe('deriveAppNames', () => {
  it('derives folder/package/title names from a valid kebab-case name', () => {
    const names = deriveAppNames('mi-app');
    assert.equal(names.folder, 'mi-app');
    assert.equal(names.packageName, 'mi-app');
    assert.equal(names.title, 'Mi App');
  });

  it('handles a single-word app name', () => {
    const names = deriveAppNames('catalogo');
    assert.equal(names.folder, 'catalogo');
    assert.equal(names.title, 'Catalogo');
  });

  it('does not require an ac- prefix', () => {
    assert.doesNotThrow(() => deriveAppNames('foo-app'));
  });

  it('rejects a non-kebab-case name', () => {
    assert.throws(() => deriveAppNames('MiApp'), /Debe ser kebab-case/);
  });
});
