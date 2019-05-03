const mongoose = require('mongoose');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const Promise = require('bluebird');
// eslint-disable-next-line prefer-destructuring
const expect = chai.expect;

const config = require('../../config/config');

const database = { database: config.db.database, secret: config.db.secret };

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const saveVideoService = require('../../services/saveVideo');

describe('Save Video Test  ', () => {
  let sandbox;
  before('connect', done => {
    mongoose.connect(database.database, { useNewUrlParser: true, useFindAndModify: false });

    mongoose.connection.on('error', () => {
      throw new Error('DB connection error');
    });

    mongoose.connection.once('open', async () => {
      done();
    });
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(async () => {
    mongoose.connection.close();
  });
  it('Checking Video Length ', async () => {
    const ffmpegPromise = Promise.promisifyAll(ffmpeg);
    const metaData = {};
    metaData.format = {};
    metaData.format.duration = 4.18;
    sandbox.stub(ffmpegPromise, 'ffprobeAsync').resolves(metaData);

    const videoLength = await saveVideoService.getvideoLength('random.mp4');
    expect(videoLength).to.equal(4.18);
  });

  it('Checking Video Length to give out an error', async () => {
    return expect(saveVideoService.getvideoLength('random.mp4')).eventually.be.rejectedWith(
      'Video format not right',
    );
  });

  it('Generate ScreenShot , Generate error ', async () => {
    sandbox.stub(fs, 'existsSync').returns(true);
    return expect(
      saveVideoService.generateScreenShot('random.mp4', 'screenshot.jpg'),
    ).eventually.be.rejectedWith('Video format not right');
  });

  it('Throw error when file not present ', async () => {
    return expect(
      saveVideoService.generateScreenShot('random.mp4', 'screenshot.jpg'),
    ).eventually.be.rejectedWith('The upload was unsuccessful, File not found');
  });
});
