const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');
const manejarErrorSupabase = require('../utils/supabaseError');
const { COLUMNAS_PUBLICAS } = require('./authController');

// GET /usuarios?q=ana&rol=admin&pagina=1&limite=10
const obtenerUsuarios = async (req, res) => {
  const pagina = Number(req.query.pagina ?? 1);
  const limite = Number(req.query.limite ?? 10);
  if (!Number.isInteger(pagina) || pagina < 1) {
    throw new AppError('pagina debe ser un entero mayor o igual que 1', 400);
  }
  if (!Number.isInteger(limite) || limite < 1 || limite > 100) {
    throw new AppError('limite debe ser un entero entre 1 y 100', 400);
  }

  const desde = (pagina - 1) * limite;
  const hasta = desde + limite - 1;

  let consulta = supabase
    .from('usuarios')
    .select(COLUMNAS_PUBLICAS, { count: 'exact' })
    .order('id', { ascending: true })
    .range(desde, hasta);

  // Búsqueda por nombre o email (se quitan caracteres especiales del filtro)
  if (req.query.q) {
    const q = String(req.query.q).replace(/[,()%*]/g, '').trim();
    if (q) consulta = consulta.or(`nombre.ilike.%${q}%,email.ilike.%${q}%`);
  }

  if (req.query.rol) {
    if (!['usuario', 'admin'].includes(req.query.rol)) {
      throw new AppError('rol debe ser usuario o admin', 400);
    }
    consulta = consulta.eq('rol', req.query.rol);
  }

  const { data, count, error } = await consulta;
  manejarErrorSupabase(error);

  res.json({
    total: count,
    pagina,
    limite,
    totalPaginas: Math.ceil(count / limite) || 1,
    datos: data
  });
};

// GET /usuarios/:id
const obtenerUsuario = async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(COLUMNAS_PUBLICAS)
    .eq('id', req.idUsuario)
    .maybeSingle();
  manejarErrorSupabase(error);

  if (!data) throw new AppError('Usuario no encontrado', 404);
  res.json(data);
};

// POST /usuarios  (solo admin)
const crearUsuario = async (req, res) => {
  const { nombre, email, password, rol = 'usuario' } = req.body;
  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('usuarios')
    .insert({ nombre: nombre.trim(), email: email.trim().toLowerCase(), password_hash, rol })
    .select(COLUMNAS_PUBLICAS)
    .single();
  manejarErrorSupabase(error);

  res.status(201).json(data);
};

// PUT /usuarios/:id  (el propio usuario o admin)
const actualizarUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (rol !== undefined && req.usuario.rol !== 'admin') {
    throw new AppError('Solo un administrador puede cambiar el rol', 403);
  }

  const cambios = { actualizado_en: new Date().toISOString() };
  if (nombre !== undefined) cambios.nombre = nombre.trim();
  if (email !== undefined) cambios.email = email.trim().toLowerCase();
  if (password !== undefined) cambios.password_hash = await bcrypt.hash(password, 10);
  if (rol !== undefined) cambios.rol = rol;

  const { data, error } = await supabase
    .from('usuarios')
    .update(cambios)
    .eq('id', req.idUsuario)
    .select(COLUMNAS_PUBLICAS)
    .maybeSingle();
  manejarErrorSupabase(error);

  if (!data) throw new AppError('Usuario no encontrado', 404);
  res.json(data);
};

// DELETE /usuarios/:id  (el propio usuario o admin)
const eliminarUsuario = async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', req.idUsuario)
    .select(COLUMNAS_PUBLICAS)
    .maybeSingle();
  manejarErrorSupabase(error);

  if (!data) throw new AppError('Usuario no encontrado', 404);
  res.json({ mensaje: 'Usuario eliminado', usuario: data });
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};
