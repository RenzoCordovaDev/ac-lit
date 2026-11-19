import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pinExternalPackageVersions } from '../src/scaffold/pin-external-versions.js';

describe('pinExternalPackageVersions', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ac-cli-pin-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function writePackageJson(pkg) {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg));
  }

  function readPackageJson() {
    return JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
  }

  it('rewrites a known "workspace:^" dependency to its real published range', () => {
    writePackageJson({ dependencies: { '@ac-base/ac-ccp': 'workspace:^' } });

    pinExternalPackageVersions(tmpDir);

    assert.equal(readPackageJson().dependencies['@ac-base/ac-ccp'], '^0.2.0');
  });

  it('rewrites "workspace:^" in devDependencies too', () => {
    writePackageJson({ devDependencies: { '@ac-components/ac-button-basic': 'workspace:^' } });

    pinExternalPackageVersions(tmpDir);

    assert.equal(readPackageJson().devDependencies['@ac-components/ac-button-basic'], '^0.1.2');
  });

  it('leaves a non-"workspace:^" range untouched', () => {
    writePackageJson({ dependencies: { lit: '^3.0.0' } });

    pinExternalPackageVersions(tmpDir);

    assert.equal(readPackageJson().dependencies.lit, '^3.0.0');
  });

  it('throws for a "workspace:^" dependency with no registered real range', () => {
    writePackageJson({ dependencies: { '@ac-base/does-not-exist': 'workspace:^' } });

    assert.throws(() => pinExternalPackageVersions(tmpDir), /No hay una versión real publicada/);
  });
});
