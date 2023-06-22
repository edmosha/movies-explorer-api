const mongoose = require('mongoose');
const { INTERVAL_SERVER_ERROR, BAD_REQUEST_ERROR } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = INTERVAL_SERVER_ERROR, message } = err;

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(BAD_REQUEST_ERROR).send({ message: 'Передан некорректный id' });
  }

  res.status(statusCode).send(statusCode === 500 ? { message: 'На сервере произошла ошибка' } : { message });

  return next();
};
