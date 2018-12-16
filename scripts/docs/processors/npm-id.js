'use strict';

module.exports = function npmId(renderDocsProcessor) {
  return {
    name: 'npm-id',
    $runAfter: ['paths-computed'],
    $runBefore: ['rendering-docs'],
    $process: docs => {
      // pretty up and sort the docs object for menu generation
      docs = docs.filter(function(doc) {
        return (!!doc.name && !!doc.outputPath) || doc.docType === 'index-page';
      });

      docs.forEach(doc => {
        const ids = doc.id.match(/plugins\/(.*)\/index/);
        if (ids && ids.length) {
          doc.npmId = ids[1];
        }
      });

      return docs;
    }
  };
};
