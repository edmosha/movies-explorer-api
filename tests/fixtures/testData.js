const validator = require('validator');
const mongoose = require('mongoose');

module.exports.validUserData = {
  email: 'test@mail.ru',
  password: '12345678',
  name: 'Name',
};

module.exports.validUserData2 = {
  email: 'test2@mail.ru',
  password: 'test_test',
};

module.exports.validUserDataToUpdate = {
  name: 'New Name',
  email: 'new_test@mail.ru',
};

module.exports.validMovieData = {
  country: 'Russia',
  director: 'Somebody',
  duration: 120,
  year: 2023,
  description: 'only for test',
  image: 'https://imgur.com/9qoSrW7',
  trailerLink: 'https://imgur.com/9qoSrW7',
  thumbnail: 'https://imgur.com/9qoSrW7',
  movieId: 12345678,
  nameRU: 'Тестовый фильм',
  nameEN: 'Test movie',
};
