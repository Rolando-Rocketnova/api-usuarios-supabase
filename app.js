const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const { noEncontrado, errorHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

// ---------- Middlewares globales ----------
app.use(cors());          // permite que un frontend consuma la API
app.use(express.json());  // lee el body en JSON
app.use(logger);          // registra cada petición

// ---------- Rutas ----------
app.get('/', (req, res) => {
  res.json({
    nombre: 'API de usuarios con Supabase',
    version: '1.0.0',
    endpoints: {
      auth: ['POST /auth/register', 'POST /auth/login', 'GET /auth/perfil 🔒'],
      usuarios: [
        'GET /usuarios 🔒',
        'GET /usuarios/:id 🔒',
        'POST /usuarios 🔒 (admin)',
        'PUT /usuarios/:id 🔒 (propio o admin)',
        'DELETE /usuarios/:id 🔒 (propio o admin)'
      ]
    }
  });
});

app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);

// ---------- Errores (siempre al final) ----------
app.use(noEncontrado);
app.use(errorHandler);

module.exports = app;
