const router = require('express').Router();
const { signin } = require('../controllers/users');
const { validateSignin } = require('../middlewares/joiValidation');

router.post('/', validateSignin, signin);

module.exports = router;
