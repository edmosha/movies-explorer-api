const router = require('express').Router();
const { signin } = require('../controllers/users');

router.post('/', signin);

module.exports = router;
