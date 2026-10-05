const express = require('express');
const router = express.Router();

const asyncHandler = require('../utils/asyncHandler');
const verificarToken = require('../middlewares/verificarToken');
const validarId = require('../middlewares/validarId');
const { soloAdmin, propioOAdmin } = require('../middlewares/autorizar');
const { validarCrearUsuario, validarActualizarUsuario } = require('../middlewares/validaciones');
const c = require('../controllers/usuariosController');

// Todas las rutas de /usuarios requieren estar logueado
router.use(verificarToken);

router.get('/', asyncHandler(c.obtenerUsuarios));
router.get('/:id', validarId, asyncHandler(c.obtenerUsuario));
router.post('/', soloAdmin, validarCrearUsuario, asyncHandler(c.crearUsuario));
router.put('/:id', validarId, propioOAdmin, validarActualizarUsuario, asyncHandler(c.actualizarUsuario));
router.delete('/:id', validarId, propioOAdmin, asyncHandler(c.eliminarUsuario));

module.exports = router;
