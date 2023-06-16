const express = require('express');
const mongoose = require('mongoose').default;
const index = require('./routes/index');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use('/', index);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});