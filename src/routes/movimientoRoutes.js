const express = require('express');
const router = express.Router();
const controller = require('../controllers/movimientoController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/:userId', verificarToken, controller.obtenerMovimientos);

module.exports = router;
