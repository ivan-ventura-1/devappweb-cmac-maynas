const express = require('express');
const router = express.Router();
const controller = require('../controllers/creditoController');

router.post('/solicitar', controller.crearSolicitud);
router.get('/solicitudes/:clienteEmail', controller.obtenerSolicitudes);

module.exports = router;
