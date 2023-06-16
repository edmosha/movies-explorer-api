const mongoose = require('mongoose');
const validator = require('validator');


const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
    }
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  name: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 30,
  },
});

module.exports = mongoose.model('user', UserSchema);
