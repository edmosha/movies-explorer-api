const Movie = require('../models/movie');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => Movie.findById(movie._id).populate('owner'))
    .then((movieData) => res.send(movieData))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id: filmId } = req.params;

  Movie.findById(filmId)
    .orFail(new DocumentNotFoundError('Запрошиваемый фильм не найден'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return Promise.reject(new ForbiddenError('Недостаточно прав'));
      }

      return Movie.findByIdAndDelete(filmId);
    })
    .then(() => res.send({ message: 'Фильм успешно удален' }))
    .catch(next);
};
