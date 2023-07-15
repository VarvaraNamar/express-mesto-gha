const User = require('../models/user');
const { SUCCESS_CODE } = require('../utils/constants');
const { BAD_REQUEST_CODE } = require('../utils/constants');
const { NOT_FOUND_CODE } = require('../utils/constants');
const { SERVER_ERROR_CODE } = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS_CODE).send(users))
    .catch(() => {
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
}; // все пользователи

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка на сервере' });
    });
}; // конкретный пользователь по id

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(SERVER_ERROR_CODE)
          .send({ message: 'Ошибка на сервере' });
      }
    });
}; // создание нового пользователя

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => res.status(SUCCESS_CODE).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка на сервере' });
    });
}; // изменение данных пользователя

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(
          (error) => error.message,
        );
        return res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные.',
          validationErrors,
        });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка на сервере' });
    });
}; // изменение аватара

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
};
