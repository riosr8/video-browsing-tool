// module.exports = {
//   secret: 'sdpSecret',
// };

const env = process.env.NODE_ENV || 'dev'; // 'dev' or 'test'
const devPort = parseInt(process.env.DEV_APP_PORT) || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sdpTrial1';
const dbSecret = process.env.DB_SECRET || 'mysecret';
const authSecret = process.env.AUTH_SECRET || 'sdpSecret';
const appRoot = require('app-root-path');

const dev = {
  app: {
    port: devPort,
  },
  db: {
    database: mongoUri,
    secret: dbSecret,
  },
  authenticationSecret: {
    secret: authSecret,
  },
  staticPaths: {
    video: `${appRoot}/storage/uploads/`,
    screenShot: `${appRoot}/storage/screenshots/`,
  },
  outputVideoPath: {
    video: `${appRoot}/storage/algorithmOutputs/outputVideo.mp4`,
  },
};
const test = {
  app: {
    port: parseInt(process.env.TEST_APP_PORT) || 3000,
  },
  db: {
    database: 'mongodb://localhost:27017/dbTesting',
    secret: 'mysecret',
  },
  authenticationSecret: {
    secret: 'sdpSecret',
  },
  staticPaths: {
    video: `${appRoot}/test/testVideoFiles/`,
    screenShot: `${appRoot}/test/testScreenShots/`,
  },
  outputVideoPath: {
    video: `${appRoot}/storage/algorithmOutputs/outputVideo.mp4`,
  },
};

const config = {
  dev,
  test,
};

module.exports = config[env];
