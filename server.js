const app = require('./app');

const { NODE_ENV } = process.env;
const { PORT = NODE_ENV === 'production' ? 3000 : 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
