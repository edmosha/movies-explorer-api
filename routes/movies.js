const {getMovies, createMovie, deleteMovie} = require('../controllers/movies');
const router = require('express').Router();

router.delete('/:_id', deleteMovie);
router.get('/', getMovies);
router.post('/', createMovie);

module.exports = router;
