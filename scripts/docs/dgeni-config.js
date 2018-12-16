'use strict';

const Package = require('dgeni').Package;
const jsdocPackage = require('dgeni-packages/jsdoc');
const nunjucksPackage = require('dgeni-packages/nunjucks');
const typescriptPackage = require('dgeni-packages/typescript');
const linksPackage = require('dgeni-packages/links');
const path = require('path');
const ROOT = path.resolve(path.join(__dirname, '../../'));
const config = require('../config.json');

module.exports = currentVersion => {
  return new Package('clearroad-api-docs', [jsdocPackage, nunjucksPackage, typescriptPackage, linksPackage])
    // .processor(require('./processors/debug'))
    .processor(require('./processors/remove-private-members'))
    .processor(require('./processors/hide-private-api'))
    .processor(require('./processors/parse-optional'))
    .processor(require('./processors/parse-returns-object'))
    // .processor(require('./processors/mark-properties'))
    .processor(require('./processors/npm-id'))

    .config(require('./configs/log'))
    .config(require('./configs/template-filters'))
    .config(require('./configs/template-tags'))
    .config(require('./configs/tag-defs'))
    .config(require('./configs/links'))

    .config(function(renderDocsProcessor, computePathsProcessor) {
      currentVersion = {
        href: '/' + config.docsDir,
        folder: '',
        name: currentVersion
      };

      renderDocsProcessor.extraData.version = {
        list: [currentVersion],
        current: currentVersion,
        latest: currentVersion
      };

      computePathsProcessor.pathTemplates = [{
        docTypes: ['class'],
        getOutputPath: doc => {
          if (doc.pluginId) {
            if (doc.pluginName) {
              return config.docsDir + '/' +  doc.pluginId + '/' + doc.pluginName + '/README.md';
            }
            else {
              return config.docsDir + '/' +  doc.pluginId + '/README.md';
            }
          }

          return config.docsDir + '/' +  doc.name + '/README.md';
        }
      }];
    })

    //configure file reading
    .config(function(readFilesProcessor, readTypeScriptModules) {
      // Don't run unwanted processors since we are not using the normal file reading processor
      readFilesProcessor.$enabled = false;
      readFilesProcessor.basePath = ROOT;

      readTypeScriptModules.basePath = ROOT;
      readTypeScriptModules.sourceFiles = [
        './src/**/*.ts',
      ];
    })

    // Configure file writing
    .config(function(writeFilesProcessor) {
      writeFilesProcessor.outputFolder = config.sitePath;
    })

    // Configure rendering
    .config(function(templateFinder) {
      templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

      // Specify how to match docs to templates.
      templateFinder.templatePatterns = [
        '${ doc.template }',
        '${ doc.docType }.template.html',
        'common.template.html'
      ];
    });
};
