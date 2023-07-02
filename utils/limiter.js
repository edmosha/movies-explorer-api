const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 2 * 60 * 60 * 1000, // 2 hours
  max: 100,
  message: 'You have exceeded the 100 requests in 2 hours limit!',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
