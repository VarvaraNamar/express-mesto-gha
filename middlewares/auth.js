const jwt = require('jsonwebtoken');
const AuthError = require('../utils/AuthError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }
  req.user = payload;

  next();
};

module.exports = auth;
// const extractBearerToken = (header) => header.replace('Bearer ', '');

// // eslint-disable-next-line consistent-return
// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     throw new AuthError('Необходима авторизация');
//   }

//   const token = extractBearerToken(authorization);
//   let payload;

//   try {
//     payload = jwt.verify(token, 'super-strong-secret');
//   } catch (err) {
//     throw new AuthError('Необходима авторизация');
//   }

//   req.user = payload;

//   next();
// };
