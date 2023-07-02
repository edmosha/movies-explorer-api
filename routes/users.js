const router = require('express').Router();
const { getAboutMe, updateAboutMe } = require('../controllers/users');
const { validateUsersMe } = require('../middlewares/joiValidation');

router.get('/me', getAboutMe);
router.patch('/me', validateUsersMe, updateAboutMe);

module.exports = router;
