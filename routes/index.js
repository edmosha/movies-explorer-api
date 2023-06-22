const router = require('express').Router();
const users = require('./users');
const movies = require('./movies');
const { signin, signup } = require('../controllers/users');
const auth = require('../middlewares/auth');
const errorsHandler = require('../middlewares/errors');

router.use('/signin', signin);
router.use('/signup', signup);

router.use(auth);

router.use('/users', users);
router.use('/movies', movies);

router.use(errorsHandler);

module.exports = router;
