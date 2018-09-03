// Karma configuration
// Generated on Mon Sep 03 2018 13:48:57 GMT+0100 (BST)

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: [
      'jasmine',
      'karma-typescript'
    ],
    plugins: [
      'karma-jasmine',
      'karma-typescript',
      'karma-coverage',
      'karma-chrome-launcher'
    ],
    files: [
      'lib/rsvp.js',
      'lib/jio.js',
      'src/**/*.ts'
    ],
    preprocessors: {
      'src/**/!(*spec|*.d).ts': ['karma-typescript', 'coverage'],
      'src/**/*spec.ts': ['karma-typescript']
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.test.json',
      bundlerOptions: {
        transforms: [
          require('karma-typescript-es6-transform')()
        ]
      }
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [{
        type: 'text-summary',
        subdir: 'web'
      }, {
        type: 'html',
        subdir: 'web'
      }, {
        type: 'lcovonly',
        subdir: 'web'
      }],
      check: {
        global: {
          statements: 85,
          branches: 55, // TypeScript to JavaScript
          functions: 85,
          lines: 85
        }
      }
    },
    reporters: [
      'progress',
      'coverage'
    ],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [
      process.env.CI ? 'ChromeNoSandboxHeadless' : 'Chrome'
    ],
    customLaunchers: {
      ChromeNoSandboxHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222'
        ]
      }
    },
    singleRun: true
  });
};
