import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deriveComponentNames } from '../src/scaffold/naming.js';

describe('deriveComponentNames', () => {
  it('derives class/file/package names from a valid ac- name', () => {
    const names = deriveComponentNames('ac-foo-basic');
    assert.equal(names.tag, 'ac-foo-basic');
    assert.equal(names.folder, 'ac-foo-basic');
    assert.equal(names.fileBase, 'foo-basic');
    assert.equal(names.className, 'FooBasic');
    assert.equal(names.stylesExportName, 'FooBasicStyles');
    assert.equal(names.packageName, '@ac-components/ac-foo-basic');
  });

  it('handles a single-word component name', () => {
    const names = deriveComponentNames('ac-card');
    assert.equal(names.fileBase, 'card');
    assert.equal(names.className, 'Card');
  });

  it('rejects a name without the ac- prefix', () => {
    assert.throws(() => deriveComponentNames('foo-basic'), /Debe ser kebab-case/);
  });

  it('rejects a non-kebab-case name', () => {
    assert.throws(() => deriveComponentNames('ac-FooBasic'), /Debe ser kebab-case/);
  });
});
