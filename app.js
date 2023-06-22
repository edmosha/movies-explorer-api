const express = require('express');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const index = require('./routes/index');
const { MONGO_URL } = require('./utils/constants');

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', index);

module.exports = app;
