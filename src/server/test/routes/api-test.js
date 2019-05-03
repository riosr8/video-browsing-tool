const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const fs = require('fs');
const stream = require('stream');
const path = require('path');
const multer = require('multer');
const config = require('../../config/config');
const videoSaveService = require('../../services/saveVideo');
const algorithmResultService = require('../../services/algorithmResultService');
const statusService = require('../../services/statusService');
const algorithmUpdateService = require('../../services/algorithmUpdateService');
// eslint-disable-next-line prefer-destructuring
const expect = chai.expect;
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const User = require('../../models/user');
const server = require('../../server');
const Video = require('../../models/video');
const Algorithm = require('../../models/algorithm');

chai.use(chaiHttp);
const database = { database: config.db.database, secret: config.db.secret };

describe('Api Route Tests', () => {
  let jwtToken = null;
  const collectionName = 'videos';
  const algorithmInput = [1, 2, 3];
  const userIdTest = 'test@test.com';
  const videoNameTest = 'testVideo.mp4';
  const videoUuidTest = 'testVideo.mp4';
  const videoLengthTest = 4;
  const videoThumbnailTest = 'randomThumbnail';
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
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    const algorithm = new Algorithm({
      videoUuid: videoUuidTest,
      toBeProcessed: algorithmInput,
      processed: [],
      processing: [],
    });
    const video = new Video({
      userId: userIdTest,
      videoName: videoNameTest,
      videoUuid: videoUuidTest,
      videoLength: videoLengthTest,
      videoThumbnail: videoThumbnailTest,
    });
    await video.save();
    await algorithm.save();
  });

  afterEach(async () => {
    await mongoose.connection.db.collection('algorithms').drop();
    await mongoose.connection.db.collection(collectionName).drop();
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
        jwtToken = res.body.token;
        done();
      });
  });

  it('/api/list Should get a 401 Unauthorised request', done => {
    chai
      .request(server)
      .get('/api/list')
      .set('Authorization', 'Bearer token')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('/api/list should list all the videos uploaded', done => {
    chai
      .request(server)
      .get('/api/list')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  it('/api/listPagination should give error when page number is negative', done => {
    chai
      .request(server)
      .get('/api/listPagination')
      .query({ pageNo: -1 })
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).to.equal('Invalid page number, should start with 1');
        done();
      });
  });

  it('/api/listPagination should give error when page number is 0', done => {
    chai
      .request(server)
      .get('/api/listPagination')
      .query({ pageNo: 0 })
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).to.equal('Invalid page number, should start with 1');
        done();
      });
  });

  it('/api/listPagination should  all the videos uploaded', done => {
    chai
      .request(server)
      .get('/api/listPagination')
      .query({ pageNo: 1 })
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('totalCount');
        res.body.should.have.property('results');
        done();
      });
  });

  it('/api/upload should upload the video', done => {
    const uploadPath = config.staticPaths.video;
    const storageConfig = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `${uploadPath}`);
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });
    const upload = multer({ storage: storageConfig });
    sandbox
      .stub(upload, 'single')
      .withArgs('fileName')
      .callsFake((req, res, next) => {
        next();
      });
    sandbox.stub(videoSaveService, 'generateScreenShot').returns('screenshot.png');
    sandbox.stub(videoSaveService, 'getvideoLength').returns(14.11);
    chai
      .request(server)
      .post('/api/upload')
      .set('Authorization', `Bearer ${jwtToken}`)
      .attach(
        'fileName',
        fs.readFileSync(path.resolve(`${config.staticPaths.video}shortVideo.mp4`)),
        'testVideo.mp4',
      )
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body.userId).to.equal('test@test.com');
        done();
      });
  });

  it('/api/videos Should return Video Does not exist', done => {
    chai
      .request(server)
      .get('/api/videos/arun')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.equal('Video Does not exist');
        done();
      });
  });

  it('/api/videos Should return Video ', done => {
    chai
      .request(server)
      .get('/api/videos/testVideo.mp4')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.headers['content-type']).to.equal('video/mp4');
        expect(res.body).to.instanceOf(Buffer);
        done();
      });
  });

  it('/api/videos Should return Video with stream ', done => {
    const readableStream = new stream.Readable();
    for (let i = 0; i <= 5; i++) {
      readableStream.push('foo');
    }
    readableStream.push(null);
    sandbox.stub(path, 'resolve').returns('path');
    sandbox.stub(fs, 'createReadStream').returns(readableStream);
    chai
      .request(server)
      .get('/api/videos/testVideo.mp4')
      .set('range', 'bytes=0-')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(206);
        expect(res.headers['content-type']).to.equal('video/mp4');
        expect(res.body).to.instanceOf(Buffer);
        done();
      });
  });

  it('/api/delete should delete the video from algorithms As well', done => {
    chai
      .request(server)
      .post('/api/delete')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ videoUuid: videoUuidTest })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.equal('Deleted video Successfully');
        done();
      });
  });

  it('/api/delete should return could not delete video on error', done => {
    chai
      .request(server)
      .post('/api/delete')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ videoUuid: 'randomVideo' })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.equal('Could not delete the Video please try again later');
        done();
      });
  });

  it('/api/delete Delete the video only from videos', done => {
    const video = new Video({
      userId: userIdTest,
      videoName: videoNameTest,
      videoUuid: 'randomtest',
      videoLength: videoLengthTest,
      videoThumbnail: videoThumbnailTest,
    });
    video.save().then(() => {
      chai
        .request(server)
        .post('/api/delete')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ videoUuid: 'randomtest' })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.message).to.equal('Deleted video Successfully');
          done();
        });
    });
  });

  it('/api/algorithmInput should save the algorithm if Algorithm not present', done => {
    chai
      .request(server)
      .post('/api/algorithmInput')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ videoUuid: 'newVideoUUID', algorithmicInput: algorithmInput })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.equal('Video sent for processing');
        done();
      });
  });

  it('/api/algorithmInput should return Algorithm already being processed ', done => {
    chai
      .request(server)
      .post('/api/algorithmInput')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ videoUuid: videoUuidTest, algorithmicInput: algorithmInput })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.equal('Algos already being processed');
        done();
      });
  });

  // eslint-disable-next-line max-len
  it('/api/status should give status of all videos of user which are submitted for processing', done => {
    chai
      .request(server)
      .get('/api/status')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.a('array');
        done();
      });
  });

  it('/api/results should give results of a video', done => {
    chai
      .request(server)
      .post('/api/results')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ videoUuid: videoUuidTest })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.videoUuid).to.be.eql(videoUuidTest);
        expect(res.body.results).to.be.a('array');
        done();
      });
  });

  it('/api/results should give out a empty result array if video not not present', done => {
    chai
      .request(server)
      .post('/api/results')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ videoUuid: 'randomVideoId' })
      .end((err, res) => {
        expect(res.body.videoUuid).to.be.eql('randomVideoId');
        expect(res.body.results).to.be.eql([]);
        done();
      });
  });

  it('/api/algorithmVideo Should return Video ', done => {
    chai
      .request(server)
      .get('/api/algorithmVideo/testVideo.mp4')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.headers['content-type']).to.equal('video/mp4');
        expect(res.body).to.instanceOf(Buffer);
        done();
      });
  });

  it('/api/algorithmVideo Should return Video with stream ', done => {
    const readableStream = new stream.Readable();
    for (let i = 0; i <= 5; i++) {
      readableStream.push('foo');
    }
    readableStream.push(null);
    sandbox.stub(path, 'resolve').returns('path');
    sandbox.stub(fs, 'createReadStream').returns(readableStream);
    chai
      .request(server)
      .get('/api/algorithmVideo/testVideo.mp4')
      .set('range', 'bytes=0-')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(206);
        expect(res.headers['content-type']).to.equal('video/mp4');
        expect(res.body).to.instanceOf(Buffer);
        done();
      });
  });

  it('/api/results should give an error', done => {
    const error = 'random error';
    sandbox.stub(algorithmResultService, 'getResults').rejects(error);
    chai
      .request(server)
      .post('/api/results')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ videoUuid: videoUuidTest })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('/api/status should give status of error', done => {
    const error = 'random error';
    sandbox.stub(statusService, 'getStatus').rejects(error);
    chai
      .request(server)
      .get('/api/status')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('/api/algorithmInput should return error ', done => {
    const error = 'random error';
    sandbox.stub(algorithmUpdateService, 'addOrUpdateAlgorithmToBeProcessed').rejects(error);
    chai
      .request(server)
      .post('/api/algorithmInput')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ videoUuid: videoUuidTest, algorithmicInput: algorithmInput })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('/api/upload should return error', done => {
    const error = 'random error';
    const uploadPath = config.staticPaths.video;
    const storageConfig = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `${uploadPath}`);
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });
    const upload = multer({ storage: storageConfig });
    sandbox
      .stub(upload, 'single')
      .withArgs('fileName')
      .callsFake((req, res, next) => {
        next();
      });
    sandbox.stub(videoSaveService, 'generateScreenShot').rejects(error);
    sandbox.stub(videoSaveService, 'getvideoLength').rejects(error);
    chai
      .request(server)
      .post('/api/upload')
      .set('Authorization', `Bearer ${jwtToken}`)
      .attach(
        'fileName',
        fs.readFileSync(path.resolve(`${config.staticPaths.video}shortVideo.mp4`)),
        'testVideo.mp4',
      )
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('/api/algorithmVideo Should return error ', done => {
    const error = 'random error';
    sandbox.stub(fs, 'statSync').returns(Promise.resolve(error));
    const readableStream = new stream.Readable();
    for (let i = 0; i <= 5; i++) {
      readableStream.push('foo');
    }
    readableStream.push(null);
    sandbox.stub(path, 'resolve').returns(Promise.resolve(error));
    sandbox.stub(fs, 'createReadStream').returns(Promise.resolve(error));
    chai
      .request(server)
      .get('/api/algorithmVideo/testVideo.mp4')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});
