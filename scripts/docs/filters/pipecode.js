'use strict';

module.exports = {
  name: 'pipecode',
  process: str => str ? str.replace(/ \| /g, '&#124;') : ''
};
