import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { appCreate } from '../src/commands/app-create.js';

function makeFakeWorkspace(tmpDir) {
  fs.writeFileSync(path.join(tmpDir, 'pnpm-workspace.yaml'), "packages:\n  - 'apps/*'\n");
  fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'ac-lit' }));
  const appsDir = path.join(tmpDir, 'apps');
  fs.mkdirSync(appsDir, { recursive: true });
  return appsDir;
}

describe('appCreate', () => {
  let tmpDir;
  let originalCwd;

  beforeEach(() => {
    originalCwd = process.cwd();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ac-cli-app-test-'));
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('scaffolds an app with the expected files', () => {
    const destDir = appCreate('mi-app');

    assert.equal(path.basename(destDir), 'mi-app');
    assert.ok(fs.existsSync(path.join(destDir, 'index.html')));
    assert.ok(fs.existsSync(path.join(destDir, 'src', 'app.js')));
    assert.ok(fs.existsSync(path.join(destDir, 'src', 'pages', 'home-page.js')));
    assert.ok(fs.existsSync(path.join(destDir, 'src', 'pages', 'users-table-page.js')));
    assert.ok(fs.existsSync(path.join(destDir, 'src', 'pages', 'selected-user-badge-page.js')));
  });

  it('generates a package.json without a scope, marked private', () => {
    const destDir = appCreate('mi-app');

    const pkg = JSON.parse(fs.readFileSync(path.join(destDir, 'package.json'), 'utf8'));
    assert.equal(pkg.name, 'mi-app');
    assert.equal(pkg.private, true);
    assert.equal(pkg.publishConfig, undefined);
  });

  it('renders __title__ as a human-readable title', () => {
    const destDir = appCreate('mi-app');

    const html = fs.readFileSync(path.join(destDir, 'index.html'), 'utf8');
    assert.match(html, /Mi App/);
  });

  it('throws when the target folder already exists', () => {
    appCreate('mi-app');
    assert.throws(() => appCreate('mi-app'), /ya existe/);
  });

  it('throws for an invalid app name', () => {
    assert.throws(() => appCreate('MiApp'), /Debe ser kebab-case/);
  });

  it('does not require an ac- prefix', () => {
    assert.doesNotThrow(() => appCreate('foo-app'));
  });

  it('pins @ac-base/* and @ac-components/* deps to their real published version outside the ac-lit workspace', () => {
    const destDir = appCreate('mi-app');

    const pkg = JSON.parse(fs.readFileSync(path.join(destDir, 'package.json'), 'utf8'));
    assert.equal(pkg.dependencies['@ac-base/ac-ccp'], '^0.2.0');
    assert.equal(pkg.dependencies['@ac-components/ac-button-basic'], '^0.1.2');
    assert.equal(pkg.dependencies['@ac-components/ac-badge-basic'], '^0.1.2');
  });

  it('keeps workspace:^ for internal deps inside the ac-lit workspace', () => {
    process.chdir(makeFakeWorkspace(tmpDir));

    const destDir = appCreate('mi-app');

    const pkg = JSON.parse(fs.readFileSync(path.join(destDir, 'package.json'), 'utf8'));
    assert.equal(pkg.dependencies['@ac-base/ac-ccp'], 'workspace:^');
    assert.equal(pkg.dependencies['@ac-components/ac-button-basic'], 'workspace:^');
  });
});
