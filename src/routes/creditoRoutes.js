const express = require('express');
const router = express.Router();
const controller = require('../controllers/creditoController');
const { verificarToken, soloRol } = require('../middleware/authMiddleware');

router.post('/solicitar', verificarToken, soloRol('cliente'), controller.crearSolicitud);
router.get('/solicitudes/:userId', verificarToken, controller.obtenerSolicitudes);
router.get('/todas', verificarToken, soloRol('asesor', 'admin', 'comite'), controller.obtenerTodasSolicitudes);
router.post('/estado', verificarToken, soloRol('asesor', 'admin', 'comite'), controller.actualizarEstado);
router.post('/evaluacion', verificarToken, soloRol('asesor', 'admin'), controller.registrarEvaluacion);

module.exports = router;
