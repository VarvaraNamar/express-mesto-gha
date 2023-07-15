const Card = require('../models/card');
const HTTP_CODES = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(HTTP_CODES.success).send(cards))
    .catch(() => {
      res.status(HTTP_CODES.serverError).send({ message: 'Ошибка на сервере' });
    });
}; // получение всех карточек

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_CODES.success).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(HTTP_CODES.badRequest)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res
          .status(HTTP_CODES.serverError)
          .send({ message: 'Ошибка на сервере' });
      }
    });
}; // создание карточки

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(HTTP_CODES.notFound)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res
        .status(HTTP_CODES.success)
        .send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(HTTP_CODES.badRequest)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res
          .status(HTTP_CODES.serverError)
          .send({ message: 'Ошибка на сервере' });
      }
    });
}; // удаление карточки

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(HTTP_CODES.notFound)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(HTTP_CODES.success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(HTTP_CODES.badRequest)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res
          .status(HTTP_CODES.serverError)
          .send({ message: 'Ошибка на сервере' });
      }
    });
}; // лайк карточки

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(HTTP_CODES.notFound)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(HTTP_CODES.success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(HTTP_CODES.badRequest)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res
          .status(HTTP_CODES.serverError)
          .send({ message: 'Ошибка на сервере' });
      }
    });
}; // дизлайк карточки

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
