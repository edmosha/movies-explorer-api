const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateDeleteMovie, validateCreateMovie } = require('../middlewares/joiValidation');

router.delete('/:movieId', validateDeleteMovie, deleteMovie);
router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);

module.exports = router;
