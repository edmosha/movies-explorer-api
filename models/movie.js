const mongoose = require('mongoose');
const validator = require('validator');

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
          return validator.isURL(value);
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
          return validator.isURL(value);
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
