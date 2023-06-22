const MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb';

const JWT_DEV = 'secret-key-only-for-develop';

const BAD_REQUEST_ERROR = 400;
const INTERVAL_SERVER_ERROR = 500;

module.exports = {
  MONGO_URL,
  JWT_DEV,
  BAD_REQUEST_ERROR,
  INTERVAL_SERVER_ERROR,
};
