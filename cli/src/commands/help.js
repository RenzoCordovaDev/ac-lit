import fs from 'node:fs';
import path from 'node:path';
import { COMMANDS } from './registry.js';

const COMMON_TASKS = [
  ['ac test', 'ac lint', 'ac build'],
  ['ac test:e2e', 'ac test:e2e:a11y', 'ac component:serve'],
];

function readScripts(cwd) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    return Object.entries(pkg.scripts ?? {});
  } catch {
    return [];
  }
}

function commandUsage(command) {
  const options = command.options.map(([flags]) => `[${flags}]`);
  return ['ac', command.name, command.args, ...options].filter(Boolean).join(' ');
}

/** Texto de `ac help`: comandos propios, passthrough y scripts del package.json del cwd. */
export function formatHelp(cwd = process.cwd()) {
  const usages = COMMANDS.map(commandUsage);
  const width = Math.max(...usages.map(usage => usage.length), 'ac help'.length);
  const row = (usage, description) => `  ${usage.padEnd(width)}  ${description}`;

  const lines = [
    'ac — CLI de ac-lit',
    '',
    'Comandos:',
    ...COMMANDS.map((command, index) => row(usages[index], command.description)),
    row('ac help', 'Lista todos los comandos disponibles (también: ac -h, ac --help)'),
    '',
    'Tareas (passthrough a "pnpm run <script>" en el directorio actual):',
    ...COMMON_TASKS.map(group => `  ${group.join('    ')}`),
    '  ac <cualquier script definido en package.json>',
  ];

  const scripts = readScripts(cwd);
  if (scripts.length > 0) {
    const scriptWidth = Math.max(...scripts.map(([name]) => name.length));
    lines.push(
      '',
      'Scripts disponibles en este directorio (package.json):',
      ...scripts.map(([name, command]) => `  ac ${name.padEnd(scriptWidth)}  ${command}`),
    );
  }

  return `${lines.join('\n')}\n`;
}
