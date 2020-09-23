const { MONGO_URI, DB_SECRET, AUTH_SECRET, NODE_ENV = 'production', PORT } = process.env;

const appRoot = require('app-root-path');

const dev = {
  app: {
    port: 5000,
  },
  db: {
    database: 'mongodb://localhost:27017/sdpTrial1',
    secret: 'mysecret',
  },
  authenticationSecret: {
    secret: 'sdpSecret',
  },
  staticPaths: {
    video: `${appRoot}/storage/uploads/`,
    screenShot: `${appRoot}/storage/screenshots/`,
  },
  outputVideoPath: {
    video: `${appRoot}/storage/algorithmOutputs/outputVideo.mp4`,
  },
};

const production = {
  db: {
    database: MONGO_URI,
    secret: DB_SECRET,
  },
  app: {
    port: parseInt(PORT),
  },
  authenticationSecret: {
    secret: AUTH_SECRET,
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
  production,
};

module.exports = config[NODE_ENV];
