const s3 = require('s3');

if (!process.env.CI) {
  try {
    const dotenv = require('dotenv');
    dotenv.config();
  }
  catch (err) {}
}

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const Bucket = process.env.AWS_BUCKET;
const Prefix = process.env.TARGET === 'master' ? 'prod' : 'staging';

const client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId,
    secretAccessKey
  },
});

const uploadDir = (localDir, destDir) => {
  return new Promise((resolve, reject) => {
    const uploader = client.uploadDir({
      localDir,
      s3Params: {
        Bucket,
        Prefix: `${Prefix}/${destDir || ''}`
      }
    });
    uploader.on('error', reject);
    uploader.on('end', resolve);
  });
};

const uploadFile = (localFile, destFile) => {
  return new Promise((resolve, reject) => {
    const uploader = client.uploadFile({
      localFile,
      s3Params: {
        Bucket,
        Key: `${Prefix}/${destFile || ''}`
      }
    });
    uploader.on('error', reject);
    uploader.on('end', resolve);
  });
};

const run = async () => {
  try {
    console.log('Uploading dist folder...');
    await uploadDir('dist/iife', 'api');

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
      return uploadFile(file.path, `lib/${file.name}`);
    }));

    process.exit(0);
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
