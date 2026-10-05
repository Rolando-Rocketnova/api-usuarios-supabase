const AppError = require('../utils/AppError');
const { verificarTokenJWT } = require('../utils/token');

// Exige la cabecera: Authorization: Bearer <token>
const verificarToken = (req, res, next) => {
  const cabecera = req.headers.authorization;

  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    return next(new AppError('Token no proporcionado', 401));
  }

  try {
    req.usuario = verificarTokenJWT(cabecera.split(' ')[1]); // { id, email, rol }
    next();
  } catch (err) {
    next(new AppError('Token inválido o caducado', 401));
  }
};

module.exports = verificarToken;
