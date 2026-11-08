import { defaultReporter } from '@web/test-runner';

export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  reporters: [defaultReporter({ reportTestResults: true, reportTestProgress: true })],
  testFramework: {
    config: {
      ui: 'tdd',
    },
  },
};
