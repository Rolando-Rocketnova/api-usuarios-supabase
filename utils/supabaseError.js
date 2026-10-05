const AppError = require('./AppError');

// Traduce los errores de Supabase/PostgreSQL a errores HTTP claros
const manejarErrorSupabase = (error) => {
  if (!error) return;
  if (error.code === '23505') {
    throw new AppError('Ese email ya está registrado', 409);
  }
  if (error.code === '23514') {
    throw new AppError('Los datos no cumplen las restricciones de la base de datos', 400);
  }
  const err = new AppError('Error en la base de datos', 500);
  err.original = error;
  throw err;
};

module.exports = manejarErrorSupabase;
