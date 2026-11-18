#!/usr/bin/env node
// Arma un sitio estático con el catálogo completo de componentes: compila
// los estilos gitignoreados de cada paquete, buildea la demo real de cada
// componente con rutas relativas, y arma `catalog-dist/` listo para servir
// en cualquier host estático (GitHub Pages u otro) -- sin reimplementar
// ninguna demo, son las mismas que `component:serve`/`component:preview`
// ya usan.
//
// Uso: node scripts/build-catalog.mjs

import { spawnSync } from 'node:child_process';
import {
  readdirSync,
  existsSync,
  rmSync,
  mkdirSync,
  cpSync,
  writeFileSync,
  readFileSync,
} from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const COMPONENTS_DIR = join(ROOT, 'packages', 'components');
const CATALOG_SITE_DIR = join(ROOT, 'catalog-site');
const LAB_REFERENCE_DIR = join(CATALOG_SITE_DIR, 'lab-reference');
const OUT_DIR = join(ROOT, 'catalog-dist');
const TOKENS_SRC_DIR = join(ROOT, 'packages', 'base', 'ac-core', 'src', 'tokens');
const TOKEN_FILES = ['base.css', 'modern-warm-palette.css', 'modern-warm-palette-light.css'];

// En Windows, `pnpm` es un shim de Corepack: spawnSync no lo encuentra sin
// pasar por una shell (ENOENT) -- mismo fix ya usado en scripts/affected.mjs.
function runPnpm(args) {
  const res = spawnSync('pnpm', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (res.status !== 0) {
    throw new Error(`pnpm ${args.join(' ')} salió con código ${res.status}`);
  }
}

function discoverComponents() {
  return readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => existsSync(join(COMPONENTS_DIR, name, 'package.json')))
    .filter(name => existsSync(join(COMPONENTS_DIR, name, 'demo')))
    .sort();
}

// Componentes de referencia del Laboratorio de aprendizaje
// (`catalog-site/lab-reference/*`, ver docs/CONVENTIONS.md) -- pedagógicos,
// nunca parte del catálogo publicable, pero su demo se buildea igual para
// poder mostrarla como "Ver solución" desde la vista del Laboratorio.
function discoverLabReferenceComponents() {
  if (!existsSync(LAB_REFERENCE_DIR)) return [];
  return readdirSync(LAB_REFERENCE_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => existsSync(join(LAB_REFERENCE_DIR, name, 'package.json')))
    .filter(name => existsSync(join(LAB_REFERENCE_DIR, name, 'demo')))
    .sort();
}

function readPackageJson(dir) {
  return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
}

function main() {
  const names = discoverComponents();
  if (names.length === 0) {
    throw new Error('No se encontró ningún componente del catálogo para buildear.');
  }
  const labNames = discoverLabReferenceComponents();
  console.log(
    `[catalog] ${names.length} componente(s) encontrados` +
      (labNames.length ? `, ${labNames.length} de referencia del Laboratorio.` : '.'),
  );

  // Fase 1/4 -- estilos. ac-demo-content primero (toda demo lo importa), y
  // cada componente después: cada uno depende de su propio `*.styles.js`
  // (gitignoreado, generado acá) antes de que cualquier `vite build` pueda
  // correr -- incluye el caso de un componente que usa a otro dentro de su
  // propia demo (ej. ac-card-basic usa ac-button-basic).
  console.log('\n[catalog] Fase 1/4 -- compilando estilos...');
  runPnpm(['--filter', '@ac-base/ac-demo-content', 'run', 'component:build:styles']);
  for (const name of names) {
    runPnpm(['--filter', `@ac-components/${name}`, 'run', 'component:build:styles']);
  }
  for (const name of labNames) {
    const pkg = readPackageJson(join(LAB_REFERENCE_DIR, name));
    runPnpm(['--filter', pkg.name, 'run', 'component:build:styles']);
  }

  // Fase 2/4 -- build de cada demo real (la misma que usa component:serve/
  // component:preview), con `--base=./` para que los assets queden en rutas
  // relativas y funcionen sin importar bajo qué subcarpeta se sirvan.
  console.log('\n[catalog] Fase 2/4 -- buildeando demos...');
  for (const name of names) {
    runPnpm(['--filter', `@ac-components/${name}`, 'exec', 'vite', 'build', '--base=./']);
  }
  for (const name of labNames) {
    const pkg = readPackageJson(join(LAB_REFERENCE_DIR, name));
    runPnpm(['--filter', pkg.name, 'exec', 'vite', 'build', '--base=./']);
  }

  // Fase 3/4 -- staging: arma catalog-dist/ desde cero. `lab-reference/` se
  // excluye de esta copia en bloque (traería `src/`, `node_modules/`, etc.
  // de cada componente pedagógico) -- solo se copia su `dist/` ya buildeado,
  // más abajo, igual que el resto de las demos.
  console.log('\n[catalog] Fase 3/4 -- armando catalog-dist/...');
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  cpSync(CATALOG_SITE_DIR, OUT_DIR, {
    recursive: true,
    filter: src => src !== LAB_REFERENCE_DIR && !src.startsWith(LAB_REFERENCE_DIR + sep),
  });

  const tokensDestDir = join(OUT_DIR, 'tokens');
  mkdirSync(tokensDestDir, { recursive: true });
  for (const file of TOKEN_FILES) {
    cpSync(join(TOKENS_SRC_DIR, file), join(tokensDestDir, file));
  }

  const demosDestDir = join(OUT_DIR, 'demos');
  mkdirSync(demosDestDir, { recursive: true });
  for (const name of names) {
    cpSync(join(COMPONENTS_DIR, name, 'dist'), join(demosDestDir, name), { recursive: true });
  }

  const labDemosDestDir = join(OUT_DIR, 'lab-reference-demos');
  mkdirSync(labDemosDestDir, { recursive: true });
  for (const name of labNames) {
    cpSync(join(LAB_REFERENCE_DIR, name, 'dist'), join(labDemosDestDir, name), {
      recursive: true,
    });
  }

  // Fase 4/4 -- manifest: la lista que lee catalog.js, generada de cero en
  // cada build -- agregar un componente nuevo al catálogo no requiere tocar
  // ningún archivo de este sitio, solo volver a correr este script.
  console.log('\n[catalog] Fase 4/4 -- generando catalog.json...');
  const components = names.map(name => {
    const pkg = readPackageJson(join(COMPONENTS_DIR, name));
    return {
      id: name,
      pkgName: pkg.name,
      description: pkg.description ?? '',
      demoEntry: `demos/${name}/index.html`,
    };
  });
  writeFileSync(
    join(OUT_DIR, 'catalog.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), components }, null, 2)}\n`,
  );

  console.log(
    `\n[catalog] Listo: ${names.length} componente(s) en ${relative(ROOT, OUT_DIR)}/` +
      (labNames.length ? ` (+ ${labNames.length} de referencia del Laboratorio)` : ''),
  );
}

main();
