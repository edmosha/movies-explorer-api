const router = require('express').Router();
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');

router.use('/', () => {
  throw new DocumentNotFoundError('Ошибка 404. Запрашиваемый ресурс не найден');
});

module.exports = router;
