const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/users');
const { NOT_FOUND_CODE } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '64b01dcc1df786789a1b4f62', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.json());
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый ресурс не найден' });
});

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('DB connect');
  })
  .catch(() => {
    console.log('epic fail');
  });

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
