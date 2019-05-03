const mongoose = require('mongoose');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
const Video = require('../../models/video');
const config = require('../../config/config');
// eslint-disable-next-line prefer-destructuring
const assert = chai.assert;
// eslint-disable-next-line prefer-destructuring
const expect = chai.expect;

const database = { database: config.db.database, secret: config.db.secret };

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const dataBaseService = require('../../services/dataBaseService');

describe('Video Service Tests ', () => {
  const collectionName = 'videos';
  const userIdOfUser = 'random@gmail.com';
  const fileInfo = 'fileName';
  const uuidFileName = 'uuidName';
  const thumbnailName = 'thumbnailName';
  const vidLength = 4;
  let sandbox;

  before('connect', done => {
    mongoose.connect(database.database, { useNewUrlParser: true, useFindAndModify: false });
    // const db = mongoose.connection;

    mongoose.connection.on('error', () => {
      throw new Error('DB connection error');
    });

    mongoose.connection.once('open', () => {
      done();
    });
  });

  beforeEach(done => {
    sandbox = sinon.createSandbox();
    const video = new Video({
      userId: userIdOfUser,
      videoName: fileInfo,
      videoUuid: uuidFileName,
      videoLength: vidLength,
      videoThumbnail: thumbnailName,
      time: new Date().getTime(),
    });
    video.save().then(async () => {
      done();
    });
  });

  afterEach(done => {
    mongoose.connection.db.collection(collectionName).drop(done);
    sandbox.restore();
  });

  after(() => {
    mongoose.connection.close();
  });

  it('Should Save the Video to DB', done => {
    dataBaseService.saveFileToDb('randomOne', fileInfo, uuidFileName, thumbnailName, 4).then(() => {
      Video.findOne({ userId: 'randomOne' }).then(result => {
        assert(result.videoName === fileInfo);
        assert(result.videoUuid === uuidFileName);
        assert(result.videoThumbnail === thumbnailName);
        assert(result.videoLength === 4);
        done();
      });
    });
  });

  it('List All Videos of User', async () => {
    const listOfVideos = await dataBaseService.listAllVideosOfUser(userIdOfUser);
    assert(listOfVideos !== null);
  });

  it('List All Videos of User pagination - pages equals 1 , values are in asc order', async () => {
    const secondVideo = new Video({
      userId: userIdOfUser,
      videoName: 'a',
      videoUuid: uuidFileName,
      videoLength: vidLength,
      videoThumbnail: thumbnailName,
      time: new Date().getTime(),
    });
    await secondVideo.save();
    const listOfVideos = await dataBaseService.listAllVideosOfUserPagination(
      userIdOfUser,
      10,
      1,
      'videoName',
      'asc',
    );
    expect(listOfVideos.totalCount).to.equal(1);
    expect(listOfVideos.results[0].videoName).to.equal('a');
  });

  it('List All Videos of User pagination should not use sorting', async () => {
    const listOfVideos = await dataBaseService.listAllVideosOfUserPagination(
      userIdOfUser,
      10,
      1,
      null,
      'asc',
    );
    assert(listOfVideos !== null);
  });

  it('Check if Video belongs to User', async () => {
    const differentVideo = new Video({
      userId: 'notRandomUser@gmail.com',
      videoName: 'differentRandomVideo',
      videoUuid: 'differentRandomUuid',
      videoLength: 4,
      videoThumbnail: 'randomThumbnail',
    });
    await differentVideo.save();
    expect(
      await dataBaseService.checkIfVideoBelongsToUser(userIdOfUser, differentVideo.videoUuid),
    ).to.equal(false);

    expect(await dataBaseService.checkIfVideoBelongsToUser(userIdOfUser, uuidFileName)).to.equal(
      true,
    );
  });

  it('Should delete the Video ', async () => {
    const deletedVideo = await dataBaseService.deleteVideo(userIdOfUser, uuidFileName);
    assert(deletedVideo.deletedCount === 1);
  });

  it('If No Video should not delete anything ', async () => {
    const deletedVideo = await dataBaseService.deleteVideo(userIdOfUser, 'randomUUid');
    assert(deletedVideo.deletedCount === 0);
  });

  it('Error Video mismatch if requesting a video from algorithm when not present ', () => {
    return expect(dataBaseService.getVideoInformation('randomUUid')).eventually.be.rejectedWith(
      'Video Mismatched with algorithm process',
    );
  });
});

describe('Video Tests Check Errors', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should return a error message when there is error in Find ', () => {
    const errorMessage = 'RandomError Message';
    sandbox.stub(Video, 'findOne').yields(new Error(errorMessage));
    return expect(
      dataBaseService.checkIfVideoBelongsToUser('email@email.com', 'randomUUid'),
    ).eventually.be.rejectedWith(errorMessage);
  });

  it('Should return a error message when error in getVideoInformation ', () => {
    const errorMessage = 'RandomError Message';
    sandbox.stub(Video, 'findOne').yields(new Error(errorMessage));
    return expect(dataBaseService.getVideoInformation('randomUUid')).eventually.be.rejectedWith(
      errorMessage,
    );
  });
});
