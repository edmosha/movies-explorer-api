# movies-explorer-api

### Описание
Бекенд сервиса, в котором можно найти фильмы по запросу и сохранить в личном кабинете. <br>
Поиск фильма является внешним Api. В проекте реализована авторизация и сохроанение фильмов в личном кабинете пользователя.

### Роуты
создаёт пользователя с переданными в теле email, password и name <br>
`POST /signup`

проверяет переданные в теле почту и пароль и возвращает JWT в куках <br>
`POST /signin`

разлогинивает пользователя (удаляет JWT из кук) <br>
`GET /signout`

возвращает информацию о пользователе (email и имя) <br>
`GET /users/me`

обновляет информацию о пользователе (email и имя) <br>
`PATCH /users/me`

возвращает все сохранённые текущим пользователем фильмы <br>
`GET /movies`

создаёт фильм с переданными в теле country, director, duration, year, 
description, image, trailer, nameRU, nameEN и thumbnail, movieId <br>
`POST /movies`

удаляет сохранённый фильм по id <br>
`DELETE /movies/_id a`

**IP:** 158.160.66.154 <br>
**Frontend:** https://movies-exp.edmosha.nomoreparties.sbs <br>
**Backend:** https://api.movies-exp.edmosha.nomoreparties.sbs <br>
