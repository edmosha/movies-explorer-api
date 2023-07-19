const mongoose = require('mongoose');
const validator = require('validator');

const isRelativeUrl = (string) => {
  const regex = /^\/\S+$/i;
  return regex.test(string);
};

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      require: true,
    },
    director: {
      type: String,
      require: true,
    },
    duration: {
      type: Number,
      require: true,
    },
    year: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
      validate: {
        validator(value) {
          return isRelativeUrl(value);
        },
      },
    },
    trailerLink: {
      type: String,
      require: true,
      validate: {
        validator(value) {
          return validator.isURL(value);
        },
      },
    },
    thumbnail: {
      type: String,
      require: true,
      validate: {
        validator(value) {
          return isRelativeUrl(value);
        },
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      require: true,
    },
    movieId: {
      type: Number,
      require: true,
    },
    nameRU: {
      type: String,
      require: true,
    },
    nameEN: {
      type: String,
      require: true,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
