const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');
const manejarErrorSupabase = require('../utils/supabaseError');
const { generarToken } = require('../utils/token');

const COLUMNAS_PUBLICAS = 'id, nombre, email, rol, creado_en, actualizado_en';

// POST /auth/register
const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('usuarios')
    .insert({ nombre: nombre.trim(), email: email.trim().toLowerCase(), password_hash })
    .select(COLUMNAS_PUBLICAS)
    .single();
  manejarErrorSupabase(error);

  res.status(201).json({
    mensaje: 'Usuario registrado',
    usuario: data,
    token: generarToken(data)
  });
};

// POST /auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select(`${COLUMNAS_PUBLICAS}, password_hash`)
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();
  manejarErrorSupabase(error);

  const correcta = usuario && (await bcrypt.compare(password, usuario.password_hash));
  if (!correcta) throw new AppError('Email o contraseña incorrectos', 401);

  const { password_hash, ...datosPublicos } = usuario;
  res.json({ mensaje: 'Login correcto', usuario: datosPublicos, token: generarToken(usuario) });
};

// GET /auth/perfil  (protegida)
const perfil = async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(COLUMNAS_PUBLICAS)
    .eq('id', req.usuario.id)
    .maybeSingle();
  manejarErrorSupabase(error);

  if (!data) throw new AppError('Usuario no encontrado', 404);
  res.json(data);
};

module.exports = { register, login, perfil, COLUMNAS_PUBLICAS };
