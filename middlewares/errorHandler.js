// Rutas que no existen
const noEncontrado = (req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// Todos los errores terminan aquí (4 parámetros = middleware de errores)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El body no es un JSON válido' });
  }

  const status = err.status || 500;
  if (status === 500) console.error('💥 Error inesperado:', err.original || err);

  const respuesta = { error: status === 500 ? 'Error interno del servidor' : err.message };
  if (err.detalles) respuesta.detalles = err.detalles;

  res.status(status).json(respuesta);
};

module.exports = { noEncontrado, errorHandler };
