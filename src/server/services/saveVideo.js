const fs = require('fs');
const Promise = require('bluebird');
const ffmpeg = require('fluent-ffmpeg');

const ffmpegPromise = Promise.promisifyAll(ffmpeg);
const config = require('../config/config');

module.exports = {
  getvideoLength: async uuidFileName => {
    return new Promise((resolve, reject) => {
      ffmpegPromise
        .ffprobeAsync(`${config.staticPaths.video}${uuidFileName}`)
        .then(metaData => {
          resolve(metaData.format.duration);
        })
        .catch(err => {
          reject(new Error('Video format not right', err));
        });
    });
  },
  generateScreenShot: async (uuidFileName, screenShotName) => {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(`${config.staticPaths.video}${uuidFileName}`)) {
        ffmpeg(`${config.staticPaths.video}${uuidFileName}`)
          // eslint-disable-next-line no-unused-vars
          .on('error', (err, stdout, stderr) => {
            reject(new Error('Video format not right'));
          })
          .on('end', () => {
            resolve(`${screenShotName}.png`);
          })
          .screenshots({
            count: 1,
            folder: `${config.staticPaths.screenShot}`,
            filename: screenShotName,
            size: '320x240',
          });
      } else {
        reject(new Error('The upload was unsuccessful, File not found'));
      }
    });
  },
};
