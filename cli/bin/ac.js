#!/usr/bin/env node
import { Command } from 'commander';
import { componentCreate } from '../src/commands/component-create.js';
import { appCreate } from '../src/commands/app-create.js';
import { runScript } from '../src/commands/run-script.js';

const KNOWN_COMMANDS = new Set(['app', 'component']);
const HELP_FLAGS = new Set(['-h', '--help']);

const [, , first, ...rest] = process.argv;

if (first && KNOWN_COMMANDS.has(first)) {
  runWithCommander();
} else if (!first || HELP_FLAGS.has(first)) {
  printHelp();
} else {
  process.exitCode = runScript(first, rest);
}

function runWithCommander() {
  const program = new Command();
  program.name('ac').description('CLI de ac-lit');

  const component = program.command('component').description('Comandos de componentes');
  component
    .command('create <name>')
    .description('Scaffoldea un componente nuevo en el directorio actual')
    .option('--no-e2e', 'No incluir la suite test_e2e/ (funcional + accesibilidad)')
    .action((name, options) => {
      try {
        const destDir = componentCreate(name, { e2e: options.e2e });
        console.log(`Componente creado en ${destDir}`);
      } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
      }
    });

  const app = program.command('app').description('Comandos de proyecto');
  app
    .command('create <name>')
    .description('Scaffoldea un proyecto ac-lit nuevo en el directorio actual')
    .action(name => {
      try {
        appCreate(name);
      } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
      }
    });

  program.parse(process.argv);
}

function printHelp() {
  console.log(`ac — CLI de ac-lit

Scaffolding:
  ac component create <name> [--no-e2e]   Crea un componente en el directorio actual
  ac app create <name>                     Crea un proyecto ac-lit nuevo (pendiente)

Tareas (passthrough a "pnpm run <script>" en el directorio actual):
  ac test               ac lint              ac build
  ac test:e2e            ac test:e2e:a11y     ac component:serve
  ac <cualquier script definido en package.json>
`);
}
