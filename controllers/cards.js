const Card = require('../models/card');
const BadRequestError = require('../utils/BadRequestError');
const AccessDeniedError = require('../utils/AccessDeniedError');
const NotFoundError = require('../utils/NotFoundError');

const { SUCCESS_CODE, CREATED_CODE } = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_CODE).send(cards))
    .catch(next);
}; // получение всех карточек

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные.');
      }
    })
    .catch(next);
}; // создание карточки

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      if (!card.owner.equals(req.user._id)) {
        throw new AccessDeniedError('Невозможно удалить карточку другого пользователя');
      }
      card.deleteOne()
        .then(() => {
          res.status(SUCCESS_CODE).send({ message: 'Карточка успешно удалена' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}; // удаление карточки

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
    })
    .catch(next);
};// лайк карточки

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
    })
    .catch(next);
};// дизлайк карточки

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
