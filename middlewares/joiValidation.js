const { celebrate, Joi } = require('celebrate');

const urlPattern = /^https?:\/\/\S+$/i;
const relativeUrlPattern = /^\/\S+$/i;

// auth
const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// users
const validateUsersMe = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

// movies
const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(200),
    director: Joi.string().required().min(2).max(50),
    duration: Joi.number().required().positive(),
    year: Joi.string().required().min(4).max(30),
    description: Joi.string().required().min(2).max(2000),
    image: Joi.string().required().pattern(relativeUrlPattern),
    trailerLink: Joi.string().required().pattern(urlPattern),
    thumbnail: Joi.string().required().pattern(relativeUrlPattern),
    movieId: Joi.number().required().positive(),
    nameRU: Joi.string().required().min(2).max(100),
    nameEN: Joi.string().required().min(2).max(100),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required(),
  }),
});

module.exports = {
  validateSignin,
  validateSignup,
  validateUsersMe,
  validateCreateMovie,
  validateDeleteMovie,
};
