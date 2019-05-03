const mongoose = require('mongoose');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
const chaiHttp = require('chai-http');

const config = require('../../config/config');
// eslint-disable-next-line prefer-destructuring
const expect = chai.expect;
// // eslint-disable-next-line prefer-destructuring

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const User = require('../../models/user');
const server = require('../../server');

chai.use(chaiHttp);

const database = { database: config.db.database, secret: config.db.secret };

describe('Auth Route Tests', () => {
  let sandbox;
  before(done => {
    mongoose.connect(database.database, { useNewUrlParser: true, useFindAndModify: false });
    const db = mongoose.connection;

    db.on('error', () => {
      throw new Error('DB connection error');
    });

    db.once('open', async () => {
      const user = new User({
        email: 'test@test.com',
        password: 'test',
      });
      user.save().then(() => {
        done();
      });
    });
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(async () => {
    await mongoose.connection.db.collection('users').drop();
    await mongoose.connection.close();
  });

  it('/auth/login  should get JWT token', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'test' })
      .end((err, res) => {
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('/auth/login  should give "Incorrect email or password" on wrong login ', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({ email: 'a@test.com', password: 'test' })
      .end((err, res) => {
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.be.equal('Incorrect email or password.');
        done();
      });
  });

  it('/auth/login  Handle db error', done => {
    const errorMessage = 'RandomError Message';
    sandbox
      .stub(User, 'findOne')
      .onCall(1)
      .yields(new Error(errorMessage));
    chai
      .request(server)
      .post('/auth/login')
      .send({ email: 'a@test.com', password: 'test' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });
});
