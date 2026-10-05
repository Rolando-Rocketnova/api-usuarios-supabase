const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

const generarToken = (usuario) =>
  jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

const verificarTokenJWT = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { generarToken, verificarTokenJWT };
