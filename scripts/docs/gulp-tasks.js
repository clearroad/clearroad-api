const path = require('path');
const fs = require('fs-extra-promise').useFs(require('fs-extra'));
const copydir = require('copy-dir');
const Dgeni = require('dgeni');
const ROOT = path.resolve(path.join(__dirname, '../../'));
const projectPackage = require(path.resolve(ROOT, 'package.json'));
const config = require('../config.json');
const DOCS_PATH = path.resolve(ROOT, config.sitePath, config.docsDir);
const CURRENT_VERSION = projectPackage.version;
const VERSION_FILE_NAME = 'version.txt';
const VERSION_FILE_PATH = path.resolve(DOCS_PATH, VERSION_FILE_NAME);

module.exports = gulp => {
  gulp.task('docs', () => {
    fs.mkdirpSync(DOCS_PATH);

    // move current docs to version folder
    if (fs.existsSync(VERSION_FILE_PATH)) {
      const OLD_VERSION = fs.readFileSync(VERSION_FILE_PATH, 'utf8');

      if (OLD_VERSION != CURRENT_VERSION) {
        const PREVIOUS_VERSION_FOLDER = '_versions';
        const OLD_DOCS_PATH = path.join(DOCS_PATH, PREVIOUS_VERSION_FOLDER, OLD_VERSION).trim();

        fs.mkdirpSync(OLD_DOCS_PATH);

        fs.readdirSync(DOCS_PATH)
          .filter(file => file !== VERSION_FILE_NAME) // skip version.txt file since folder contains version
          .filter(file => file !== PREVIOUS_VERSION_FOLDER)
          .forEach(file => {
            const filePath = path.resolve(DOCS_PATH, file);
            const oldDocsPath = path.join(OLD_DOCS_PATH, file.trim());

            if (fs.lstatSync(filePath).isDirectory()) {
              fs.mkdirpSync(oldDocsPath);
              copydir.sync(filePath, oldDocsPath);
            }
            else {
              fs.copySync(filePath, oldDocsPath);
            }

            fs.removeSync(filePath);
          });
      }
    }

    // write new version
    fs.writeFileSync(path.resolve(DOCS_PATH, VERSION_FILE_NAME), CURRENT_VERSION, 'utf8');

    try {
      const dgeni = new Dgeni([require('./dgeni-config')(CURRENT_VERSION)]);
      return dgeni.generate().then(docs => console.log(docs.length + ' docs generated'));
    }
    catch (err) {
      console.log(err.stack);
    }
  });
};
