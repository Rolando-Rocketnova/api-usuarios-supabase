const AppError = require('../utils/AppError');

const validarId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(new AppError('El id debe ser un número entero positivo', 400));
  }
  req.idUsuario = id;
  next();
};

module.exports = validarId;
