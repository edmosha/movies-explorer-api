const router = require('express').Router();
const { signup } = require('../controllers/users');
const { validateSignup } = require('../middlewares/joiValidation');

router.post('/', validateSignup, signup);

module.exports = router;
