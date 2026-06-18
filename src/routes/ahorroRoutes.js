const express = require('express');
const router = express.Router();
const controller = require('../controllers/ahorroController');
const { verificarToken, soloRol } = require('../middleware/authMiddleware');

router.get('/cuenta/:userId', verificarToken, controller.obtenerCuenta);
router.post('/crear', verificarToken, soloRol('cliente'), controller.crearCuenta);
router.post('/depositar', verificarToken, controller.depositar);
router.get('/todas', verificarToken, soloRol('asesor', 'admin'), controller.obtenerTodasCuentas);

module.exports = router;
