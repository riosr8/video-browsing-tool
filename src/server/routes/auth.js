const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bodyParser = require('body-parser');

const config = require('../config/config');
// eslint-disable-next-line
router.post('/login', bodyParser.json(), (req, res, next) => {
  // eslint-disable-next-line
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      if (err === null) {
        return res.status(400).json({
          message: info.message,
        });
      }
      return res.status(400).json({
        message: err.message,
      });
    }
    req.login(user, { session: false }, error => {
      if (error) {
        res.send(error);
      }
      const token = jwt.sign(
        JSON.stringify({ email: user.email, password: user.password }),
        config.authenticationSecret.secret,
      );
      res.status(200);
      return res.json({ email: user.email, token, expiresIn: 3600000 });
    });
  })(req, res);
});

module.exports = router;
