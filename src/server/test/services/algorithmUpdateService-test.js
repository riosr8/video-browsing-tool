const mongoose = require('mongoose');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
const _ = require('underscore');
const config = require('../../config/config');
const Algorithm = require('../../models/algorithm');
const Video = require('../../models/video');
// eslint-disable-next-line prefer-destructuring
const expect = chai.expect;
// eslint-disable-next-line prefer-destructuring
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const database = { database: config.db.database, secret: config.db.secret };
const algorithmUpdateService = require('../../services/algorithmUpdateService');
const databaseService = require('../../services/dataBaseService');

describe('database Algorithm test ', () => {
  let sandbox;
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

    db.once('open', async () => {
      const video = new Video({
        userId: 'random@gmail.com',
        videoName: 'randomVideo',
        videoUuid: videoUUid,
        videoLength: 2,
        videoThumbnail: 'randomThumbnail',
      });
      await video.save();
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
    sandbox = sinon.createSandbox();
  });

  afterEach(done => {
    mongoose.connection.db.collection(collectionName).drop(done);
    sandbox.restore();
  });

  after(async () => {
    await mongoose.connection.db.collection('videos').drop();
    await mongoose.connection.close();
  });

  it('Should Save algorithmic input to DB if there is no video of That UUID', done => {
    algorithmUpdateService.addOrUpdateAlgorithmToBeProcessed(userEmail, 'newUUID', [1]).then(() => {
      Algorithm.findOne({ videoUuid: 'newUUID' }).then(result => {
        assert(result.videoUuid === 'newUUID');
        done();
      });
    });
  });

  it('Add the algo if the algo is not in processed or isprocessing or toBeProcessed', done => {
    const newAlgorithm = [4];
    algorithmUpdateService
      .addOrUpdateAlgorithmToBeProcessed(userEmail, videoUUid, newAlgorithm)
      .then(() => {
        Algorithm.findOne({ videoUuid: videoUUid }).then(result => {
          assert(
            _.isEqual(result.toBeProcessed.sort(), algorithmicInput.concat(newAlgorithm).sort()),
          );
          done();
        });
      });
  });

  it('Should not add the algo if the algo exists in any of the status type', done => {
    const newAlgorithm = [2];
    algorithmUpdateService
      .addOrUpdateAlgorithmToBeProcessed(userEmail, videoUUid, newAlgorithm)
      .then(() => {
        Algorithm.findOne({ videoUuid: videoUUid }).then(result => {
          assert(_.isEqual(result.toBeProcessed.sort(), algorithmicInput.sort()));
          done();
        });
      });
  });

  it('Should return a error if video present', () => {
    const newAlgorithm = [2];
    sandbox.stub(databaseService, 'saveAlgorithmToDb').returns({ videoUuid: '' });
    return expect(
      algorithmUpdateService.addOrUpdateAlgorithmToBeProcessed(userEmail, 'randomId', newAlgorithm),
    ).eventually.be.rejectedWith('Could not send video for processing, Please try again');
  });
});
