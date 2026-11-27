import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function readPackageManager(dir) {
  try {
    const manifest = fs.readFileSync(path.join(dir, 'package.json'), 'utf8');
    return JSON.parse(manifest).packageManager;
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
}

function resolvePackageManager(startDir) {
  for (let dir = startDir; ; dir = path.dirname(dir)) {
    const declared = readPackageManager(dir);
    if (declared !== undefined) {
      if (typeof declared === 'string' && /^(npm|pnpm)@.+$/.test(declared)) {
        return declared.split('@')[0];
      }
      throw new Error('Declara npm o pnpm con su versión en packageManager.');
    }

    const hasNpmLock = fs.existsSync(path.join(dir, 'package-lock.json'));
    const hasPnpmLock = fs.existsSync(path.join(dir, 'pnpm-lock.yaml'));
    if (hasNpmLock && hasPnpmLock) {
      throw new Error(
        'El proyecto tiene package-lock.json y pnpm-lock.yaml. Declara el gestor en packageManager.',
      );
    }
    if (hasNpmLock) return 'npm';
    if (hasPnpmLock || fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return 'pnpm';
    if (dir === path.dirname(dir) || fs.existsSync(path.join(dir, '.git'))) return 'pnpm';
  }
}

/** Ejecuta un script del directorio actual con el gestor del proyecto. */
export function runScript(scriptName, extraArgs = []) {
  let manager;
  try {
    manager = resolvePackageManager(process.cwd());
  } catch (error) {
    console.error(error.message);
    return 1;
  }

  const args = ['run', scriptName];
  if (manager === 'npm' && extraArgs.length && extraArgs[0] !== '--') args.push('--');
  const result = spawnSync(manager, [...args, ...extraArgs], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  return result.status ?? 1;
}
