const router = require('express').Router();
const { errors } = require('celebrate');
const users = require('./users');
const movies = require('./movies');
const signin = require('./signin');
const signup = require('./signup');
const signout = require('./signout');
const incorrect = require('./incorrect');
const auth = require('../middlewares/auth');
const errorsHandler = require('../middlewares/errors');
const { requestLogger, errorLogger } = require('../middlewares/logger');

router.use(requestLogger);

router.use('/signin', signin);
router.use('/signup', signup);

router.use(auth);

router.use('/users', users);
router.use('/movies', movies);
router.use('/signout', signout);
router.use('/*', incorrect);

router.use(errorLogger);

router.use(errors());
router.use(errorsHandler);

module.exports = router;
