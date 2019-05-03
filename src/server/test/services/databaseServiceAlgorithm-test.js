const mongoose = require('mongoose');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
const _ = require('underscore');
const config = require('../../config/config');
const Algorithm = require('../../models/algorithm');
// eslint-disable-next-line prefer-destructuring
const assert = chai.assert;
// eslint-disable-next-line prefer-destructuring
const expect = chai.expect;
const database = { database: config.db.database, secret: config.db.secret };

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const dataBaseService = require('../../services/dataBaseService');

describe('database Algorithm test ', () => {
  const collectionName = 'algorithms';
  const videoUUid = 'videoUuid';
  const algorithmicInput = [1, 2, 3];
  const userEmail = 'random@gmail.com';

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

  beforeEach(done => {
    const algorithm = new Algorithm({
      userId: userEmail,
      videoUuid: videoUUid,
      toBeProcessed: algorithmicInput,
      processed: [],
      processing: [],
    });
    algorithm.save().then(() => {
      done();
    });
  });

  afterEach(done => {
    mongoose.connection.db.collection(collectionName).drop(done);
  });

  after(() => {
    mongoose.connection.close();
  });

  it('Should Save algorithmic input to DB', done => {
    dataBaseService.saveAlgorithmToDb(userEmail, 'newUUid', algorithmicInput).then(() => {
      Algorithm.findOne({ videoUuid: 'newUUid' }).then(result => {
        assert(_.isEqual(algorithmicInput.sort(), result.toBeProcessed.sort()));
        done();
      });
    });
  });

  it('Find Algorithm from Db should return value', done => {
    dataBaseService.findAlgorithmFromDb(videoUUid).then(result => {
      assert(result.videoUuid === videoUUid);
      assert(result !== null);
      done();
    });
  });

  it('Find Algorithm from Db should return null', done => {
    const newvideoUUid = 'random';
    dataBaseService.findAlgorithmFromDb(newvideoUUid).then(result => {
      assert(result === null);
      done();
    });
  });

  it('Should Update Algorithms in database', done => {
    const newInput = [4];
    dataBaseService.updateAlgorithmToBeProcessed(videoUUid, newInput).then(result => {
      assert(result.nModified === 1);
      done();
    });
  });

  it('Should Update Algorithms in database / Processing Server', done => {
    const toBeProcessed = [4];
    const processingArray = [3];
    const processed = [6];
    dataBaseService
      .updateAlgorithmsFromProcessingServer(videoUUid, toBeProcessed, processingArray, processed)
      .then(result => {
        assert(result.nModified === 1);
        Algorithm.findOne({ videoUuid: videoUUid }).then(resultOfFind => {
          assert(_.isEqual(toBeProcessed.sort(), resultOfFind.toBeProcessed.sort()));
        });
        done();
      });
  });

  it('Return true if video is sent for algorithm processing ', () => {
    return expect(dataBaseService.checkVideoforAlgorithmProcessing(videoUUid)).eventually.equal(
      true,
    );
  });

  it('Return false if video is not sent for algorithm processing ', () => {
    return expect(dataBaseService.checkVideoforAlgorithmProcessing('randomUUId')).eventually.equal(
      false,
    );
  });
});

describe('Algorithm Tests Check Errors', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should return a error message when there is error in Find ', () => {
    const errorMessage = 'RandomError Message';
    sandbox.stub(Algorithm, 'findOne').yields(new Error(errorMessage));
    return expect(dataBaseService.findAlgorithmFromDb('randomUUid')).eventually.be.rejectedWith(
      errorMessage,
    );
  });

  it('Should return a error message when error in Find, checkVideoforAlgorithmProcessing ', () => {
    const errorMessage = 'RandomError Message';
    sandbox.stub(Algorithm, 'findOne').yields(new Error(errorMessage));
    return expect(
      dataBaseService.checkVideoforAlgorithmProcessing('randomUUid'),
    ).eventually.be.rejectedWith(errorMessage);
  });
});
