'use strict';

module.exports = function(templateEngine) {
  // add custom filters to nunjucks
  templateEngine.filters.push(
    require('../filters/capital'),
    require('../filters/code'),
    require('../filters/dump'),
    require('../filters/pipecode'),
    require('../filters/dashify'),
    require('../filters/version')
  );
};
