const router = require('express').Router();
const { signup } = require('../controllers/users');

router.post('/', signup);

module.exports = router;
