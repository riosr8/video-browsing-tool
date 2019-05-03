const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('../../config/config');
const Video = require('../../models/video');

// eslint-disable-next-line prefer-destructuring
const expect = chai.expect;
// eslint-disable-next-line prefer-destructuring
const assert = chai.assert;

const database = { database: config.db.database, secret: config.db.secret };
// eslint-disable-next-line no-unused-vars
const should = chai.should();
chai.use(chaiHttp);

describe('MongoDB Tests', () => {
  before(done => {
    mongoose.connect(database.database, { useNewUrlParser: true, useFindAndModify: false });
    const db = mongoose.connection;

    db.on('error', () => {
      throw new Error('DB connection error');
    });

    db.once('open', () => {
      done();
    });
  });

  after(() => {
    mongoose.connection.close();
  });

  beforeEach(done => {
    const video = new Video({
      userId: 'randomUser',
      videoName: 'randomVideo',
      videoUuid: 'randomUuid',
      videoLength: 4,
      videoThumbnail: 'randomThumbnail',
    });
    video.save().then(() => {
      done();
    });
  });

  afterEach(done => {
    mongoose.connection.db.collection('videos').drop(done);
  });

  it('Save Record', done => {
    const newVideo = new Video({
      userId: 'randomUser',
      videoName: 'randomVideo',
      videoUuid: 'randomUuid',
      videoLength: 4,
      videoThumbnail: 'randomThumbnail',
    });
    newVideo.save().then(() => {
      assert(newVideo.isNew === false);
      done();
    });
  });

  it('Find Record', done => {
    Video.findOne({ videoName: 'randomVideo' })
      .then(result => {
        assert(result.userId === 'randomUser');
        assert(result.videoUuid === 'randomUuid');
        assert(result.videoLength === 4);
        assert(result.videoThumbnail === 'randomThumbnail');
        done();
      })
      .catch(err => {
        throw err;
      });
  });

  it('Not Find Record', done => {
    Video.findOne({ videoName: 'NotInDB' }).then(result => {
      /* eslint-disable no-unused-expressions */
      expect(result).to.be.null;
      done();
    });
  });

  it('Update the name of a record', done => {
    Video.updateOne({ videoName: 'randomVideo' }, { videoUuid: 'notRandomUuid' }).then(() => {
      Video.findOne({ videoName: 'randomVideo' }).then(result => {
        assert(result.videoUuid === 'notRandomUuid');
        done();
      });
    });
  });

  it('Deleting records from DB ', done => {
    Video.deleteOne({ userId: 'randomUser' }).then(() => {
      Video.findOne({ userId: 'randomUser' }).then(result => {
        assert(result === null);
        done();
      });
    });
  });
});
