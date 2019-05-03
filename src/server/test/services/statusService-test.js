const mongoose = require('mongoose');
const chai = require('chai');
const _ = require('underscore');
const config = require('../../config/config');
const Algorithm = require('../../models/algorithm');
const Video = require('../../models/video');
const User = require('../../models/user');

// eslint-disable-next-line prefer-destructuring
const assert = chai.assert;

const database = { database: config.db.database, secret: config.db.secret };

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const statusService = require('../../services/statusService');

describe('Status Test ', () => {
  const collectionName = 'algorithms';
  const videoUUid = 'videoUuid';
  const algorithmicInput = [1, 2, 3];
  const emailOfUser = 'test@test.com';
  const passwordOfUser = 'test';

  before('connect', done => {
    mongoose.connect(database.database, { useNewUrlParser: true, useFindAndModify: false });

    mongoose.connection.on('error', () => {
      throw new Error('DB connection error');
    });

    mongoose.connection.once('open', async () => {
      const user = new User({
        email: emailOfUser,
        password: passwordOfUser,
      });
      const video = new Video({
        userId: emailOfUser,
        videoName: 'randomVideo',
        videoUuid: videoUUid,
        videoLength: 4,
        videoThumbnail: 'randomThumbnail',
      });
      await user.save();
      await video.save();
      done();
    });
  });

  beforeEach(done => {
    const algorithm = new Algorithm({
      userId: emailOfUser,
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

  after(async () => {
    await mongoose.connection.db.collection('videos').drop();
    await mongoose.connection.db.collection('users').drop();
    mongoose.connection.close();
  });

  it('Should give [] as status for user who dosent have any videos ', done => {
    statusService.getStatus('randomEmail@gmail.com').then(result => {
      assert(_.isEqual(result.sort(), [].sort()));
      done();
    });
  });

  it('Should give status of videos for user present  ', done => {
    statusService.getStatus(emailOfUser).then(result => {
      assert(!_.isEqual(result.sort(), [].sort()));
      done();
    });
  });
});
