const User = require('../models/user');

module.exports.getAboutMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail('Err')
    .then((user) => res.send(user.toJSON()))
    .catch(next);
}

module.exports.updateAboutMe = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name })
    .orFail('Err')
    .then((user) => res.send(user.toJSON()))
    .catch(next);
}
