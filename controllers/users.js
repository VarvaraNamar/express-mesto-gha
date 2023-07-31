const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../utils/AuthError');
const BadRequestError = require('../utils/BadRequestError');
const NotFoundError = require('../utils/NotFoundError');
const AlreadyExistError = require('../utils/AlreadyExistError');

const SUCCESS_CODE = 200;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(SUCCESS_CODE).send({ users });
    })
    .catch(next);
}; // все пользователи

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign({ userId }, 'secret-key', {
          expiresIn: '7d',
        });
        return res.send({ message: 'Авторизация прошла успешно', token });
      }
      throw new AuthError('Неверные почта или пароль');
    })
    .catch(next);
}; // ЛОГИН

const getCurrentUser = (req, res, next) => {
  const { userId } = req.user;
  User.findById(userId)
    .then((user) => {
      res.status(SUCCESS_CODE).send({ user });
    })
    .catch(next);
}; // поиск пользователя

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      if (user) {
        res.status(SUCCESS_CODE).send({ user });
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
      res.send({
        data: {
          name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new AlreadyExistError('Пользователь с указанным email уже существует');
      }
    })
    .catch(next);
}; // создание нового пользователя

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
        throw new BadRequestError('Переданы некорректные данные');
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
        throw new BadRequestError('Переданы некорректные данные');
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
