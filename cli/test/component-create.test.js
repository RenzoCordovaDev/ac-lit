import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { componentCreate } from '../src/commands/component-create.js';

function makeFakeWorkspace(tmpDir) {
  fs.writeFileSync(path.join(tmpDir, 'pnpm-workspace.yaml'), "packages:\n  - 'packages/*'\n");
  fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'ac-lit' }));
  const componentsDir = path.join(tmpDir, 'packages', 'components');
  fs.mkdirSync(componentsDir, { recursive: true });
  return componentsDir;
}

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

  it('scaffolds a component with test_e2e by default inside the ac-lit workspace', () => {
    process.chdir(makeFakeWorkspace(tmpDir));

    const destDir = componentCreate('ac-foo-basic');

    assert.equal(path.basename(destDir), 'ac-foo-basic');
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
    assert.ok(pkg.scripts['component:test:e2e']);
    assert.ok(pkg.devDependencies['@ac-base/ac-e2e-testing']);
  });

  it('omits test_e2e and its package.json entries with { e2e: false }, even inside the workspace', () => {
    process.chdir(makeFakeWorkspace(tmpDir));

    const destDir = componentCreate('ac-foo-basic', { e2e: false });

    assert.ok(!fs.existsSync(path.join(destDir, 'test_e2e')));

    const pkg = JSON.parse(fs.readFileSync(path.join(destDir, 'package.json'), 'utf8'));
    const e2eScripts = Object.keys(pkg.scripts).filter(name => name.includes(':test:e2e'));
    assert.deepEqual(e2eScripts, []);
    assert.equal(pkg.devDependencies['@ac-base/ac-e2e-testing'], undefined);
  });

  it('disables e2e automatically outside the ac-lit workspace, even without --no-e2e', () => {
    // @ac-base/ac-e2e-testing es `private`, nunca se publicó a npm -- no hay
    // ningún rango real que fijarle fuera del workspace, así que el e2e se
    // desactiva solo por defecto (sin --no-e2e explícito).
    const destDir = componentCreate('ac-foo-basic');

    assert.ok(!fs.existsSync(path.join(destDir, 'test_e2e')));

    const pkg = JSON.parse(fs.readFileSync(path.join(destDir, 'package.json'), 'utf8'));
    const e2eScripts = Object.keys(pkg.scripts).filter(name => name.includes(':test:e2e'));
    assert.deepEqual(e2eScripts, []);
    assert.equal(pkg.devDependencies['@ac-base/ac-e2e-testing'], undefined);
  });

  it('throws when the target folder already exists', () => {
    componentCreate('ac-foo-basic');
    assert.throws(() => componentCreate('ac-foo-basic'), /ya existe/);
  });

  it('throws for an invalid component name', () => {
    assert.throws(() => componentCreate('foo-basic'), /Debe ser kebab-case/);
  });

  it('pins @ac-base/* deps to their real published version outside the ac-lit workspace', () => {
    const destDir = componentCreate('ac-foo-basic');

    const pkg = JSON.parse(fs.readFileSync(path.join(destDir, 'package.json'), 'utf8'));
    assert.equal(pkg.dependencies['@ac-base/ac-component-mixin'], '^0.1.0');
    assert.equal(pkg.dependencies['@ac-base/ac-intl-mixin'], '^0.1.0');
    assert.equal(pkg.devDependencies['@ac-base/ac-core'], '^0.1.0');
    assert.equal(pkg.devDependencies['@ac-base/ac-demo-content'], '^0.1.0');
    assert.equal(pkg.devDependencies['@ac-base/cli'], '^0.2.0');
    // @ac-base/ac-e2e-testing nunca llega a este punto: el e2e ya se
    // desactivó antes de pinear versiones (ver test de arriba).
    assert.equal(pkg.devDependencies['@ac-base/ac-e2e-testing'], undefined);
  });

  it('keeps workspace:^ for @ac-base/* deps inside the ac-lit workspace', () => {
    process.chdir(makeFakeWorkspace(tmpDir));

    const destDir = componentCreate('ac-foo-basic');

    const pkg = JSON.parse(fs.readFileSync(path.join(destDir, 'package.json'), 'utf8'));
    assert.equal(pkg.dependencies['@ac-base/ac-component-mixin'], 'workspace:^');
    assert.equal(pkg.devDependencies['@ac-base/ac-core'], 'workspace:^');
  });
});
