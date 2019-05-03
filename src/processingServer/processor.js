/* eslint-disable no-console */
const mongoose = require('mongoose');
const config = require('./config/config');
const Algorithm = require('./models/algorithm');
const Poller = require('./poller');
const generateAlgorithm = require('./generateAlgorithmOutput');

const conn = () => {
  mongoose.connect(config.db.database, { useNewUrlParser: true });
};

conn();
const db = mongoose.connection;
db.on('error', err => {
  console.log('There was a problem connecting to mongo: ', err);
  console.log('Trying again');
  setTimeout(() => conn(), 10000);
});
db.once('open', () => console.log('Successfully connected to mongo'));

const poller = new Poller(10000);

poller.onPoll(async () => {
  const result = await Algorithm.find({ toBeProcessed: { $ne: [] } });
  await generateAlgorithm.generateAlgorithmOutput(result);
  poller.poll();
});

poller.poll();
