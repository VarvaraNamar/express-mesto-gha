const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser, getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/([a-z0-9-]+\.)*[a-z0-9-]+\.[a-z]{2,}\/?([^\s]*)$/),
  }),
}), updateAvatar);

module.exports = usersRouter;
