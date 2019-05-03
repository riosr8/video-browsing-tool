const env = process.env.NODE_ENV || 'dev';
const devPort = parseInt(process.env.DEV_APP_PORT) || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sdpTrial1';
const dbSecret = process.env.DB_SECRET || 'mysecret';

const dev = {
  app: {
    port: devPort,
  },
  db: {
    database: mongoUri,
    secret: dbSecret,
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
};

const config = {
  dev,
  test,
};

module.exports = config[env];
