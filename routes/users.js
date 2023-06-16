const {getAboutMe, updateAboutMe} = require('../controllers/users');
const router = require('express').Router();

router.get('/me',getAboutMe);
router.patch('/me',updateAboutMe);

module.exports = router;
