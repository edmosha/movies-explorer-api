const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.delete('/:_id', deleteMovie);
router.get('/', getMovies);
router.post('/', createMovie);

module.exports = router;
