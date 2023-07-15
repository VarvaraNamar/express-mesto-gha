const { Router } = require('express');

const {
  createUser, getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

const usersRouter = Router();

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
