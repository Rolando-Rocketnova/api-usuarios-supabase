const AppError = require('../utils/AppError');

// Solo administradores
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return next(new AppError('Solo un administrador puede hacer esto', 403));
  }
  next();
};

// El propio usuario (su mismo :id) o un administrador
const propioOAdmin = (req, res, next) => {
  if (req.usuario.rol === 'admin' || req.usuario.id === req.idUsuario) {
    return next();
  }
  next(new AppError('No tienes permiso sobre este usuario', 403));
};

module.exports = { soloAdmin, propioOAdmin };
