const mongoose = require('mongoose');
// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
});

const UserSchema = mongoose.model('user', userSchema);

module.exports = UserSchema;
