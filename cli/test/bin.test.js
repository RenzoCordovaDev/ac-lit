import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const BIN = path.join(here, '..', 'bin', 'ac.js');

function runAc(args, cwd) {
  return spawnSync(process.execPath, [BIN, ...args], { cwd, encoding: 'utf8' });
}

describe('ac (bin)', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ac-cli-bin-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('scaffolds a component via `ac component:create <name>`', () => {
    const result = runAc(['component:create', 'ac-foo-basic'], tmpDir);

    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(tmpDir, 'ac-foo-basic', 'src', 'foo-basic.js')));
    assert.ok(fs.existsSync(path.join(tmpDir, 'ac-foo-basic', 'test_e2e')));
  });

  it('honors --no-e2e', () => {
    const result = runAc(['component:create', 'ac-foo-basic', '--no-e2e'], tmpDir);

    assert.equal(result.status, 0, result.stderr);
    assert.ok(!fs.existsSync(path.join(tmpDir, 'ac-foo-basic', 'test_e2e')));
  });

  it('exits non-zero with a clear message for an invalid name', () => {
    const result = runAc(['component:create', 'foo-basic'], tmpDir);

    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /Debe ser kebab-case/);
  });

  it('exits non-zero with a clear message for `ac app:create` (not implemented yet)', () => {
    const result = runAc(['app:create', 'mi-app'], tmpDir);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /todavía no está implementado/);
  });

  it('suggests the colon form for the old space-separated syntax', () => {
    const result = runAc(['component', 'create', 'ac-foo-basic'], tmpDir);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /¿Quisiste decir `ac component:create`\?/);
  });

  it('does not scaffold anything with the old space-separated syntax', () => {
    runAc(['component', 'create', 'ac-foo-basic'], tmpDir);

    assert.ok(!fs.existsSync(path.join(tmpDir, 'ac-foo-basic')));
  });

  it('passes through to `pnpm run <script>` for anything else', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'tmp', scripts: { echo: 'node -e "console.log(123)"' } }),
    );

    const result = runAc(['echo'], tmpDir);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /123/);
  });

  it('passes through `ac component:serve` without trying to parse it as a subcommand', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({
        name: 'tmp',
        scripts: { 'component:serve': 'node -e "console.log(\'serving\')"' },
      }),
    );

    const result = runAc(['component:serve'], tmpDir);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /serving/);
  });

  it('prints help with no arguments', () => {
    const result = runAc([], tmpDir);

    assert.equal(result.status, 0);
    assert.match(result.stdout, /ac component:create/);
  });

  it('lists every built-in command with `ac help`', () => {
    const result = runAc(['help'], tmpDir);

    assert.match(result.stdout, /ac component:create .*\n.*ac app:create/);
  });

  it('prints the same help for -h and --help', () => {
    const outputs = ['help', '-h', '--help'].map(flag => runAc([flag], tmpDir).stdout);

    assert.equal(new Set(outputs).size, 1);
  });

  it('lists the scripts of the current package.json in `ac help`', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'tmp', scripts: { 'my:task': 'node -e "1"' } }),
    );

    const result = runAc(['help'], tmpDir);

    assert.match(result.stdout, /ac my:task/);
  });

  it('prefers the built-in `help` over a package script with the same name', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'tmp', scripts: { help: 'node -e "console.log(\'from script\')"' } }),
    );

    const result = runAc(['help'], tmpDir);

    assert.match(result.stdout, /Comandos:/);
  });
});
