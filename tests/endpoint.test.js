const supertest = require('supertest');
const mongoose = require('mongoose').default;
const app = require('../app');
const User = require('../models/user');
const Movie = require('../models/movie');
const { MONGO_URL } = require('../utils/constants');
const {
  validUserDataToUpdate,
  validMovieData,
  validUserDataToRegister,
  validUserDataToLogin,
  validAnotherUserDataToLogin,
  validAnotherUserDataToRegister,
  invalidUserDataToLogin,
  invalidUserDataToRegister,
  invalidMovieData,
} = require('./fixtures/testData');

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

// register

describe('POST /singup [Регистрация]', () => {
  afterAll(() => User.findOneAndDelete({ email: validUserDataToRegister.email }));

  it('Запрос с корректными данными не возвращает ошибку', async () => {
    const res = await request.post('/signup').send(validUserDataToRegister);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });

  it('Регистрация с существующим email возвращает ошибку', async () => {
    const res = await request.post('/signup').send(validUserDataToRegister);

    expect(res.status).toBe(409);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toEqual('Пользователь с таким email уже зарегистрирован');
  });

  it('Ошибка Joi если не передано обязательное поле email', async () => {
    const res = await request.post('/signup').send({
      name: validUserDataToRegister.name,
      password: validUserDataToRegister.password,
    });

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toEqual('Validation failed');
  });

  it('Ошибка Joi если не передано обязательное поле password', async () => {
    const res = await request.post('/signup').send({
      email: validUserDataToRegister.email,
      name: validUserDataToRegister.name,
    });

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toEqual('Validation failed');
  });

  it('Ошибка Joi если не передано обязательное поле name', async () => {
    const res = await request.post('/signup').send({
      email: validUserDataToRegister.email,
      password: validUserDataToRegister.email,
    });

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toEqual('Validation failed');
  });

  it('Ошибка Joi если email не корректный', async () => {
    const res = await request.post('/signup').send(invalidUserDataToRegister);

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toEqual('Validation failed');
  });
});

// authorization

describe('POST /singin [авторизация]', () => {
  beforeAll(() => User.create(validUserDataToLogin));

  afterAll(() => User.findOneAndDelete({ email: validUserDataToLogin.email }));

  it('Запрос с корректными данными не возвращает ошибку', async () => {
    const res = await request.post('/signin').send({
      email: validUserDataToLogin.email,
      password: validUserDataToLogin.password,
    });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });

  it('Несуществующий пользователь возвращает ошибку авторизации', async () => {
    const res = await request.post('/signin').send(validAnotherUserDataToLogin);

    expect(res.status).toBe(401);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toEqual('Неправильный email или пароль');
  });

  it('Ошибка Joi если не передано обязательное поле email', async () => {
    const res = await request.post('/signin').send({
      name: validUserDataToLogin.name,
      password: validUserDataToLogin.password,
    });

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toEqual('Validation failed');
  });

  it('Ошибка Joi если не передано обязательное поле password', async () => {
    const res = await request.post('/signin').send({
      email: validUserDataToLogin.email,
      name: validUserDataToLogin.name,
    });

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toEqual('Validation failed');
  });

  it('Ошибка Joi если email не корректный', async () => {
    const res = await request.post('/signin').send(invalidUserDataToLogin);

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.message).toEqual('Validation failed');
  });
});

// endpoints with authorization

describe('Эндпойнты с авторизацией', () => {
  afterAll(async () => {
    await User.findOneAndDelete({ email: validUserDataToLogin.email });
    await User.findOneAndDelete({ email: validUserDataToUpdate.email });
    await User.findOneAndDelete({ email: validAnotherUserDataToLogin.email });
    await Movie.deleteMany({ description: 'only for test' });
  });

  let cookies;
  let movieId;
  let movieId2;

  it('При регистрации не возвращается пароль в теле ответа', async () => {
    const res = await request.post('/signup').send(validUserDataToRegister);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.body.password).toBeUndefined();
  });

  it('При авторизации не возвращается пароль в теле ответа', async () => {
    const res = await request.post('/signin').send(validUserDataToLogin);

    cookies = res.get('Set-Cookie');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
    expect(res.get('Set-Cookie')).toBeDefined();
    expect(res.body.password).toBeUndefined();
  });

  // get about me

  describe('GET /users/me [получение данных пользователя]', () => {
    it('Запрос с корректными данными не возвращает ошибку', async () => {
      const res = await request.get('/users/me').set('Cookie', [cookies]);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.name).toBeDefined();
      expect(res.body.email).toBeDefined();
    });

    it('В теле ответа не возвращается пароль', async () => {
      const res = await request.get('/users/me').set('Cookie', [cookies]);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.password).toBeUndefined();
    });
  });

  // update about me

  describe('PATH /users/me [обновление данных пользователя]', () => {
    it('Запрос с корректными данными не возвращает ошибку', async () => {
      const res = await request.patch('/users/me').send(validUserDataToUpdate).set('Cookie', [cookies]);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.name).toBeDefined();
      expect(res.body.email).toBeDefined();
    });

    it('В теле ответа не возвращается пароль', async () => {
      const res = await request.patch('/users/me').send(validUserDataToUpdate).set('Cookie', [cookies]);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.password).toBeUndefined();
    });
  });

  // create movie

  describe('POST /movies [создание фильма]', () => {
    it('Запрос с корректными данными не возвращает ошибку', async () => {
      const res = await request.post('/movies').send(validMovieData).set('Cookie', [cookies]);
      const res2 = await request.post('/movies').send(validMovieData).set('Cookie', [cookies]);

      movieId = res.body._id;
      movieId2 = res2.body._id;

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.owner).toBeDefined();
    });

    it('Ошибка Joi если не передано обязательное поле', async () => {
      const res = await request.post('/movies').send(invalidMovieData).set('Cookie', [cookies]);

      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.message).toEqual('Validation failed');
    });
  });

  // get movie

  describe('GET /movies [получение всех фильмов]', () => {
    it('Запрос с корректными данными не возвращает ошибку', async () => {
      const res = await request.get('/movies').set('Cookie', [cookies]);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body[0].owner).toBeDefined();
    });
  });

  // delete movie

  describe('DELETE /movies/_id [удаление фильма]', () => {
    it('Запрос с корректными данными не возвращает ошибку', async () => {
      const res = await request.delete(`/movies/${movieId}`).set('Cookie', [cookies]);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.message).toBe('Фильм успешно удален');
    });

    it('[Регистрация нового пользователя]', async () => {
      const res = await request.post('/signup').send(validAnotherUserDataToRegister);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.password).toBeUndefined();
    });

    let newCookies;

    it('[Авторизация нового пользователя]', async () => {
      const res = await request.post('/signin').send(validAnotherUserDataToLogin);

      newCookies = res.get('Set-Cookie');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.get('Set-Cookie')).toBeDefined();
      expect(res.body.password).toBeUndefined();
    });

    it('Пользователь не может удалить чужой фильм', async () => {
      const res = await request.delete(`/movies/${movieId2}`).set('Cookie', [newCookies]);

      expect(res.status).toBe(403);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.message).toBe('Недостаточно прав');
    });
  });

  // signout

  describe('Деавторизация и запросы без авторизации работают корректно', () => {
    it('GET /signout делает успешную спешная деавторизация', async () => {
      const res = await request.get('/signout').set('Cookie', [cookies]);

      cookies = res.get('Set-Cookie');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.get('Set-Cookie')).toBeDefined();
      expect(res.body.message).toBe('Пользователь успешно деавторизирован');
    });

    it('GET /users/me без авторизации возвращает 401 Unauthorized', async () => {
      const res = await request.get('/users/me').set('Cookie', [cookies]);

      expect(res.status).toBe(401);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.message).toBe('Необходима авторизация');
    });

    it('PATCH /users/me без авторизации возвращает 401 Unauthorized', async () => {
      const res = await request.patch('/users/me').send(validUserDataToUpdate).set('Cookie', [cookies]);

      expect(res.status).toBe(401);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.message).toBe('Необходима авторизация');
    });

    it('POST /movies без авторизации возвращает 401 Unauthorized', async () => {
      const res = await request.post('/movies').send(validMovieData).set('Cookie', [cookies]);

      expect(res.status).toBe(401);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.message).toBe('Необходима авторизация');
    });

    it('GET /movies без авторизации возвращает 401 Unauthorized', async () => {
      const res = await request.get('/movies').set('Cookie', [cookies]);

      expect(res.status).toBe(401);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.message).toBe('Необходима авторизация');
    });

    it('DELETE /movies без авторизации возвращает 401 Unauthorized', async () => {
      const res = await request.delete(`/movies/${movieId}`).send(validMovieData).set('Cookie', [cookies]);

      expect(res.status).toBe(401);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.message).toBe('Необходима авторизация');
    });
  });
});
