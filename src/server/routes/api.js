const express = require('express');

const router = express.Router();

const uuidv4 = require('uuid/v4');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream');
const bodyParser = require('body-parser');

const videoSaveService = require('../services/saveVideo');
const dataBaseService = require('../services/dataBaseService');
const algorithmUpdateService = require('../services/algorithmUpdateService');
const statusService = require('../services/statusService');
const algorithmResultService = require('../services/algorithmResultService');
const config = require('../config/config');

const uploadPath = config.staticPaths.video;
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${uploadPath}`);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + file.originalname);
  },
});

const upload = multer({ storage: storageConfig });

router.get('/videos/:videoId', bodyParser.json(), async (req, res) => {
  const userId = req.user.email;
  const videoUuid = req.params.videoId;
  res.contentType = 'video/mp4';
  const videoExists = await dataBaseService.checkIfVideoBelongsToUser(userId, videoUuid);
  if (videoExists) {
    const stat = fs.statSync(`${config.staticPaths.video}${videoUuid}`);
    const fileSize = stat.size;
    // eslint-disable-next-line prefer-destructuring
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(
        path.resolve(`
        ${config.staticPaths.video}${videoUuid}`),
        { start, end },
      );

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(path.resolve(`${config.staticPaths.video}${videoUuid}`)).pipe(res);
    }
  } else {
    res.send({ message: 'Video Does not exist' });
  }
});

router.get('/list', bodyParser.json(), (req, res) => {
  const userId = req.user.email;
  const find = dataBaseService.listAllVideosOfUser(userId);
  res.status = 200;
  find
    .cursor()
    .pipe(JSONStream.stringify())
    .pipe(res.type('json'));
});

router.get('/listPagination', bodyParser.json(), async (req, res) => {
  const pageNo = parseInt(req.query.pageNo);
  const sortType = req.query.sortVal;
  const orderVal = req.query.order;
  const size = 10;
  const userId = req.user.email;
  if (pageNo < 0 || pageNo === 0) {
    res.status(400).json({
      message: 'Invalid page number, should start with 1',
    });
  } else {
    res.status = 200;
    res.send(
      await dataBaseService.listAllVideosOfUserPagination(userId, size, pageNo, sortType, orderVal),
    );
  }
});

router.post('/upload', upload.single('fileName'), async (req, res) => {
  const userId = req.user.email;
  const fileInfo = req.file;
  const fileName = req.body.videoName;
  const uuidFileName = fileInfo.filename;
  const screenShotName = uuidFileName.split('.')[0];
  const fileDescription = req.body.videoDescription;
  try {
    const screenShot = await videoSaveService.generateScreenShot(uuidFileName, screenShotName);
    const videoLength = await videoSaveService.getvideoLength(uuidFileName);
    const value = await dataBaseService.saveFileToDb(
      userId,
      fileName,
      uuidFileName,
      screenShot,
      videoLength,
      fileDescription,
      new Date().getTime(),
    );
    return res.send(value);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

router.post('/delete', bodyParser.json(), async (req, res) => {
  const data = req.body;
  const userEmail = req.user.email;
  const deleteValue = await dataBaseService.deleteVideo(userEmail, data.videoUuid);
  if (deleteValue.deletedCount !== 0) {
    if (await dataBaseService.checkVideoforAlgorithmProcessing(data.videoUuid)) {
      const resultDelete = await dataBaseService.deleteAlgorithmResult(data.videoUuid);
      if (resultDelete.deletedCount !== 0) {
        res.send({ message: 'Deleted video Successfully' });
      } else {
        res.send({ message: 'Could not delete the Video results, please try again later' });
      }
    } else {
      res.send({ message: 'Deleted video Successfully' });
    }
  } else {
    res.send({ message: 'Could not delete the Video please try again later' });
  }
});

router.post('/algorithmInput', bodyParser.json(), async (req, res) => {
  try {
    const result = await algorithmUpdateService.addOrUpdateAlgorithmToBeProcessed(
      req.user.email,
      req.body.videoUuid,
      req.body.algorithmicInput,
    );
    return res.send(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

router.get('/status', async (req, res) => {
  try {
    const result = await statusService.getStatus(req.user.email);
    return res.send(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

router.post('/results', bodyParser.json(), async (req, res) => {
  try {
    const result = await algorithmResultService.getResults(req.body.videoUuid);
    return res.send(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

// eslint-disable-next-line consistent-return
router.get('/algorithmVideo/:videoId', bodyParser.json(), async (req, res) => {
  try {
    const stat = fs.statSync(`${config.outputVideoPath.video}`);
    const fileSize = stat.size;
    // eslint-disable-next-line prefer-destructuring
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(
        path.resolve(`
        ${config.outputVideoPath.video}`),
        { start, end },
      );

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(path.resolve(`${config.outputVideoPath.video}`)).pipe(res);
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
