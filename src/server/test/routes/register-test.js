const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('../../config/config');

// eslint-disable-next-line prefer-destructuring
const expect = chai.expect;
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const User = require('../../models/user');
const server = require('../../server');

chai.use(chaiHttp);
const database = { database: config.db.database, secret: config.db.secret };

describe('Auth Route Tests', () => {
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

  after(async () => {
    await mongoose.connection.db.collection('users').drop();
    await mongoose.connection.close();
  });

  it('/register/newUser  should give Registration Failure Message', done => {
    chai
      .request(server)
      .post('/register/newUser')
      .send({ email: 'test@test.com', password: 'test' })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('The email is taken please try with a new email');
        done();
      });
  });

  it('/register/newUser  should give Registration Success Message', done => {
    chai
      .request(server)
      .post('/register/newUser')
      .send({ email: 'random@test.com', password: 'test' })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('Registration Success Proceed to login');
        done();
      });
  });
});
