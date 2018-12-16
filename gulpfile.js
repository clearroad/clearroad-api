const gulp = require('gulp');
const minimist = require('minimist');
const flagConfig = {
  string: ['port', 'version', 'ngVersion', 'animations'],
  boolean: ['dry-run'],
  alias: {
    p: 'port',
    v: 'version',
    a: 'ngVersion'
  },
  default: { port: 8000 }
};
const flags = minimist(process.argv.slice(2), flagConfig);

/* Docs tasks */
require('./scripts/docs/gulp-tasks')(gulp, flags);
