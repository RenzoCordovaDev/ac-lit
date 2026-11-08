import { defaultReporter } from '@web/test-runner';

export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  reporters: [defaultReporter({ reportTestResults: true, reportTestProgress: true })],
  // Interfaz TDD de Mocha (suite/test/setup/teardown en vez de
  // describe/it/before/after) — alinea el naming con el framework del cliente.
  testFramework: {
    config: {
      ui: 'tdd',
    },
  },
};
