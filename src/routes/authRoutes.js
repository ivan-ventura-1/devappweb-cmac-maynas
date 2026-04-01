// CAPA 1 — ROUTER
// Responsabilidad: definir qué URLs existen
// y qué controller las atiende.
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/authController');

router.post('/login',  controller.login);
router.post('/logout', controller.logout);
router.get('/me',      controller.getMe);

module.exports = router;
