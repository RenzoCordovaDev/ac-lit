import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { componentCreate } from '../src/commands/component-create.js';

describe('componentCreate', () => {
  let tmpDir;
  let originalCwd;

  beforeEach(() => {
    originalCwd = process.cwd();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ac-cli-test-'));
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('scaffolds a component with test_e2e by default', () => {
    const destDir = componentCreate('ac-foo-basic');

    assert.equal(destDir, path.join(tmpDir, 'ac-foo-basic'));
    assert.ok(fs.existsSync(path.join(destDir, 'src', 'foo-basic.js')));
    assert.ok(fs.existsSync(path.join(destDir, 'src', 'foo-basic.styles.scss')));
    assert.ok(fs.existsSync(path.join(destDir, 'test', 'foo-basic.test.js')));
    assert.ok(fs.existsSync(path.join(destDir, 'test_e2e', 'wdio.conf.js')));
    assert.ok(
      fs.existsSync(path.join(destDir, 'test_e2e', 'step-definitions', 'foo-basic.steps.js')),
    );

    const source = fs.readFileSync(path.join(destDir, 'src', 'foo-basic.js'), 'utf8');
    assert.match(source, /export class FooBasic/);
    assert.match(source, /return 'ac-foo-basic'/);
    assert.match(source, /FooBasicStyles/);

    const pkg = JSON.parse(fs.readFileSync(path.join(destDir, 'package.json'), 'utf8'));
    assert.equal(pkg.name, '@ac-components/ac-foo-basic');
    assert.ok(pkg.scripts['test:e2e']);
    assert.ok(pkg.devDependencies['@ac-base/ac-e2e-testing']);
  });

  it('omits test_e2e and its package.json entries with { e2e: false }', () => {
    const destDir = componentCreate('ac-foo-basic', { e2e: false });

    assert.ok(!fs.existsSync(path.join(destDir, 'test_e2e')));

    const pkg = JSON.parse(fs.readFileSync(path.join(destDir, 'package.json'), 'utf8'));
    assert.equal(pkg.scripts['test:e2e'], undefined);
    assert.equal(pkg.devDependencies['@ac-base/ac-e2e-testing'], undefined);
  });

  it('throws when the target folder already exists', () => {
    componentCreate('ac-foo-basic');
    assert.throws(() => componentCreate('ac-foo-basic'), /ya existe/);
  });

  it('throws for an invalid component name', () => {
    assert.throws(() => componentCreate('foo-basic'), /Debe ser kebab-case/);
  });
});
