import fs from 'node:fs';
import path from 'node:path';

/**
 * Sube desde `startDir` buscando la raíz del workspace de pnpm de `ac-lit`
 * (una carpeta con `pnpm-workspace.yaml` y un `package.json` con
 * `"name": "ac-lit"`). El scaffolding la usa para decidir si las
 * dependencias `@ac-base/*` del componente nuevo deben apuntar al workspace
 * local (`workspace:^`) o a su versión real publicada en npm.
 */
export function isInsideAcLitWorkspace(startDir) {
  let dir = startDir;

  while (true) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) {
      return readPackageName(path.join(dir, 'package.json')) === 'ac-lit';
    }

    const parent = path.dirname(dir);
    if (parent === dir) return false;
    dir = parent;
  }
}

function readPackageName(pkgPath) {
  try {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).name;
  } catch {
    return undefined;
  }
}
