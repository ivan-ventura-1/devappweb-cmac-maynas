const creditoService = require('../services/creditoService');
exports.crearSolicitud = async (req, res) => {
  try {
    console.log('body recibido:', req.body);
    const { userId, monto, plazoMeses, tipoCredito } = req.body;
    if (!userId || !monto || !plazoMeses || !tipoCredito) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }
    const solicitud = await creditoService.crearSolicitud(userId, monto, plazoMeses, tipoCredito);
    res.json({ success: true, data: solicitud });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.obtenerSolicitudes = async (req, res) => {
  try {
    const { userId } = req.params;
    const solicitudes = await creditoService.obtenerSolicitudes(userId);
    res.json({ success: true, data: solicitudes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
