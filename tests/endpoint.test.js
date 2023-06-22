const supertest = require('supertest');
const mongoose = require('mongoose').default;
const app = require('../app');
const {
  validUserData,
  validUserData2,
  validUserDataToUpdate,
  validMovieData,
} = require('./fixtures/testData');
const User = require('../models/user');
const Movie = require('../models/movie');
const { MONGO_URL } = require('../utils/constants');

const request = supertest(app);

let connect;
beforeAll(async () => {
  connect = await mongoose.createConnection(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return connect;
});

afterAll(() => mongoose.disconnect());

describe('Эндпоинты без авторизации возвращают 401 Unauthorized', () => {
  it('GET /users/me [about me]', async () => {
    const res = await request.get('/users/me');

    expect(res.status).toBe(401);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toBe('Необходима авторизация');
  });
});

describe('Регистрация', () => {
  afterAll(() => User.findOneAndDelete({ email: validUserData.email }));

  it('POST /singup [register]', async () => {
    const res = await request.post('/signup').send(validUserData);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });

  it('POST /singup [регистрация с существующим email возвращает ошибку]', async () => {
    const res = await request.post('/signup').send(validUserData);

    expect(res.status).toBe(409);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toEqual('Пользователь с таким email уже зарегистрирован');
  });
});

describe('Авторизация', () => {
  beforeAll(() => User.create(validUserData));

  afterAll(() => User.findOneAndDelete({ email: validUserData.email }));

  it('POST /singin [несуществующий пользователь возвращает ошибку авторизации]', async () => {
    const res = await request.post('/signin').send(validUserData2);

    expect(res.status).toBe(401);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toEqual('Неправильный email или пароль');
  });

  it('POST /singin [успешная авторизация]', async () => {
    const res = await request.post('/signin').send({ email: validUserData.email, password: validUserData.password });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});

describe('Эндпойнты с авторизацией', () => {
  afterAll(async () => {
    await User.findOneAndDelete({ email: validUserData.email });
    await User.findOneAndDelete({ email: validUserDataToUpdate.email });
    await Movie.deleteMany({ description: 'only for test' });
  });

  let cookies;
  let movieId;

  it('Регистрация', async () => {
    const res = await request.post('/signup').send(validUserData);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });

  it('Авторизация', async () => {
    const res = await request.post('/signin').send({ email: validUserData.email, password: validUserData.password });

    cookies = res.get('Set-Cookie');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.get('Set-Cookie')).toBeDefined();
  });

  describe('GET /users/me [получение данных пользователя]', () => {
    it('Запрос с корректными данными не возвращает ошибку', async () => {
      const res = await request.get('/users/me').set('Cookie', [cookies]);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.name).toBeDefined();
      expect(res.body.email).toBeDefined();
    });
  });

  describe('PATH /users/me [обновление данных пользователя]', () => {
    it('Запрос с корректными данными не возвращает ошибку', async () => {
      const res = await request.patch('/users/me').send(validUserDataToUpdate).set('Cookie', [cookies]);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.name).toBeDefined();
      expect(res.body.email).toBeDefined();
    });
  });

  describe('POST /movies [создание фильма]', () => {
    it('Запрос с корректными данными не возвращает ошибку', async () => {
      const res = await request.post('/movies').send(validMovieData).set('Cookie', [cookies]);

      movieId = res.body._id;

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.owner).toBeDefined();
    });
  });

  describe('GET /movies [получение всех фильмов]', () => {
    it('Запрос с корректными данными не возвращает ошибку', async () => {
      const res = await request.get('/movies').set('Cookie', [cookies]);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body[0].owner).toBeDefined();
    });
  });

  describe('DELETE /movies/_id [удаление фильма]', () => {
    it('Запрос с корректными данными не возвращает ошибку', async () => {
      const res = await request.delete(`/movies/${movieId}`).send(validMovieData).set('Cookie', [cookies]);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.message).toBe('Фильм успешно удален');
    });
  });
});
