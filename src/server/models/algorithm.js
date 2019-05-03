const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const algorithmSchema = new Schema({
  userId: String,
  videoUuid: String,
  toBeProcessed: Array,
  processed: Array,
  processing: Array,
});

const Algorithm = mongoose.model('algorithm', algorithmSchema);

module.exports = Algorithm;
