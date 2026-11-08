import { spawnSync } from 'node:child_process';

/** Corre `pnpm run <scriptName>` en el cwd, pasando el resto de args tal cual. */
export function runScript(scriptName, extraArgs = []) {
  const result = spawnSync('pnpm', ['run', scriptName, ...extraArgs], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  return result.status ?? 1;
}
