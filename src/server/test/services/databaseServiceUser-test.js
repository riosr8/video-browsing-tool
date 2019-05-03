const mongoose = require('mongoose');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
const config = require('../../config/config');
const User = require('../../models/user');
// eslint-disable-next-line prefer-destructuring
const assert = chai.assert;

const database = { database: config.db.database, secret: config.db.secret };
// eslint-disable-next-line prefer-destructuring
const expect = chai.expect;
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const dataBaseService = require('../../services/dataBaseService');

describe('User Login Tests ', () => {
  const collectionName = 'users';
  const emailOfUser = 'test@test.com';
  const passwordOfUser = 'test';
  let sandbox;
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

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(done => {
    mongoose.connection.db.collection(collectionName).drop(done);
    sandbox.restore();
  });

  after(() => {
    mongoose.connection.close();
  });

  it('Should Save the User to DB', done => {
    dataBaseService.saveUserToDb(emailOfUser, passwordOfUser).then(() => {
      User.findOne({ email: emailOfUser }).then(result => {
        assert(result.email === emailOfUser);
        assert(result.password === passwordOfUser);
        done();
      });
    });
  });

  it('Check User Exists - True', done => {
    const user = new User({
      email: emailOfUser,
      password: passwordOfUser,
    });
    user.save().then(() => {
      dataBaseService.checkUserExists(emailOfUser).then(result => {
        assert(result.emailTaken === true);
        done();
      });
    });
  });

  it('Check User Exists - False', done => {
    const user = new User({
      email: 'newEmail@email.com',
      password: passwordOfUser,
    });
    user.save().then(() => {
      dataBaseService.checkUserExists(emailOfUser).then(result => {
        assert(result.emailTaken === false);
        done();
      });
    });
  });
});

describe('User Login Tests Check Errors', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should return a error message when there is error in Find ', () => {
    const errorMessage = 'RandomError Message';
    sandbox.stub(User, 'findOne').yields(new Error(errorMessage));
    return expect(
      dataBaseService.checkUserExists('email@email.com', 'randomUUid'),
    ).eventually.be.rejectedWith(errorMessage);
  });
});
