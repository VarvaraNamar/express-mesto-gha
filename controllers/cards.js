const Card = require('../models/card');
const { SUCCESS_CODE } = require('../utils/constants');
const { BAD_REQUEST_CODE } = require('../utils/constants');
const { NOT_FOUND_CODE } = require('../utils/constants');
const { SERVER_ERROR_CODE } = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_CODE).send(cards))
    .catch(() => {
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
}; // получение всех карточек

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(SUCCESS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res
          .status(SERVER_ERROR_CODE)
          .send({ message: 'Ошибка на сервере' });
      }
    });
}; // создание карточки

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.status(SUCCESS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка на сервере' });
    });
}; // удаление карточки

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(SUCCESS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка на сервере' });
    });
}; // лайк карточки

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(SUCCESS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка на сервере' });
    });
}; // дизлайк карточки

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
