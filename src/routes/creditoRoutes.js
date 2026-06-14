const express = require('express');
const router = express.Router();
const controller = require('../controllers/creditoController');
const { verificarToken, soloRol } = require('../middleware/authMiddleware');

router.post('/solicitar', verificarToken, soloRol('cliente'), controller.crearSolicitud);
router.get('/solicitudes/:userId', verificarToken, controller.obtenerSolicitudes);

module.exports = router;
