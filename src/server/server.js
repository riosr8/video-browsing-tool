/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

const config = require('./config/config');
require('./services/passport');

const conn = () => {
  mongoose.connect(config.db.database, { useNewUrlParser: true });
};

conn();
const db = mongoose.connection;
// eslint-disable-next-line no-unused-vars
db.on('error', err => {
  setTimeout(() => conn(), 10000);
});
db.once('open', () => console.log('Successfully connected to mongo'));

const auth = require('./routes/auth');
const api = require('./routes/api');
const register = require('./routes/register');
const noAuth = require('./routes/noAuthentication');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.options('*', cors());

app.use('/', express.static(path.join(__dirname, '..', '..', 'dist')));
app.use('/dist', express.static(path.join(__dirname, '..', '..', 'dist')));
app.use('/auth', auth);
app.use('/register', register);
app.use('/noAuth', noAuth);
app.use('/api', passport.authenticate('jwt', { session: false }), api);

app.set('port', config.app.port);

const server = http.createServer(app);
/* eslint-disable */
server.listen(config.app.port, () => console.log(`Server Running on port ${config.app.port}`));
/* eslint-enable */
module.exports = server;
