#!/usr/bin/env node
// Corre los scripts raíz (test, build, lint, test:e2e, test:e2e:a11y) acotados
// a los paquetes afectados respecto a un ref de git — o el workspace completo
// cuando corresponde. Ver "CI es la validación completa; el trabajo local es
// acotado" en docs/CONVENTIONS.md para la decisión de diseño detrás de esto.
//
// Uso:
//   node scripts/affected.mjs pnpm-run [--all] [--concurrency=<n>] <script...>
//     Corre `pnpm [--filter "...[<ref>]" | -r] [--workspace-concurrency=<n>]
//     --if-present run <script>` por cada <script>, en orden. El filtro nativo
//     de pnpm (`...[<ref>]`) selecciona el paquete que cambió MÁS todo lo que
//     depende de él (dependientes), no solo el paquete tocado.
//
//   node scripts/affected.mjs eslint [--all]
//     Corre ESLint. En modo filtrado, acotado a los directorios de los
//     paquetes afectados (no todos exponen un script `component:lint`/`lint`
//     propio — ac-core, los mixins, el cli — así que acá no se puede apoyar
//     en `--if-present run` como con test/build; se invoca `eslint` directo
//     sobre los directorios resueltos por `pnpm ... list --json`).
//
// Variables de entorno:
//   AFFECTED_BASE_REF  Ref de git contra el que diffear (default: origin/main).
//                      En CI, ci.yml la fija según el evento (PR vs push).

import { spawnSync } from 'node:child_process';
import { relative } from 'node:path';

const ROOT = process.cwd();

// Cambios en cualquiera de estos archivos/carpetas pueden afectar a cualquier
// paquete del workspace sin que el grafo de dependencias de pnpm lo detecte
// (config de build/lint/workspace compartida, CI, scripts de este mismo
// filtro) — forzar la corrida completa es el fallback seguro.
const FULL_RUN_TRIGGERS = [
  /^package\.json$/,
  /^pnpm-workspace\.yaml$/,
  /^pnpm-lock\.yaml$/,
  /^eslint\.config\.js$/,
  /^\.github\/workflows\//,
  /^scripts\//,
  /^\.npmrc$/,
  /^\.nvmrc$/,
];

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, { encoding: 'utf8', ...opts });
}

function resolveBaseRef() {
  return process.env.AFFECTED_BASE_REF?.trim() || 'origin/main';
}

function refExists(ref) {
  return run('git', ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`]).status === 0;
}

function changedFiles(ref) {
  const res = run('git', ['diff', '--name-only', ref, '--', ROOT]);
  if (res.status !== 0) return null;
  return res.stdout
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function matchesFullRunTrigger(file) {
  return FULL_RUN_TRIGGERS.some(re => re.test(file));
}

// Decide si correr filtrado por afectados o el workspace completo.
// Devuelve { mode: 'full', reason } o { mode: 'filtered', ref }.
function decideMode({ forceAll }) {
  if (forceAll) {
    return { mode: 'full', reason: 'se pidió explícitamente con --all' };
  }
  const ref = resolveBaseRef();
  if (!refExists(ref)) {
    return { mode: 'full', reason: `el ref "${ref}" no existe en este checkout` };
  }
  const files = changedFiles(ref);
  if (files === null) {
    return { mode: 'full', reason: `no se pudo calcular el diff contra "${ref}"` };
  }
  const trigger = files.find(matchesFullRunTrigger);
  if (trigger) {
    return { mode: 'full', reason: `cambió un archivo de configuración raíz (${trigger})` };
  }
  return { mode: 'filtered', ref, fileCount: files.length };
}

function logDecision(label, decision) {
  const detail =
    decision.mode === 'full'
      ? decision.reason
      : `ref=${decision.ref}, ${decision.fileCount} archivo(s) cambiado(s)`;
  console.log(`[affected] ${label}: modo=${decision.mode} (${detail})`);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (const arg of argv) {
    if (arg === '--all') {
      flags.all = true;
    } else if (arg.startsWith('--concurrency=')) {
      flags.concurrency = arg.split('=')[1];
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

function runPnpmRun(argv) {
  const { positional: scripts, flags } = parseArgs(argv);
  if (scripts.length === 0) {
    console.error(
      'Uso: node scripts/affected.mjs pnpm-run [--all] [--concurrency=<n>] <script...>',
    );
    process.exit(1);
  }
  const decision = decideMode({ forceAll: Boolean(flags.all) });
  logDecision(`pnpm-run ${scripts.join(', ')}`, decision);

  const baseArgs = decision.mode === 'filtered' ? ['--filter', `...[${decision.ref}]`] : ['-r'];
  if (flags.concurrency) baseArgs.push(`--workspace-concurrency=${flags.concurrency}`);
  baseArgs.push('--if-present');

  for (const script of scripts) {
    const res = spawnSync('pnpm', [...baseArgs, 'run', script], { stdio: 'inherit' });
    if (res.status !== 0) process.exit(res.status ?? 1);
  }
}

// Paquetes afectados como lista de directorios (relativos a la raíz), vía
// `pnpm ... list --depth -1 --json` — no depende de que el paquete tenga
// ningún script propio (a diferencia de `--if-present run <script>`), así
// que sirve igual para paquetes sin `component:lint`/`lint` (ac-core, los
// mixins, el cli).
function affectedPackageDirs(ref) {
  const res = run('pnpm', ['--filter', `...[${ref}]`, 'list', '--depth', '-1', '--json']);
  if (res.status !== 0) return null;
  try {
    const pkgs = JSON.parse(res.stdout);
    return pkgs.map(p => relative(ROOT, p.path)).filter(dir => dir !== '');
  } catch {
    return null;
  }
}

function runEslint(argv) {
  const { flags } = parseArgs(argv);
  const decision = decideMode({ forceAll: Boolean(flags.all) });
  logDecision('eslint', decision);

  let targets = ['.'];
  if (decision.mode === 'filtered') {
    const dirs = affectedPackageDirs(decision.ref);
    if (dirs === null) {
      console.log(
        '[affected] eslint: no se pudo resolver la lista de paquetes afectados, corriendo sobre todo el repo',
      );
      targets = ['.'];
    } else if (dirs.length === 0) {
      console.log('[affected] eslint: ningún paquete afectado, nada que lintear');
      return;
    } else {
      targets = dirs;
    }
  }

  const res = spawnSync('eslint', targets, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  process.exit(res.status ?? 1);
}

const [subcommand, ...rest] = process.argv.slice(2);

switch (subcommand) {
  case 'pnpm-run':
    runPnpmRun(rest);
    break;
  case 'eslint':
    runEslint(rest);
    break;
  default:
    console.error('Uso: node scripts/affected.mjs <pnpm-run|eslint> [opciones]');
    process.exit(1);
}
