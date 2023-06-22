const router = require('express').Router();
const { getAboutMe, updateAboutMe } = require('../controllers/users');

router.get('/me', getAboutMe);
router.patch('/me', updateAboutMe);

module.exports = router;
