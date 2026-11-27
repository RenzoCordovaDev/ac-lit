import { defaultReporter } from '@web/test-runner';

export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  reporters: [defaultReporter({ reportTestResults: true, reportTestProgress: true })],
  // Interfaz TDD de Mocha (suite/test), igual que el resto de `packages/components/*`.
  testFramework: {
    config: {
      ui: 'tdd',
    },
  },
};
