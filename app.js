require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose').default;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const index = require('./routes/index');
const limiter = require('./utils/limiter');
const { MONGO_URL } = require('./utils/constants');

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(limiter);

app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://movies-exp.edmosha.nomoreparties.sbs',
    'https://movies-exp.edmosha.nomoreparties.sbs',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  maxAge: 3000,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', index);

module.exports = app;
