const router = require('express').Router();
const users = require('./users');
const movies = require('./movies');

router.use((req, res, next) => {
  // req.user._id = '648c7441ac1c6f75d656c9db';
  next();
})

router.use('/users', users);
router.use('/movies', movies);

module.exports = router;
