const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  userId: String,
  videoName: String,
  videoUuid: String,
  videoLength: Number,
  videoThumbnail: String,
  videoDescription: String,
  time: String,
});

const Video = mongoose.model('video', videoSchema);

module.exports = Video;
