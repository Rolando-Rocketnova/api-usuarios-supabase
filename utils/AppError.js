// Error con código HTTP. Uso: throw new AppError('No encontrado', 404)
class AppError extends Error {
  constructor(mensaje, status = 500, detalles = null) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

module.exports = AppError;
