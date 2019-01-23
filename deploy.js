const fs = require('fs');
const path = require('path');

if (!process.env.CI) {
  try {
    const dotenv = require('dotenv');
    dotenv.config();
  }
  catch (err) {}
}

const container = process.env.TARGET === 'master' ? 'prod' : 'dev';
const azure = require('azure-storage');
const blobService = azure.createBlobService();

const jsFile = files => files.filter(file => path.extname(file) === '.js');

const createContainer = () => {
  return new Promise((resolve, reject) => {
    blobService.createContainerIfNotExists(container, {
      publicAccessLevel: 'blob'
    }, (error, result) => {
      if (!error) {
        return resolve(result);
      }
      return reject(error);
    });
  });
};

const updloadFile = (file, filename) => {
  return new Promise((resolve, reject) => {
    console.log(`\t- ${filename} from ${file}`);
    blobService.createBlockBlobFromLocalFile(container, filename, file, (error, result) => {
      if (!error) {
        return resolve(result);
      }
      return reject(error);
    });
  });
};

const run = async () => {
  try {
    await createContainer();

    console.log('Uploading dist folder...');
    let directory = './dist/iife';
    let files = jsFile(fs.readdirSync(path.resolve(directory)));
    await Promise.all(files.map(file => {
      return updloadFile(path.resolve(directory, file), `api/${path.basename(file)}`);
    }));

    console.log('Uploading libraries...');
    files = [{
      name: 'ajv.js',
      path: 'node_modules/ajv/dist/ajv.bundle.js'
    }, {
      name: 'rsvp.js',
      path: 'node_modules/rsvp/dist/rsvp-2.0.4.js'
    }, {
      name: 'jio.js',
      path: 'node_modules/jio/dist/jio-latest.js'
    }];
    await Promise.all(files.map(file => {
      return updloadFile(path.resolve(file.path), `lib/${file.name}`);
    }));

    process.exit(0);
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
