const HTTP_CODES = {
  success: 200, // успешный ответ
  badRequest: 400, // некорректный запрос
  notFound: 404, // код не найден
  serverError: 500, // ошибка на сервере
};

module.exports = {
  HTTP_CODES,
};
