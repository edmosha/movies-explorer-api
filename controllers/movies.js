const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find()
    .orFail('Err')
    .then((movies) => res.send(movies.toJSON()))
    .catch(next);
}

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => Movie.findById(movie._id).populate('user'))
    .then((movieData) => res.send(movieData.toJSON()))
    .catch(next);
}

module.exports.deleteMovie = (req, res, next) => {
  const { _id: cardId } = req.params;

  Movie.findById(cardId)
    .orFail('Err')
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return Promise.reject('err');
      }

      return Movie.findByIdAndDelete(cardId);
    })
    .then(() => res.send({ message: 'Фильм успешно удален' }))
    .catch(next);
}
