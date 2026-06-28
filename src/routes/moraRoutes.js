const express = require('express');
const router = express.Router();
const controller = require('../controllers/moraController');
const { verificarToken, soloRol } = require('../middleware/authMiddleware');

router.get('/',           verificarToken, soloRol('admin','asesor','comite','riesgos','gerencia'), controller.obtenerMora);
router.post('/gestion',   verificarToken, soloRol('admin','asesor','riesgos'), controller.registrarGestion);
router.post('/judicial',  verificarToken, soloRol('admin','comite','riesgos'), controller.derivarJudicial);
router.post('/castigar',  verificarToken, soloRol('comite','gerencia'), controller.castigar);

module.exports = router;
