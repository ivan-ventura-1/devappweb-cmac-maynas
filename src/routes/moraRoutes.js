const express = require('express');
const router = express.Router();
const controller = require('../controllers/moraController');
const { verificarToken, soloRol } = require('../middleware/authMiddleware');

router.get('/', verificarToken, soloRol('admin', 'asesor', 'comite'), controller.obtenerMora);
router.post('/gestion', verificarToken, soloRol('admin', 'asesor'), controller.registrarGestion);
router.post('/judicial', verificarToken, soloRol('admin', 'comite'), controller.derivarJudicial);
router.post('/castigar', verificarToken, soloRol('comite'), controller.castigar);

module.exports = router;
