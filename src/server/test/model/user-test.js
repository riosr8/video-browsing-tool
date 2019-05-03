const mongoose = require('mongoose');
const chai = require('chai');
const User = require('../../models/user');
const config = require('../../config/config');
// eslint-disable-next-line prefer-destructuring
const assert = chai.assert;

const database = { database: config.db.database, secret: config.db.secret };

// eslint-disable-next-line no-unused-vars
const should = chai.should();

describe('User Login Tests ', () => {
  const collectionName = 'users';
  const emailOfUser = 'test@test.com';
  const passwordOfUser = 'test';

  before('connect', done => {
    mongoose.connect(database.database, { useNewUrlParser: true, useFindAndModify: false });
    const db = mongoose.connection;

    db.on('error', () => {
      throw new Error('DB connection error');
    });

    db.once('open', () => {
      done();
    });
  });

  afterEach(done => {
    mongoose.connection.db.collection(collectionName).drop(done);
  });

  after(() => {
    mongoose.connection.close();
  });

  it('Should Save the User to DB', done => {
    const user = new User({
      email: emailOfUser,
      password: passwordOfUser,
    });
    user.save().then(() => {
      assert(user.isNew === false);
      done();
    });
  });
});
