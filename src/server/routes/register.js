const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const dataBaseService = require('../services/dataBaseService');

router.post('/newUser', bodyParser.json(), async (req, res) => {
  const data = req.body;
  const value = await dataBaseService.checkUserExists(data.email);
  if (!value.emailTaken) {
    dataBaseService.saveUserToDb(data.email, data.password).then(successData => {
      if (successData != null) {
        res.send({ message: 'Registration Success Proceed to login' });
      }
    });
  } else {
    res.send({ message: 'The email is taken please try with a new email' });
  }
});

module.exports = router;
