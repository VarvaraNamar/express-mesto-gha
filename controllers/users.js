const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../utils/BadRequestError');
const NotFoundError = require('../utils/NotFoundError');
const AlreadyExistError = require('../utils/AlreadyExistError');
const AuthError = require('../utils/AuthError');

const { SUCCESS_CODE, CREATED_CODE } = require('../utils/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
}; // все пользователи

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ message: 'Авторизация прошла успешно!' });
    })
    .catch(next);
}; // ЛОГИН

const getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new AuthError('Необходима авторизация');
      } else {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
}; // поиск пользователя

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(SUCCESS_CODE).send({ data: user });
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
    })
    .catch(next);
}; // конкретный пользователь по id

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(CREATED_CODE).send({
        data: {
          name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new AlreadyExistError('Пользователь с указанным email уже существует'));
      } else {
        next(err);
      }
    });
};// создание нового пользователя

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(SUCCESS_CODE).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}; // изменение данных пользователя

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(SUCCESS_CODE).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}; // изменение аватара

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
