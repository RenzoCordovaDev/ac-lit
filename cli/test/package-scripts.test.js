import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(here, '..', '..');

// Los agregadores de la raíz usan `--if-present`: un script mal nombrado se omitiría sin error
// y CI quedaría en verde sin ejecutar nada. Este test es la red de seguridad.
const COMPONENT_SCRIPTS = [
  'component:build:styles',
  'component:build:styles:watch',
  'component:serve',
  'component:build',
  'component:preview',
  'component:test',
  'component:test:e2e',
  'component:test:e2e:run',
  'component:test:e2e:a11y',
  'component:test:e2e:a11y:run',
];

function readScripts(packageDir) {
  const pkg = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
  return Object.keys(pkg.scripts ?? {});
}

function listPackageDirs(parent) {
  const parentDir = path.join(REPO_ROOT, parent);
  return fs
    .readdirSync(parentDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(parentDir, entry.name));
}

const hasDemo = dir => fs.existsSync(path.join(dir, 'demo'));
const hasE2e = dir => fs.existsSync(path.join(dir, 'test_e2e'));

describe('component:* scripts', () => {
  const componentPackages = [
    ...listPackageDirs('packages/components'),
    ...listPackageDirs('packages/base').filter(hasDemo),
    path.join(REPO_ROOT, 'cli', 'templates', 'component'),
  ];

  for (const dir of componentPackages) {
    const label = path.relative(REPO_ROOT, dir).replaceAll('\\', '/');

    it(`${label} exposes the full component:* set`, () => {
      const scripts = readScripts(dir);
      const expected = hasE2e(dir)
        ? COMPONENT_SCRIPTS
        : COMPONENT_SCRIPTS.filter(name => !name.includes(':test:e2e'));

      assert.deepEqual(
        expected.filter(name => !scripts.includes(name)),
        [],
      );
    });

    it(`${label} has no pre-homologation script names`, () => {
      const legacy = ['build', 'test', 'dev', 'preview', 'build:styles', 'test:e2e'];

      assert.deepEqual(
        readScripts(dir).filter(name => legacy.includes(name)),
        [],
      );
    });
  }
});
