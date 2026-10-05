const AppError = require('../utils/AppError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = ['usuario', 'admin'];

const reglas = {
  nombre: (v) =>
    typeof v !== 'string' || v.trim().length < 2 || v.trim().length > 100
      ? 'nombre debe tener entre 2 y 100 caracteres'
      : null,
  email: (v) =>
    typeof v !== 'string' || !EMAIL_REGEX.test(v.trim())
      ? 'email no tiene un formato válido'
      : null,
  password: (v) =>
    typeof v !== 'string' || v.length < 8 || !/[A-Za-z]/.test(v) || !/\d/.test(v)
      ? 'password debe tener al menos 8 caracteres, con letras y números'
      : null,
  rol: (v) => (!ROLES.includes(v) ? `rol debe ser: ${ROLES.join(' o ')}` : null)
};

// Crea un middleware de validación
//   permitidos:   campos que se aceptan en el body
//   obligatorios: campos que tienen que venir sí o sí
//   alMenosUno:   (PUT) exige al menos un campo
const validar = ({ permitidos, obligatorios = [], alMenosUno = false }) => (req, res, next) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return next(new AppError('El body debe ser un objeto JSON', 400));
  }

  const errores = [];

  const desconocidos = Object.keys(body).filter((k) => !permitidos.includes(k));
  if (desconocidos.length) errores.push(`Campos no permitidos: ${desconocidos.join(', ')}`);

  obligatorios.forEach((campo) => {
    if (body[campo] === undefined) errores.push(`${campo} es obligatorio`);
  });

  if (alMenosUno && !permitidos.some((c) => body[c] !== undefined)) {
    errores.push('Envía al menos un campo para actualizar');
  }

  permitidos.forEach((campo) => {
    if (body[campo] !== undefined && reglas[campo]) {
      const error = reglas[campo](body[campo]);
      if (error) errores.push(error);
    }
  });

  if (errores.length) return next(new AppError('Datos no válidos', 400, errores));
  next();
};

module.exports = {
  validarRegistro: validar({
    permitidos: ['nombre', 'email', 'password'],
    obligatorios: ['nombre', 'email', 'password']
  }),
  validarLogin: (req, res, next) => {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return next(new AppError('email y password son obligatorios', 400));
    }
    next();
  },
  validarCrearUsuario: validar({
    permitidos: ['nombre', 'email', 'password', 'rol'],
    obligatorios: ['nombre', 'email', 'password']
  }),
  validarActualizarUsuario: validar({
    permitidos: ['nombre', 'email', 'password', 'rol'],
    alMenosUno: true
  })
};
