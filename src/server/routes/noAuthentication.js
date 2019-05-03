const express = require('express');

const router = express.Router();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const appRoot = require('app-root-path');
const cors = require('cors');
const algorithmsFile = require('../storage/algorithm/algorithmsAvailable.json');
const config = require('../config/config');

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.options('*', cors());
router.get('/thumbnail/:id', (req, res) => {
  const fileStream = fs.createReadStream(
    path.resolve(`${appRoot}/storage/screenshots/${req.params.id}`),
  );
  fileStream.pipe(res);
});

router.get('/algorithmsAvailable', (req, res) => {
  res.json(algorithmsFile);
});

router.get('/videos/:videoId', bodyParser.json(), async (req, res) => {
  const videoUuid = req.params.videoId;
  res.contentType = 'video/mp4';
  const stat = fs.statSync(`${config.staticPaths.video}${videoUuid}`);
  const fileSize = stat.size;
  // eslint-disable-next-line prefer-destructuring
  const head = {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
  };
  res.writeHead(200, head);
  fs.createReadStream(path.resolve(`${config.staticPaths.video}${videoUuid}`)).pipe(res);
});

router.get('/algorithmVideo/:videoId', bodyParser.json(), async (req, res) => {
  const stat = fs.statSync(`${config.outputVideoPath.video}`);
  const fileSize = stat.size;
  const head = {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
  };
  res.writeHead(200, head);
  fs.createReadStream(path.resolve(`${config.outputVideoPath.video}`)).pipe(res);
});
module.exports = router;
