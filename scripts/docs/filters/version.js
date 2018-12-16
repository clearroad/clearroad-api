'use strict';

const path = require('path');
const ROOT = path.resolve(path.join(__dirname, '../../../'));
const projectPackage = require(path.resolve(ROOT, 'package.json'));
const CURRENT_VERSION = projectPackage.version;

module.exports = {
  name: 'version',
  process: () => CURRENT_VERSION
};
