const fs = require('fs');
const path = require('path');

if (!process.env.CI) {
  try {
    const dotenv = require('dotenv');
    dotenv.config();
  }
  catch (err) {}
}

const azure = require('azure-storage');
const blobService = azure.createBlobService();

const jsFile = files => files.filter(file => path.extname(file) === '.js');

const createShare = (container) => {
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

const updloadFile = (container, file) => {
  return new Promise((resolve, reject) => {
    const filename = path.basename(file);
    console.log(`\t- ${file}`);
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
    console.log('Uploading dist folder...');
    await createShare('api');
    let directory = './dist/iife';
    let files = jsFile(fs.readdirSync(path.resolve(directory)));
    await Promise.all(files.map(file => updloadFile('api', path.resolve(directory, file))));

    console.log('Uploading lib folder...');
    await createShare('lib');
    directory = './lib';
    files = jsFile(fs.readdirSync(path.resolve(directory)));
    await Promise.all(files.map(file => updloadFile('lib', path.resolve(directory, file))));

    process.exit(0);
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
