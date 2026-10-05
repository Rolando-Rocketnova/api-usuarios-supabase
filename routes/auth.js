const express = require('express');
const router = express.Router();

const asyncHandler = require('../utils/asyncHandler');
const verificarToken = require('../middlewares/verificarToken');
const { validarRegistro, validarLogin } = require('../middlewares/validaciones');
const { register, login, perfil } = require('../controllers/authController');

router.post('/register', validarRegistro, asyncHandler(register));
router.post('/login', validarLogin, asyncHandler(login));
router.get('/perfil', verificarToken, asyncHandler(perfil));

module.exports = router;
