const fs = require('fs');
const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

// eslint-disable-next-line prefer-destructuring
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars

const server = require('../../server');

chai.use(chaiHttp);

describe('Auth Route Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(async () => {
    sandbox.restore();
  });

  it('/noAuth/thumbail  should call file stream thumbnail', done => {
    sandbox.stub(fs, 'createReadStream').returns('success');
    chai
      .request(server)
      .get('/noAuth/thumbnail/randomId')
      .end(() => {
        assert(fs.createReadStream.called);
        done();
      });
  });

  it('/noAuth/algorithmsAvailable  should give the json of algorithms available', done => {
    chai
      .request(server)
      .get('/noAuth/algorithmsAvailable')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.algorithms.should.be.a('array');
        done();
      });
  });
});
