'use strict';

module.exports = function debug() {
  return {
    name: 'debug',
    $runBefore: ['rendering-docs'],
    $process: docs => {
      docs.forEach(doc => {
        console.log(doc);
      });
    }
  };
};
