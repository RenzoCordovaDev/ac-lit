#!/usr/bin/env node
import { Command } from 'commander';
import { COMMANDS, findCommand } from '../src/commands/registry.js';
import { formatHelp } from '../src/commands/help.js';
import { runScript } from '../src/commands/run-script.js';

const HELP_FLAGS = new Set(['-h', '--help']);
// Namespaces que antes eran subcomandos con espacio (`ac component create`).
const LEGACY_NAMESPACES = new Set(['component', 'app']);

const [, , first, ...rest] = process.argv;

if (findCommand(first)) {
  runWithCommander();
} else if (!first || first === 'help' || HELP_FLAGS.has(first)) {
  process.stdout.write(formatHelp());
} else if (LEGACY_NAMESPACES.has(first)) {
  printLegacyHint(first, rest[0]);
} else {
  process.exitCode = runScript(first, rest);
}

function runWithCommander() {
  const program = new Command();
  program.name('ac').description('CLI de ac-lit');

  for (const definition of COMMANDS) {
    const command = program
      .command(`${definition.name} ${definition.args}`)
      .description(definition.description);
    for (const [flags, description] of definition.options) {
      command.option(flags, description);
    }
    command.action((...actionArgs) => {
      const options = actionArgs[actionArgs.length - 2];
      const positional = actionArgs.slice(0, -2);
      try {
        definition.run(...positional, options);
      } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
      }
    });
  }

  program.parse(process.argv);
}

function printLegacyHint(namespace, action) {
  const suggestion = action ? `${namespace}:${action}` : undefined;
  const hint =
    suggestion && findCommand(suggestion) ? ` ¿Quisiste decir \`ac ${suggestion}\`?` : '';
  console.error(
    `\`ac ${namespace}\` ya no existe: los comandos usan la forma \`${namespace}:<accion>\`.${hint}\nEjecuta \`ac help\` para ver todos los comandos.`,
  );
  process.exitCode = 1;
}
